// src/components/LoginForm.js

import React, { useState, useContext, useEffect } from "react";
import "../styling/LoginForm.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);

  const [username, setUsername] = useState(""); // Username instead of email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect to Dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Call the login function from AuthContext
    const result = login(username, password);

    if (result.success) {
      // Redirect to Dashboard
      navigate("/dashboard");
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
        <p className="tagline">Empowering Mentors and Mentees in STEAM Fields. 🦸‍♂️🦸‍♀️</p>
      </div>

      {/* Right Section */}
      <div className="login-right">
        <div className="form-wrapper">
          <h2 className="form-title">Sign In To Your Account</h2>
          <p className="form-subtitle">Let's sign in to your account and get started.</p>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}

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

            <button type="submit" className="submit-btn">Sign In</button>
          </form>

          <div className="links">
            <p>
              Don’t have an account? <a href="/signup">Sign Up</a>
            </p>
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <div className="divider">
            <hr /> <span>OR</span> <hr />
          </div>

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