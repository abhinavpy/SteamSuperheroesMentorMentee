// src/components/RegisterForm.js

import React, { useState, useContext, useEffect } from "react";
import "../styling/LoginForm.css"; // Reuse the same styling as LoginForm
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // Must be unique
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error and success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setError("");
    setSuccess("");

    // Basic validation
    if (!fullName || !email || !username || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Optional: Add more validations (e.g., email format, password strength)
    const emailRegex =
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration successful! You can now log in.");
        // Optionally, redirect to login after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        // Handle errors returned from the backend
        if (data.detail) {
          // If detail is an object (e.g., validation errors)
          if (typeof data.detail === "object") {
            // If it's a list of errors
            if (Array.isArray(data.detail)) {
              const errorMessages = data.detail.map(
                (err) => err.msg
              ).join(" ");
              setError(errorMessages);
            } else if (typeof data.detail === "object" && data.detail.errors) {
              // If it's an object with specific error fields
              const errorMessages = Object.values(data.detail.errors).flat().join(" ");
              setError(errorMessages);
            } else {
              // Fallback
              setError(JSON.stringify(data.detail));
            }
          } else {
            setError(data.detail);
          }
        } else {
          setError("Registration failed.");
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
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
          <h2 className="form-title">Create Your Account</h2>
          <p className="form-subtitle">Join us and start your journey!</p>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Display error or success message */}
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {/* Full Name Input */}
            <div className="input-group">
              <label htmlFor="fullName" className="input-label">Full Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field"
                  placeholder="John Doe"
                  required
                />
                <span className="icon">🧑‍🤝‍🧑</span>
              </div>
            </div>

            {/* Email Input */}
            <div className="input-group">
              <label htmlFor="email" className="input-label">Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="john.doe@example.com"
                  required
                />
                <span className="icon">✉️</span>
              </div>
            </div>

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
                  placeholder="johndoe"
                  required
                />
                <span className="icon">🔑</span>
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

            {/* Confirm Password Input */}
            <div className="input-group">
              <label htmlFor="confirmPassword" className="input-label">Re-enter Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  placeholder="********"
                  required
                />
                <span className="icon">🔒</span>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Registering..." : "Sign Up"}
            </button>
          </form>

          {/* Additional Links */}
          <div className="links">
            <p>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>

          {/* Divider */}
          <div className="divider">
            <hr /> <span>OR</span> <hr />
          </div>

          {/* Social Registration Buttons (Optional) */}
          <div className="social-login">
            <button className="social-btn facebook">Register with Facebook</button>
            <button className="social-btn twitter">Register with Twitter</button>
            <button className="social-btn google">Register with Google</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
