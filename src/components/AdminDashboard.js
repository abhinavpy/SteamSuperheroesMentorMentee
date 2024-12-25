// src/components/AdminDashboard.js

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/Dashboard.css"; // Reuse existing styles or create new ones as needed
import { AuthContext } from "../context/AuthContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import default styles

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Sample events array (you can replace this with dynamic data)
  const events = [
    { date: new Date(2024, 0, 12), title: "Help DStudio get more customers" },
    { date: new Date(2024, 0, 15), title: "Plan a trip" },
    { date: new Date(2024, 0, 20), title: "Return a package" },
  ];

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleNewMatching = () => {
    navigate("/form/section1");
    setIsSidebarVisible(false); // Hide sidebar after navigation on mobile
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  const onChangeCalendar = (date) => {
    setSelectedDate(date);
    // You can add additional logic here, e.g., fetching events for the selected date
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarVisible ? "visible" : "hidden"}`}>
        <h2 className="sidebar-title">Admin Dashboard</h2>
        <ul className="sidebar-menu">
          <li className="menu-item active">Dashboard</li>
          <li className="menu-item">Manage Users</li>
          <li className="menu-item">Form Management</li>
          <li className="menu-item">Reports</li>
          <li className="menu-item">Settings</li>
        </ul>
        <div className="sidebar-projects">
          <h3>Projects</h3>
          <ul>
            <li>
              <span className="dot pink"></span> Event Planning
            </li>
            <li>
              <span className="dot green"></span> Breakfast Plan
            </li>
          </ul>
          <button className="add-project-btn" onClick={handleNewMatching}>
            + View Mentor-Mentee Matching
          </button>
        </div>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <p>Help & Support</p>
        </div>
      </aside>

      {/* Sidebar Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isSidebarVisible ? "✖" : "☰"} {/* Using icons for better UX */}
      </button>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="search-bar">
            <input type="text" placeholder="Search or type a command" />
          </div>
          <div className="header-actions">
            <button className="new-project-btn" onClick={handleNewMatching}>
              + New Mentor Mentee Matching
            </button>
            <div className="profile">
              <img src="https://via.placeholder.com/30" alt="Profile" />
            </div>
          </div>
        </header>

        {/* Greeting Section */}
        <section className="greeting-section">
          <p className="greeting-date">{formattedDate}</p>
          <h1 className="greeting-title">Welcome, Admin!</h1>
          <div className="greeting-stats">
            <div className="stat">
              <span className="stat-icon">📈</span>
              <div>
                <p className="stat-value">150</p>
                <p className="stat-label">Active Users</p>
              </div>
            </div>
            <div className="stat">
              <span className="stat-icon">🛠️</span>
              <div>
                <p className="stat-value">35</p>
                <p className="stat-label">Projects Managed</p>
              </div>
            </div>
            <div className="stat">
              <span className="stat-icon">📅</span>
              <div>
                <p className="stat-value">12</p>
                <p className="stat-label">Upcoming Events</p>
              </div>
            </div>
          </div>
        </section>

        {/* Meetings and Calendar Row */}
        <div className="dashboard-row">
          {/* Active Users Section */}
          <section className="projects-section">
            <header className="section-header">
              <h2>Active Users</h2>
              <button>View All</button>
            </header>
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>user1</td>
                  <td>user1@example.com</td>
                  <td>Mentee</td>
                  <td>
                    <span className="status active">Active</span>
                  </td>
                </tr>
                <tr>
                  <td>user2</td>
                  <td>user2@example.com</td>
                  <td>Mentee</td>
                  <td>
                    <span className="status inactive">Inactive</span>
                  </td>
                </tr>
                <tr>
                  <td>user3</td>
                  <td>user3@example.com</td>
                  <td>Mentee</td>
                  <td>
                    <span className="status active">Active</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Calendar Section */}
          <section className="calendar-section">
            <header className="section-header">
              <h2>Admin Calendar</h2>
            </header>
            <div className="calendar-container">
              <Calendar
                onChange={onChangeCalendar}
                value={selectedDate}
                className="custom-calendar"
                tileClassName={({ date, view }) => {
                  if (view === "month") {
                    const event = events.find(
                      (event) =>
                        event.date.getFullYear() === date.getFullYear() &&
                        event.date.getMonth() === date.getMonth() &&
                        event.date.getDate() === date.getDate()
                    );
                    return event ? "event-date" : null;
                  }
                }}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
