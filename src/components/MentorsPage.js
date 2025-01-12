import React, { useState, useMemo, useEffect } from "react";
import "../styling/MentorMenteeMatchings.css"; // Reuse styling

function MentorsPage() {
  const [mentorsData, setMentorsData] = useState([]);

  // For sorting, searching, pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust as needed

  // 1) Fetch mentors from backend
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/admin/mentors");
        if (!response.ok) {
          throw new Error("Failed to fetch mentors.");
        }
        const data = await response.json();
        setMentorsData(data);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };
    fetchMentors();
  }, []);

  // 2) Sorting logic
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // 3) Build a sorted list (with optional searching)
  const sortedMentors = useMemo(() => {
    let sortable = [...mentorsData];

    // Basic search by name, email, phone_number, etc.
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      sortable = sortable.filter((mentor) =>
        mentor.name?.toLowerCase().includes(lowerSearch) ||
        mentor.email?.toLowerCase().includes(lowerSearch) ||
        mentor.phone_number?.toLowerCase().includes(lowerSearch) ||
        mentor.city?.toLowerCase().includes(lowerSearch) ||
        mentor.state?.toLowerCase().includes(lowerSearch)
      );
    }

    // Sorting
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return sortable;
  }, [mentorsData, searchTerm, sortConfig]);

  // 4) Pagination
  const totalPages = Math.ceil(sortedMentors.length / itemsPerPage);
  const paginatedMentors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedMentors.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedMentors, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 5) Searching & UI
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // 6) Render
  return (
    <div className="matchings-container">
      <h2 className="matchings-title">All Mentors</h2>

      {/* Search input */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search by Name, Email, Phone, City, or State"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {/* Table with ALL fields */}
      <div className="table-container">
        <table className="matchings-table">
          <thead>
            <tr>
              {/* We'll have a column for each field you mentioned */}
              <th onClick={() => handleSort("mentor_id")}>mentor_id</th>
              <th onClick={() => handleSort("name")}>name</th>
              <th onClick={() => handleSort("email")}>email</th>
              <th onClick={() => handleSort("phone_number")}>phone_number</th>
              <th onClick={() => handleSort("role")}>role</th>
              <th onClick={() => handleSort("age_bracket")}>age_bracket</th>
              <th onClick={() => handleSort("steam_background")}>steam_background</th>
              <th onClick={() => handleSort("created_at")}>created_at</th>
              <th onClick={() => handleSort("current_employer")}>current_employer</th>
              <th onClick={() => handleSort("ethnicity_preference")}>ethnicity_preference</th>
              <th onClick={() => handleSort("gender_preference")}>gender_preference</th>
              <th onClick={() => handleSort("academic_level")}>academic_level</th>
              <th onClick={() => handleSort("willing_to_advise")}>willing_to_advise</th>
              <th onClick={() => handleSort("reasons_for_mentoring")}>reasons_for_mentoring</th>
              <th onClick={() => handleSort("state")}>state</th>
              <th onClick={() => handleSort("city")}>city</th>
              {/* For arrays like ethnicities, methods, gender... We'll just display them. */}
            </tr>
          </thead>
          <tbody>
            {paginatedMentors.length > 0 ? (
              paginatedMentors.map((mentor, idx) => {
                return (
                  <tr key={mentor.mentor_id || idx}>
                    <td>{mentor.mentor_id}</td>
                    <td>{mentor.name}</td>
                    <td>{mentor.email}</td>
                    <td>{mentor.phone_number}</td>
                    <td>{mentor.role}</td>
                    <td>{mentor.age_bracket}</td>
                    <td>{mentor.steam_background}</td>
                    <td>{mentor.created_at}</td>
                    <td>{mentor.current_employer}</td>
                    <td>{mentor.ethnicity_preference}</td>
                    <td>{mentor.gender_preference}</td>
                    <td>{mentor.academic_level}</td>
                    <td>{mentor.willing_to_advise}</td>
                    <td>{mentor.reasons_for_mentoring}</td>
                    <td>{mentor.state}</td>
                    <td>{mentor.city}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="16" className="no-data">
                  No mentors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
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
}

export default MentorsPage;
