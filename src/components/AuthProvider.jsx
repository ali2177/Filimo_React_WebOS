// AuthProvider.jsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Lazy init: runs once, avoids a mount-time setState
  const [jwt, setJwt] = useState(() => localStorage.getItem("jwt") || null);

  // Keep localStorage in sync only when jwt actually changes
  useEffect(() => {
    if (jwt == null) localStorage.removeItem("jwt");
    else localStorage.setItem("jwt", jwt);
  }, [jwt]);

  // Memoize to keep the Provider value stable unless jwt changes
  const value = useMemo(() => ({ jwt, setJwt }), [jwt]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
