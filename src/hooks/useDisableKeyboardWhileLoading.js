import { useEffect } from "react";

export function useDisableKeyboardWhileLoading(isLoading) {
  useEffect(() => {
    if (!isLoading) return;
    const handleKeyDown = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isLoading]);
}
