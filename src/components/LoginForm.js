// src/components/LoginForm.js

import React, { useState, useContext, useEffect } from "react";
import "../styling/LoginForm.css";
import { useNavigate, Link } from "react-router-dom"; // Use Link instead of <a>
import { AuthContext } from "../context/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useContext(AuthContext);

  const [username, setUsername] = useState(""); // Username instead of email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Redirect to Dashboard or Admin Panel if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Start loading
    setError(""); // Clear previous errors

    // Call the login function from AuthContext
    const result = await login(username, password);

    setIsLoading(false); // End loading

    if (result.success) {
      // If login is successful, navigation is handled by useEffect
    } else {
      // Display error message
      setError(result.message);
    }
  };

  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="login-left">
        <h1 className="logo">STEAM Superheroes</h1>
        {/* You can uncomment the following lines to include images or icons */}
        {/* <img src="/SteamSuperheroes.png" alt="STEAM Superheroes Logo" /> */}
        {/* <link rel="icon" href="%PUBLIC_URL%/SteamSuperheroesLogo.png" /> */}
        <p className="tagline">Empowering Mentors and Mentees in STEAM Fields. 🦸‍♂️🦸‍♀️</p>
      </div>

      {/* Right Section */}
      <div className="login-right">
        <div className="form-wrapper">
          <h2 className="form-title">Sign In To Your Account</h2>
          <p className="form-subtitle">Let's sign in to your account and get started.</p>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Display error message if any */}
            {error && <div className="error-message">{error}</div>}

            {/* Username Input */}
            <div className="input-group">
              <label htmlFor="username" className="input-label">Username</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  placeholder="user1"
                  required
                />
                <span className="icon">👤</span>
              </div>
            </div>

            {/* Password Input */}
            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="********"
                  required
                />
                <span className="icon">🔒</span>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Additional Links */}
          <div className="links">
            <p>
              Don’t have an account? <Link to="/signup">Sign Up</Link>
            </p>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          {/* Divider */}
          <div className="divider">
            <hr /> <span>OR</span> <hr />
          </div>

          {/* Social Login Buttons */}
          <div className="social-login">
            <button className="social-btn facebook">Facebook</button>
            <button className="social-btn twitter">Twitter</button>
            <button className="social-btn google">Google</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
