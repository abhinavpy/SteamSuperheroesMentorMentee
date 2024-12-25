// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from "react";

// Create the AuthContext with default values
export const AuthContext = createContext({
  isAuthenticated: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  // Read authentication and admin status from localStorage
  // For better reliability, we handle absent keys gracefully.
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    return storedAuth ? JSON.parse(storedAuth) : false;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem("isAdmin");
    return storedAdmin ? JSON.parse(storedAdmin) : false;
  });

  // Whenever isAuthenticated or isAdmin changes, we store them in localStorage
  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
    localStorage.setItem("isAdmin", JSON.stringify(isAdmin));
  }, [isAuthenticated, isAdmin]);

  /**
   * login function:
   * - Checks provided credentials against dummy pairs:
   *   1) Admin:    username="admin", password="admin123"
   *   2) Standard: username="user1", password="password1"
   * - If match, sets isAuthenticated to true and isAdmin accordingly
   * - Returns an object { success: boolean, message?: string }
   */
  const login = (username, password) => {
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
      setIsAdmin(true);
      return { success: true };
    } else if (username === "user1" && password === "password1") {
      setIsAuthenticated(true);
      setIsAdmin(false);
      return { success: true };
    } else {
      // Invalid credentials
      return { success: false, message: "Invalid username or password." };
    }
  };

  /**
   * logout function:
   * - Clears both isAuthenticated and isAdmin states
   * - Removes them from localStorage
   */
  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isAdmin");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
