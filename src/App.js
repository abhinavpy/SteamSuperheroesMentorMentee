// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import MultiStepForm from "./components/MultiStepForm";
import AdminDashboard from "./components/AdminDashboard"; // New Admin Dashboard
import { AuthProvider, AuthContext } from "./context/AuthContext";
import MentorMenteeMatchings from "./components/MentorMenteeMatchings.js"; // New Component
import CreateSessionPage from "./components/CreateSessionPage.js";
import SessionsPage from "./components/SessionsPage.js";
import MenteesPage from "./components/MenteesPage.js";
import MentorsPage from "./components/MentorsPage.js";
import RegisterForm from "./components/RegisterForm"; // Import the RegisterForm
import ViewOnlySessionsPage from "./components/ViewOnlySessionsPage";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<RegisterForm />} /> {/* Add this line */}
                  {/* View Only Sessions Route */}
        <Route path="/sessions" element={<ViewOnlySessionsPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute adminOnly={false}>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminDashboard />
              </PrivateRoute>
            }
          /> 

          {/* Mentor-Mentee Matchings (Protected Admin Only) */}
          <Route
            path="/admin/matchings"
            element={
              <PrivateRoute adminOnly={true}>
                <MentorMenteeMatchings />
              </PrivateRoute>
            }
          />

          {/* Mentor-Mentee Matchings (Protected Admin Only) */}
          <Route
            path="/admin/create-session"
            element={
              <PrivateRoute adminOnly={true}>
                <CreateSessionPage />
              </PrivateRoute>
            }
          />

          {/* Mentors Page (Protected Admin Only) */}
          <Route
            path="/admin/mentors"
            element={
              <PrivateRoute adminOnly={true}>
                <MentorsPage />
              </PrivateRoute>
            }
          />

          {/* Mentees Page (Protected Admin Only) */}
          <Route
            path="/admin/mentees"
            element={
              <PrivateRoute adminOnly={true}>
                <MenteesPage />
              </PrivateRoute>
            }
          />

          {/* Sessions Page (Protected Admin Only) */}
          <Route
            path="/admin/sessions"
            element={
              <PrivateRoute adminOnly={true}>
                <SessionsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/form/*"
            element={
              <PrivateRoute>
                <MultiStepForm />
              </PrivateRoute>
            }
          />

          {/* Redirect any unknown routes to Login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// PrivateRoute component to protect routes
const PrivateRoute = ({ children, adminOnly }) => {
  const { isAuthenticated, isAdmin } = React.useContext(AuthContext);
  if(!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if(adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default App;
