import { useRef, useState } from "react";

export function useModal(videoRef) {
  const [activeModal, setActiveModal] = useState(null);
  const wasPlayingRef = useRef(false);

  const openModal = (type) => {
    const video = videoRef.current;
    wasPlayingRef.current = video ? !video.paused : false;
    if (video && !video.paused) video.pause();
    setActiveModal(type);
  };

  const closeModal = () => {
    const video = videoRef.current;
    setActiveModal(null);
    if (video && wasPlayingRef.current) video.play().catch(() => {});
  };

  return { activeModal, openModal, closeModal };
}
