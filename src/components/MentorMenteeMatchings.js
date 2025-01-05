// src/components/MentorMenteeMatchings.jsx

import React, { useState, useMemo } from "react";
import "../styling/MentorMenteeMatchings.css";

const MentorMenteeMatchings = () => {
  // Dummy data for mentor-mentee matchings
  const matchingsData = [
    {
      id: 1,
      mentorName: "Alice Johnson",
      mentorEmail: "alice.johnson@example.com",
      menteeName: "Bob Smith",
      menteeEmail: "bob.smith@example.com",
      matchDate: "January 10, 2024",
      status: "Active",
    },
    {
      id: 2,
      mentorName: "Charles Lee",
      mentorEmail: "charles.lee@example.com",
      menteeName: "Diana Prince",
      menteeEmail: "diana.prince@example.com",
      matchDate: "January 15, 2024",
      status: "Pending",
    },
    {
      id: 3,
      mentorName: "Evelyn Garcia",
      mentorEmail: "evelyn.garcia@example.com",
      menteeName: "Frank Miller",
      menteeEmail: "frank.miller@example.com",
      matchDate: "January 20, 2024",
      status: "Completed",
    },
    // Add more dummy data as needed
    {
      id: 4,
      mentorName: "George Wilson",
      mentorEmail: "george.wilson@example.com",
      menteeName: "Hannah Brown",
      menteeEmail: "hannah.brown@example.com",
      matchDate: "January 22, 2024",
      status: "Active",
    },
    {
      id: 5,
      mentorName: "Isabella Martinez",
      mentorEmail: "isabella.martinez@example.com",
      menteeName: "Jack Davis",
      menteeEmail: "jack.davis@example.com",
      matchDate: "January 25, 2024",
      status: "Pending",
    },
    // ... more data
  ];

  // State variables for search, filter, sorting, and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust as needed

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Function to get sorted data
  const sortedMatchings = useMemo(() => {
    let sortableMatchings = [...matchingsData];

    // Search Filtering
    if (searchTerm) {
      sortableMatchings = sortableMatchings.filter(
        (matching) =>
          matching.mentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          matching.menteeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          matching.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status Filtering
    if (filterStatus !== "All") {
      sortableMatchings = sortableMatchings.filter(
        (matching) => matching.status === filterStatus
      );
    }

    // Sorting
    if (sortConfig.key) {
      sortableMatchings.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableMatchings;
  }, [matchingsData, sortConfig, searchTerm, filterStatus]);

  // Pagination Calculations
  const totalPages = Math.ceil(sortedMatchings.length / itemsPerPage);
  const paginatedMatchings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedMatchings.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedMatchings, currentPage, itemsPerPage]);

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to reset to first page when filters change
  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    resetToFirstPage();
  };

  // Handle Filter Change
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    resetToFirstPage();
  };

  // Define unique statuses for filter dropdown
  const uniqueStatuses = ["All", ...new Set(matchingsData.map((m) => m.status))];

  return (
    <div className="matchings-container">
      <h2 className="matchings-title">Mentor-Mentee Matchings</h2>

      {/* Search and Filter Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search by Mentor, Mentee, or Status"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />

        <select
          value={filterStatus}
          onChange={handleFilterChange}
          className="filter-select"
        >
          {uniqueStatuses.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Matchings Table */}
      <div className="table-container">
        <table className="matchings-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}>
                ID
                {sortConfig.key === "id" ? (
                  sortConfig.direction === "ascending" ? " 🔼" : " 🔽"
                ) : null}
              </th>
              <th onClick={() => handleSort("mentorName")}>
                Mentor Name
                {sortConfig.key === "mentorName" ? (
                  sortConfig.direction === "ascending" ? " 🔼" : " 🔽"
                ) : null}
              </th>
              <th onClick={() => handleSort("mentorEmail")}>
                Mentor Email
                {sortConfig.key === "mentorEmail" ? (
                  sortConfig.direction === "ascending" ? " 🔼" : " 🔽"
                ) : null}
              </th>
              <th onClick={() => handleSort("menteeName")}>
                Mentee Name
                {sortConfig.key === "menteeName" ? (
                  sortConfig.direction === "ascending" ? " 🔼" : " 🔽"
                ) : null}
              </th>
              <th onClick={() => handleSort("menteeEmail")}>
                Mentee Email
                {sortConfig.key === "menteeEmail" ? (
                  sortConfig.direction === "ascending" ? " 🔼" : " 🔽"
                ) : null}
              </th>
              <th onClick={() => handleSort("matchDate")}>
                Match Date
                {sortConfig.key === "matchDate" ? (
                  sortConfig.direction === "ascending" ? " 🔼" : " 🔽"
                ) : null}
              </th>
              <th onClick={() => handleSort("status")}>
                Status
                {sortConfig.key === "status" ? (
                  sortConfig.direction === "ascending" ? " 🔼" : " 🔽"
                ) : null}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedMatchings.length > 0 ? (
              paginatedMatchings.map((matching) => (
                <tr key={matching.id}>
                  <td>{matching.id}</td>
                  <td>{matching.mentorName}</td>
                  <td>{matching.mentorEmail}</td>
                  <td>{matching.menteeName}</td>
                  <td>{matching.menteeEmail}</td>
                  <td>{matching.matchDate}</td>
                  <td>
                    <span
                      className={`status ${
                        matching.status.toLowerCase().replace(" ", "-")
                      }`}
                    >
                      {matching.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No matchings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`pagination-btn ${
                  currentPage === pageNumber ? "active" : ""
                }`}
              >
                {pageNumber}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MentorMenteeMatchings;
