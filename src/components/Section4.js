// src/components/Section4.jsx

import React from "react";
import "../styling/Form.css";

/**
 * Rows and columns for the availability grid.
 */
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TIMESLOTS = [
  "7am to 9am",
  "9am to 11am",
  "11am to 1pm",
  "1pm to 3pm",
  "3pm to 5pm",
  "5pm to 7pm",
  "7pm to 9pm",
];

function Section4({ data, updateData, onSubmit, loading }) {
  // For user feedback if not enough checkboxes are selected
  const [error, setError] = React.useState("");

  /**
   * Handler for each checkbox in the grid.
   * value will be something like "Monday-7am to 9am".
   */
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      // Add this timeslot to the array
      updateData({ availability: [...(data.availability || []), value] });
    } else {
      // Remove it
      updateData({
        availability: (data.availability || []).filter((slot) => slot !== value),
      });
    }
  };

  /**
   * Submit: Enforce that user has chosen at least 3 checkboxes.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const countSelected = (data.availability || []).length;
    if (countSelected < 3) {
      setError("Please select at least 3 timeslots.");
      return;
    }
    // Passed validation
    setError("");
    onSubmit(); // calls parent’s final submit
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="form-heading">Calendar Availability</h2>
      <p>
        What day/times are good for regular meetings? <br />
        <strong>(Must choose at least 3.)</strong>
      </p>

      {error && <div className="error-message">{error}</div>}

      {/* Build a grid of checkboxes: for each DAY, map over TIMESLOTS */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  backgroundColor: "#F2F2F2",
                  padding: "8px",
                }}
              >
                Day \ Time
              </th>
              {TIMESLOTS.map((time) => (
                <th
                  key={time}
                  style={{
                    backgroundColor: "#F2F2F2",
                    padding: "8px",
                  }}
                >
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) => (
              <tr key={day}>
                {/* Day name in the first column */}
                <td
                  style={{
                    padding: "8px",
                    fontWeight: "bold",
                    backgroundColor: "#FFF",
                  }}
                >
                  {day}
                </td>

                {/* Checkboxes for each timeslot */}
                {TIMESLOTS.map((time) => {
                  const value = `${day}-${time}`; // e.g. "Monday-7am to 9am"
                  return (
                    <td key={value} style={{ textAlign: "center", padding: "8px" }}>
                      <input
                        type="checkbox"
                        value={value}
                        checked={(data.availability || []).includes(value)}
                        onChange={handleCheckboxChange}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="submit"
        className="form-button"
        style={{ marginTop: "20px" }}
        disabled={loading} // Disable button when loading
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

export default Section4;
