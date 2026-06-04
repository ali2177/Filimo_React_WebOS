// utils.js

const BACK_KEY_CODES = new Set([8, 10009, 187, 461]);
export const isBackKey = (e) =>
  e.key === "Backspace" || BACK_KEY_CODES.has(e.keyCode);

/**
 * Parse master playlist and extract subtitle tracks
 * @param {string} url - m3u8 master playlist URL
 * @returns {Promise<Array<{label: string, uri: string}>>}
 */
export async function parseMasterPlaylistForSubtitles(url) {
  const res = await fetch(url);
  const text = await res.text();
  const lines = text.split(/\r?\n/);
  const tracks = [];
  for (let line of lines) {
    if (line.startsWith("#EXT-X-MEDIA") && line.includes("TYPE=SUBTITLES")) {
      const nameMatch = line.match(/NAME="([^"]+)"/);
      const uriMatch = line.match(/URI="([^"]+)"/);
      if (nameMatch && uriMatch)
        tracks.push({ label: nameMatch[1], uri: uriMatch[1] });
    }
  }
  return tracks;
}

/**
 * Parse master playlist and extract available quality levels
 * @param {string} url - m3u8 master playlist URL
 * @returns {Promise<Array<{url: string, height: number}>>}
 */
export async function parseMasterPlaylistForLevels(url) {
  const res = await fetch(url);
  const text = await res.text();
  const lines = text.split(/\r?\n/);
  const levels = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("#EXT-X-STREAM-INF")) {
      const resolutionMatch = lines[i].match(/RESOLUTION=(\d+x\d+)/);
      if (resolutionMatch && i + 1 < lines.length) {
        const levelUrl = new URL(lines[i + 1], url).toString();
        const height = parseInt(resolutionMatch[1].split("x")[1], 10);
        levels.push({ url: levelUrl, height });
      }
    }
  }
  return levels;
}

/**
 * Parse subtitle playlist into segment URLs and the actual segment duration.
 * Reads #EXTINF values from the playlist instead of assuming a fixed duration.
 * @param {string} subUri - m3u8 subtitle playlist URL
 * @returns {Promise<{ segments: string[], segmentDuration: number }>}
 */
export async function parseSubtitleSegments(subUri) {
  const res = await fetch(subUri);
  const text = await res.text();
  const lines = text.split(/\r?\n/);
  const segmentUrls = [];
  const durations = [];

  for (const line of lines) {
    if (line.startsWith("#EXTINF:")) {
      const d = parseFloat(line.slice(8));
      if (!isNaN(d) && d > 0) durations.push(d);
    } else if (line.trim() && !line.startsWith("#")) {
      segmentUrls.push(new URL(line.trim(), subUri).toString());
    }
  }

  // Use the median duration; fall back to 10 s if the playlist has no EXTINF tags
  const segmentDuration =
    durations.length > 0
      ? durations.sort((a, b) => a - b)[Math.floor(durations.length / 2)]
      : 10;

  return { segments: segmentUrls, segmentDuration };
}

/**
 * Fetch a VTT segment and parse cues
 * @param {string} url - URL of the VTT segment
 * @returns {Promise<Array<{start:number,end:number,text:string}>>}
 */
export async function fetchVttSegments(url) {
  const res = await fetch(url);
  const text = await res.text();
  const lines = text.split(/\r?\n/);
  const cues = [];
  let i = 0;

  while (i < lines.length) {
    if (lines[i].includes("-->")) {
      const times = lines[i].split("-->");
      const start = parseVttTime(times[0]);
      const end = parseVttTime(times[1]) + 0.05;
      i++;
      const cueText = [];
      while (i < lines.length && lines[i].trim() !== "") {
        cueText.push(lines[i]);
        i++;
      }
      cues.push({ start, end, text: cueText.join("\n") });
    } else i++;
  }

  return cues;
}

// Helper to parse VTT timestamp — handles both HH:MM:SS.mmm and MM:SS.mmm
function parseVttTime(s) {
  const parts = s.trim().split(":");
  if (parts.length === 2) {
    const secParts = parts[1].split(".");
    return (
      parseInt(parts[0], 10) * 60 +
      parseInt(secParts[0], 10) +
      parseInt(secParts[1] || "0", 10) / 1000
    );
  }
  const secParts = parts[2].split(".");
  return (
    parseInt(parts[0], 10) * 3600 +
    parseInt(parts[1], 10) * 60 +
    parseInt(secParts[0], 10) +
    parseInt(secParts[1] || "0", 10) / 1000
  );
}
