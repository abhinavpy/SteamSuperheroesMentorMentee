import React from "react";
import "../styling/Form.css";

/** 
 * Define constants for the multiple-choice and checkbox options 
 */

// Grade (radio) options
const GRADE_OPTIONS = [
  "5th grade",
  "6th grade",
  "8th grade",
  "9th grade",
  "10th grade",
  "11th grade",
  "12th grade",
  "College Freshman",
  "College Sophomore",
  "College Junior",
  "College Senior",
  "Graduate Student",
];

// Reasons for Wanting a Mentor (checkboxes)
// The last one "Other…" triggers a text box
const REASONS_OPTIONS = [
  "Career Exploration",
  "Do better in school",
  "Learn about STEAM",
  "Other…",
];

// Interests (checkboxes)
// The last one "Other…" triggers a text box
const INTERESTS_OPTIONS = [
  "Science",
  "Dance",
  "Math",
  "Music",
  "Building",
  "Robotics",
  "Art",
  "Other…",
];

function Section3Mentee({ data, updateData, onNext }) {
  // Radio or text changes
  const handleChange = (e) => {
    updateData({ [e.target.name]: e.target.value });
  };

  // Handle checkboxes for reasonsForMentor or interests
  const handleCheckboxChange = (e, fieldName, otherFieldName) => {
    const { value, checked } = e.target;
    if (checked) {
      // Add value to the array
      updateData({ [fieldName]: [...data[fieldName], value] });
    } else {
      // Remove value from the array
      updateData({
        [fieldName]: data[fieldName].filter((item) => item !== value),
      });
    }

    // If the user *unchecks* "Other…", optionally clear the related text field
    if (!checked && value === "Other…" && otherFieldName) {
      updateData({ [otherFieldName]: "" });
    }
  };

  // Form submission: move to the next step (Section 4)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Optional validation
    onNext();
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2 className="form-heading">Mentee Profile Questions</h2>

      {/* Grade (radio) */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold" }}>Grade:</label>
        <div>
          {GRADE_OPTIONS.map((grade) => (
            <label key={grade} style={{ display: "block", marginTop: "5px" }}>
              <input
                type="radio"
                name="grade"
                value={grade}
                checked={data.grade === grade}
                onChange={handleChange}
              />
              {` ${grade}`}
            </label>
          ))}
        </div>
      </div>

      {/* Reasons for Wanting a Mentor (checkboxes) */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold" }}>Reasons for Wanting a Mentor:</label>
        <div>
          {REASONS_OPTIONS.map((reason) => (
            <label key={reason} style={{ display: "block", marginTop: "5px" }}>
              <input
                type="checkbox"
                name="reasonsForMentor"
                value={reason}
                checked={data.reasonsForMentor.includes(reason)}
                onChange={(e) => handleCheckboxChange(e, "reasonsForMentor", "reasonsForMentorOther")}
              />
              {` ${reason}`}
            </label>
          ))}
        </div>
        {/* If "Other…" is selected, display the text box */}
        {data.reasonsForMentor.includes("Other…") && (
          <label className="floating-label" style={{ marginTop: "5px" }}>
            <input
              type="text"
              name="reasonsForMentorOther"
              placeholder=" "
              className="floating-input"
              value={data.reasonsForMentorOther || ""}
              onChange={handleChange}
            />
            <span className="floating-label-text">Other reason (please specify)</span>
          </label>
        )}
      </div>

      {/* Interests (checkboxes) */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold" }}>Interests:</label>
        <div>
          {INTERESTS_OPTIONS.map((interest) => (
            <label
              key={interest}
              style={{ display: "block", marginTop: "5px" }}
            >
              <input
                type="checkbox"
                name="interests"
                value={interest}
                checked={data.interests.includes(interest)}
                onChange={(e) => handleCheckboxChange(e, "interests", "interestsOther")}
              />
              {` ${interest}`}
            </label>
          ))}
        </div>
        {/* If "Other…" is selected, display the text box */}
        {data.interests.includes("Other…") && (
          <label className="floating-label" style={{ marginTop: "5px" }}>
            <input
              type="text"
              name="interestsOther"
              placeholder=" "
              className="floating-input"
              value={data.interestsOther || ""}
              onChange={handleChange}
            />
            <span className="floating-label-text">Other interest (please specify)</span>
          </label>
        )}
      </div>

      <button type="submit" className="form-button">
        Next
      </button>
    </form>
  );
}

export default Section3Mentee;
