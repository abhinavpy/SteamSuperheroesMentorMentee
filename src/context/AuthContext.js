// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from "react";

// Create the AuthContext with default values
export const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

// Create a provider component
export const AuthProvider = ({ children }) => {
  // Initialize state based on localStorage (optional for persistence)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    return storedAuth ? JSON.parse(storedAuth) : false;
  });

  // Update localStorage whenever isAuthenticated changes
  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  // Mock login function (replace with real authentication logic)
  const login = (username, password) => {
    // Dummy credentials: Username: user1, Password: password1
    if (username === "user1" && password === "password1") {
      setIsAuthenticated(true);
      return { success: true };
    } else {
      return { success: false, message: "Invalid username or password." };
    }
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    // Optionally, remove from localStorage
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
