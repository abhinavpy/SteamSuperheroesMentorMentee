import React, { useState, useMemo, useEffect } from "react";
import "../styling/MentorMenteeMatchings.css";

function MenteesPage() {
  const [menteesData, setMenteesData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1) Fetch mentees
  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/admin/mentees");
        if (!response.ok) {
          throw new Error("Failed to fetch mentees");
        }
        const data = await response.json();
        setMenteesData(data);
      } catch (error) {
        console.error("Error fetching mentees:", error);
      }
    };
    fetchMentees();
  }, []);

  // 2) Sort
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // 3) Build sorted, filtered list
  const sortedMentees = useMemo(() => {
    let sortable = [...menteesData];

    // Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      sortable = sortable.filter((mentee) =>
        mentee.name?.toLowerCase().includes(lower) ||
        mentee.email?.toLowerCase().includes(lower) ||
        mentee.phone_number?.toLowerCase().includes(lower) ||
        mentee.city?.toLowerCase().includes(lower) ||
        mentee.state?.toLowerCase().includes(lower)
      );
    }

    // Sort
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
  }, [menteesData, searchTerm, sortConfig]);

  // 4) Pagination
  const totalPages = Math.ceil(sortedMentees.length / itemsPerPage);
  const paginatedMentees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedMentees.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedMentees, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 5) Search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // 6) Render with every field
  return (
    <div className="matchings-container">
      <h2 className="matchings-title">All Mentees</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by Name, Email, Phone, City, or State"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="table-container">
        <table className="matchings-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("mentee_id")}>mentee_id</th>
              <th onClick={() => handleSort("name")}>name</th>
              <th onClick={() => handleSort("email")}>email</th>
              <th onClick={() => handleSort("phone_number")}>phone_number</th>
              <th onClick={() => handleSort("role")}>role</th>
              <th onClick={() => handleSort("age_bracket")}>age_bracket</th>
              <th onClick={() => handleSort("created_at")}>created_at</th>
              <th onClick={() => handleSort("grade")}>grade</th>
              <th onClick={() => handleSort("ethnicity_preference")}>ethnicity_preference</th>
              <th onClick={() => handleSort("gender_preference")}>gender_preference</th>
              <th onClick={() => handleSort("state")}>state</th>
              <th onClick={() => handleSort("city")}>city</th>
              {/* And so on for each field: methods, availability, reasons_for_mentor, etc. */}
            </tr>
          </thead>
          <tbody>
            {paginatedMentees.length > 0 ? (
              paginatedMentees.map((mentee, idx) => {
                return (
                  <tr key={mentee.mentee_id || idx}>
                    <td>{mentee.mentee_id}</td>
                    <td>{mentee.name}</td>
                    <td>{mentee.email}</td>
                    <td>{mentee.phone_number}</td>
                    <td>{mentee.role}</td>
                    <td>{mentee.age_bracket}</td>
                    <td>{mentee.created_at}</td>
                    <td>{mentee.grade}</td>
                    <td>{mentee.ethnicity_preference}</td>
                    <td>{mentee.gender_preference}</td>
                    <td>{mentee.state}</td>
                    <td>{mentee.city}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="12" className="no-data">
                  No mentees found.
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

export default MenteesPage;
