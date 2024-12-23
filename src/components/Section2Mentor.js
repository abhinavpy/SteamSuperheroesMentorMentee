import React from "react";
import "../styling/Form.css";

/**
 * If you like, define or import constants for the multiple-choice options.
 * This keeps the JSX cleaner. Example:
 */
const STEAM_BACKGROUND_OPTIONS = ["Professional", "Student"];

const ACADEMIC_LEVEL_OPTIONS = [
  "High School Freshman",
  "High School Sophomore",
  "High School Junior",
  "High School Senior",
  "College Undergraduate",
  "Graduate School",
  "Graduated / Working Professional",
];

const REASONS_FOR_MENTORING_OPTIONS = [
  "Give back to community",
  "Volunteer hours",
  "Other",
];

function Section2Mentor({ data, updateData, onNext }) {
  // Generic text or radio/checkbox changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  // When the user submits Section 2, we move on (to Section 4, typically)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Optional: you can validate this section here before proceeding.
    onNext();
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="form-heading">Mentor Profile Questions</h2>

      {/* STEAM Background (radio) */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold" }}>STEAM Background:</label>
        <div>
          {STEAM_BACKGROUND_OPTIONS.map((option) => (
            <label key={option} style={{ display: "block", marginTop: "5px" }}>
              <input
                type="radio"
                name="steamBackground"
                value={option}
                checked={data.steamBackground === option}
                onChange={handleChange}
              />
              {` ${option}`}
            </label>
          ))}
        </div>
      </div>

      {/* Current Academic Level (radio) */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold" }}>Current Academic Level:</label>
        <div>
          {ACADEMIC_LEVEL_OPTIONS.map((level) => (
            <label key={level} style={{ display: "block", marginTop: "5px" }}>
              <input
                type="radio"
                name="academicLevel"
                value={level}
                checked={data.academicLevel === level}
                onChange={handleChange}
              />
              {` ${level}`}
            </label>
          ))}
        </div>
      </div>

      {/* Professional/Job Title (text, floating label) */}
      <label className="floating-label">
        <input
          type="text"
          name="professionalTitle"
          placeholder=" "
          className="floating-input"
          value={data.professionalTitle || ""}
          onChange={handleChange}
        />
        <span className="floating-label-text">
          Professional/Job Title (Enter N/A if not graduated)
        </span>
      </label>

      {/* Current Employer (text, floating label) */}
      <label className="floating-label">
        <input
          type="text"
          name="currentEmployer"
          placeholder=" "
          className="floating-input"
          value={data.currentEmployer || ""}
          onChange={handleChange}
        />
        <span className="floating-label-text">Current Employer</span>
      </label>

      {/* Reasons for Mentoring (radio) */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold" }}>Reasons for Mentoring:</label>
        <div>
          {REASONS_FOR_MENTORING_OPTIONS.map((reason) => (
            <label key={reason} style={{ display: "block", marginTop: "5px" }}>
              <input
                type="radio"
                name="reasonsForMentoring"
                value={reason}
                checked={data.reasonsForMentoring === reason}
                onChange={handleChange}
              />
              {` ${reason}`}
            </label>
          ))}
        </div>
      </div>

      {/* Number of mentees (linear scale 1-10) */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold" }}>
          How many individual mentees are you willing to advise?
        </label>
        <div style={{ marginTop: "5px" }}>
          <input
            type="range"
            name="willingToAdvise"
            min="1"
            max="10"
            value={data.willingToAdvise || 1}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
          <div style={{ textAlign: "center", marginTop: "5px" }}>
            {data.willingToAdvise || 1} mentee(s)
          </div>
        </div>
      </div>

      {/* Submit (Next) Button */}
      <button type="submit" className="form-button">
        Next
      </button>
    </form>
  );
}

export default Section2Mentor;
