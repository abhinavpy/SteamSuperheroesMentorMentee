// src/pages/CreateSessionPage.jsx
import React, { useState } from "react";
import "../styling/Form.css"; // Ensure we import the form styling

// Example constants for session details
const SESSION_TYPE_OPTIONS = [
  "Homework Help",
  "Exposure to STEAM in general",
  "College guidance",
  "Career guidance",
  "Explore a particular field",
  "Other: text"
];
const MEETING_DURATION_OPTIONS = [
  "15 min",
  "30 min",
  "45 min",
  "1 hour",
  "1.5 hours",
  "2 hours",
  "Other"
];
const CADENCE_OPTIONS = ["Weekly", "Bi-Weekly", "Monthly", "Ad Hoc"];

// Regex to validate yyyymmdd
const dateRegex = /^[0-9]{8}$/;

function CreateSessionPage() {
  const [sessionData, setSessionData] = useState({
    sessionId: "",
    sessionType: "",
    sessionStart: "",
    sessionEnd: "",
    nbrMeetings: "",
    meetingDurations: [],
    cadence: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Generic input change for text / select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionData((prev) => ({ ...prev, [name]: value }));
  };

  // For meeting durations (checkbox array)
  const handleMeetingDurationChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSessionData((prev) => ({
        ...prev,
        meetingDurations: [...prev.meetingDurations, value],
      }));
    } else {
      setSessionData((prev) => ({
        ...prev,
        meetingDurations: prev.meetingDurations.filter((d) => d !== value),
      }));
    }
  };

  // Simple validation
  const validateSessionData = () => {
    if (!sessionData.sessionId) {
      return "SessionID is required.";
    }
    if (!sessionData.sessionStart || !dateRegex.test(sessionData.sessionStart)) {
      return "SessionStart must be in YYYYMMDD format, e.g. 20250103.";
    }
    if (!sessionData.sessionEnd || !dateRegex.test(sessionData.sessionEnd)) {
      return "SessionEnd must be in YYYYMMDD format, e.g. 20250603.";
    }
    if (sessionData.nbrMeetings === "") {
      return "Number of Meetings is required. (Numeric)";
    }
    const num = parseInt(sessionData.nbrMeetings, 10);
    if (isNaN(num) || num < 1) {
      return "Number of Meetings must be a positive integer.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const error = validateSessionData();
    if (error) {
      setErrorMsg(error);
      return;
    }

    // Start loading
    setLoading(true);

    // Prepare the payload in the shape your API expects
    // e.g. session_id, session_type, etc.
    const payload = {
      session_id: sessionData.sessionId,
      session_type: sessionData.sessionType,
      session_start: sessionData.sessionStart,
      session_end: sessionData.sessionEnd,
      nbr_meetings: Number(sessionData.nbrMeetings), // Ensure it's numeric
      meeting_durations: sessionData.meetingDurations,
      cadence: sessionData.cadence,
    };

    try {
      // Adjust the URL to your actual server domain & port
      const response = await fetch("http://127.0.0.1:8000/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errBody = await response.json();
        throw new Error(errBody.detail || "Failed to create session.");
      }

      const data = await response.json();
      console.log("Session created successfully:", data);
      alert("Session created successfully!");

      // Optionally reset
      setSessionData({
        sessionId: "",
        sessionType: "",
        sessionStart: "",
        sessionEnd: "",
        nbrMeetings: "",
        meetingDurations: [],
        cadence: "",
      });
    } catch (err) {
      console.error("Error creating session:", err.message);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2 className="form-heading">Create a New Session</h2>

        {errorMsg && <div className="error-message">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          {/* SessionID (floating label) */}
          <label className="floating-label">
            <input
              type="text"
              name="sessionId"
              className="floating-input"
              placeholder=" "
              value={sessionData.sessionId}
              onChange={handleChange}
              required
            />
            <span className="floating-label-text">SessionID (alphanumeric)</span>
          </label>

          {/* SessionType (select) */}
          <select
            name="sessionType"
            className="form-input"
            value={sessionData.sessionType}
            onChange={handleChange}
            required
          >
            <option value="">Select a Session Type</option>
            {SESSION_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* SessionStart (floating label) */}
          <label className="floating-label">
            <input
              type="text"
              name="sessionStart"
              className="floating-input"
              placeholder=" "
              value={sessionData.sessionStart}
              onChange={handleChange}
              required
            />
            <span className="floating-label-text">
              SessionStart (yyyymmdd)
            </span>
          </label>

          {/* SessionEnd (floating label) */}
          <label className="floating-label">
            <input
              type="text"
              name="sessionEnd"
              className="floating-input"
              placeholder=" "
              value={sessionData.sessionEnd}
              onChange={handleChange}
              required
            />
            <span className="floating-label-text">
              SessionEnd (yyyymmdd)
            </span>
          </label>

          {/* NbrMeetings (floating label, number) */}
          <label className="floating-label">
            <input
              type="number"
              name="nbrMeetings"
              className="floating-input"
              placeholder=" "
              value={sessionData.nbrMeetings}
              onChange={handleChange}
            />
            <span className="floating-label-text">Number of Meetings</span>
          </label>

          {/* Meeting Duration(s): multiple checkboxes */}
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}
            >
              Meeting Duration(s):
            </label>
            {MEETING_DURATION_OPTIONS.map((opt) => (
              <label key={opt} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  name="meetingDurations"
                  value={opt}
                  checked={sessionData.meetingDurations.includes(opt)}
                  onChange={handleMeetingDurationChange}
                />
                {` ${opt}`}
              </label>
            ))}
          </div>

          {/* Cadence (select) */}
          <select
            name="cadence"
            className="form-input"
            value={sessionData.cadence}
            onChange={handleChange}
            required
          >
            <option value="">Select Cadence</option>
            {CADENCE_OPTIONS.map((cd) => (
              <option key={cd} value={cd}>
                {cd}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="form-button"
            style={{ marginTop: "10px" }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Session"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateSessionPage;
