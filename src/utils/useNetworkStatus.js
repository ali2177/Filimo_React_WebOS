import { useState, useEffect } from "react";

// A simple function to check internet connectivity by pinging a server
const checkInternetConnection = async () => {
  try {
    const response = await fetch("https://www.google.com", {
      method: "HEAD",
      cache: "no-cache",
    });
    return response.ok;
  } catch (err) {
    return false;
  }
};

function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Define the event handlers for 'online' and 'offline' events
    const handleOnline = async () => {
      // Check real connectivity by pinging a server
      const isRealOnline = await checkInternetConnection();
      setIsOnline(true);
    };

    const handleOffline = () => setIsOnline(false);

    // Add event listeners for 'online' and 'offline'
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check on mount
    if (navigator.onLine) {
      handleOnline();
    }

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

export default useNetworkStatus;
