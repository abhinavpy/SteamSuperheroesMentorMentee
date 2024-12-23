// src/components/Dashboard.js

import React from "react";
import { useNavigate } from "react-router-dom";
import "../styling/Dashboard.css";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = React.useContext(AuthContext);

  const handleNewMatching = () => {
    navigate("/form/section1");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Mondays</h2>
        <ul className="sidebar-menu">
          <li className="menu-item active">Dashboard</li>
          <li className="menu-item">Projects</li>
          <li className="menu-item">My Task</li>
          <li className="menu-item">Chats</li>
          <li className="menu-item">Documents</li>
          <li className="menu-item">Receipts</li>
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
            + New Mentor-Mentee Matching
          </button>
        </div>
        <div className="sidebar-footer">
          <p onClick={logout} style={{ cursor: "pointer" }}>Logout</p>
          <p>Help & Support</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="search-bar">
            <input type="text" placeholder="Search or type a command" />
          </div>
          <div className="header-actions">
            <button className="new-project-btn" onClick={handleNewMatching}>
              + New Mentor-Mentee Matching
            </button>
            <div className="profile">
              <img src="https://via.placeholder.com/30" alt="Profile" />
            </div>
          </div>
        </header>

        {/* Greeting Section */}
        <section className="greeting-section">
          <h1>Good Evening! John,</h1>
          <div className="stats">
            <div>
              <span>⏱</span> 12hrs Time Saved
            </div>
            <div>
              <span>✅</span> 24 Projects Completed
            </div>
            <div>
              <span>⚙️</span> 7 Projects In-progress
            </div>
          </div>
        </section>

        {/* Projects Table */}
        <section className="projects-section">
          <header className="section-header">
            <h2>My Projects</h2>
            <button>See All</button>
          </header>
          <table className="projects-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Assign</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Help DStudio get more customers</td>
                <td>Phoenix Winters</td>
                <td>
                  <span className="status in-progress">In Progress</span>
                </td>
              </tr>
              <tr>
                <td>Plan a trip</td>
                <td>Cohen Merritt</td>
                <td>
                  <span className="status pending">Pending</span>
                </td>
              </tr>
              <tr>
                <td>Return a package</td>
                <td>Lukas Juarez</td>
                <td>
                  <span className="status completed">Completed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
