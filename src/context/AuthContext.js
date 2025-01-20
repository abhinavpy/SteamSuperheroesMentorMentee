// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from "react";

// Create the AuthContext with default values
export const AuthContext = createContext({
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  logout: () => {},
});

// Create a provider component
export const AuthProvider = ({ children }) => {
  // Initialize authentication state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    return storedAuth ? JSON.parse(storedAuth) : false;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem("isAdmin");
    return storedAdmin ? JSON.parse(storedAdmin) : false;
  });

  // Update localStorage whenever authentication state changes
  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
    localStorage.setItem("isAdmin", JSON.stringify(isAdmin));
  }, [isAuthenticated, isAdmin]);

  /**
   * login function:
   * - Admin users: Verified against hardcoded credentials.
   * - General users: Authenticated via backend API.
   * - Returns an object { success: boolean, message?: string }
   */
  const login = async (username, password) => {
    // Check if the user is admin
    if (username === "admin") {
      // Hardcoded admin credentials
      const ADMIN_PASSWORD = "admin123"; // Consider storing this securely
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        setIsAdmin(true);
        return { success: true };
      } else {
        return { success: false, message: "Invalid admin credentials." };
      }
    }

    // For general users, authenticate via the backend API
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { role } = data; // Assuming role is either 'user' or 'admin'

        setIsAuthenticated(true);
        setIsAdmin(role === "admin"); // Although admin is hardcoded, handle just in case

        return { success: true };
      } else {
        // Handle errors returned from the API
        return { success: false, message: data.detail || "Login failed." };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "An error occurred during login." };
    }
  };

  /**
   * logout function:
   * - Clears authentication state.
   * - Removes authentication flags from localStorage.
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
