import { useCallback } from "react";
import { useAuth } from "@src/components/AuthProvider";

const USER_AGENT = JSON.stringify({ os: "WebOs", an: "Filimo", vn: "1.00" });

export function useFilimioFetch() {
  const { jwt } = useAuth();

  return useCallback(
    (url, options = {}) => {
      const { headers: extraHeaders, ...rest } = options;
      const headers = {
        UserAgent: USER_AGENT,
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        ...extraHeaders,
      };
      return fetch(url, { method: "GET", ...rest, headers });
    },
    [jwt]
  );
}
