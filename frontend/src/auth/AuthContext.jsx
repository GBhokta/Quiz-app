import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/auth.api";
import { isAuthenticated } from "./auth.utils";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    if (!isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await getProfile();
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // Load user on first app load
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loadUser,   // 👈 THIS IS CRITICAL
        isTestMaker: user?.roles?.includes("TEST_MAKER"),
        isStudent: user?.roles?.includes("STUDENT"),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
