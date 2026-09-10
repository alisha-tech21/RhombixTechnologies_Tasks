import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("ga_user");
    return saved ? JSON.parse(saved) : null;
  });

  function login(userData, token) {
    localStorage.setItem("ga_token", token);
    localStorage.setItem("ga_user", JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("ga_token");
    localStorage.removeItem("ga_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
