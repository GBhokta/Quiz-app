import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/auth.api";
import { isAuthenticated, logout } from "./auth.utils";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load logged-in user from backend
  async function loadUser() {
    // 1️⃣ No token → user is not logged in
    if (!isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // 2️⃣ Token exists → fetch profile
      const res = await getProfile();
      console.log("Profile loaded:", res.data);
      setUser(res.data); // backend already sends role
    } catch (error) {
      // 3️⃣ Token invalid / expired
      logout();
      setUser(null);
    } finally {
      // 4️⃣ Auth check completed
      setLoading(false);
    }
  }

  // 🔹 Run once when app loads
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loadUser, // used after login
        isTestMaker: user?.role === "TEST_MAKER",
        isStudent: user?.role === "STUDENT",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
