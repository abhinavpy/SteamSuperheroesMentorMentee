import React, { useState } from "react";
import "../styling/Form.css";

// Age bracket options for radio buttons
const AGE_BRACKETS = [
  "9-13",
  "13-18",
  "18-22",
  "22-30",
  "30-40",
  "40-50",
  "50-60",
  "60+",
];

// US States (value : label)
const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DC", label: "District of Columbia" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachussetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

// Ethnicity (checkbox) options
const ETHNICITY_OPTIONS = [
  "American Indian or Alaska Native",
  "Asian: Includes Chinese, Japanese, Filipino, Korean, South Asian, and Vietnamese",
  "South Asian: Includes Indian, Pakistan, Sri Lankan, Bangaladesh",
  "Black or African American: Includes Jamaican, Nigerian, Haitian, and Ethiopian",
  "Hispanic or Latino: Includes Puerto Rican, Mexican, Cuban, Salvadoran, and Colombian",
  "Middle Eastern or North African: Includes Lebanese, Iranian, Egyptian, Moroccan, Israeli, and Palestinian",
  "Native Hawaiian or Pacific Islander: Includes Samoan, Guamanian, Chamorro, and Tongan",
  "White or European: Includes German, Irish, English, Italian, Polish, and French",
  "Other…",
];

// Session Type (checkbox) options
const SESSION_TYPE_PREFERENCES = [
  "Homework Help",
  "Exposure to STEAM in general",
  "College guidance",
  "Career guidance",
  "Explore a particular field",
  "Other: text"
];

// Ethnicity matching preference (radio)
const ETHNICITY_MATCH_OPTIONS = [
  "Prefer ONLY to be matched within that similarity",
  "Prefer it, but available to others as needed",
  "Prefer NOT to be matched within that similarity",
  "Do not have a preference. Either is fine.",
  "Other…",
];

// Gender (checkbox) options
const GENDER_OPTIONS = [
  "Cisgender Male",
  "Cisgender Female",
  "Transgender Male",
  "Transgender Female",
  "Prefer not to disclose",
  "Other…",
];

// Gender matching preference (radio)
const GENDER_MATCH_OPTIONS = [
  "Prefer ONLY to be matched within that similarity",
  "Prefer it, but available to others as needed",
  "Prefer NOT to be matched within that similarity",
  "Do not have a preference. Either is fine.",
  "Other…",
];

// Methods (checkbox) options
const METHOD_OPTIONS = [
  "Web Conference (i.e. Zoom Conference)",
  "In Person",
  "Hybrid (Both In Person and web)",
  "Other...",
];

function Section1({ data, updateData, onNext }) {
  const [errorMsg, setErrorMsg] = useState("");

  // Handler for standard text/select/radio inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  // Handler for checkbox arrays (Ethnicities, Gender, Methods, Session Preferences)
  const handleCheckboxChange = (e, fieldName) => {
    const { value, checked } = e.target;
    if (checked) {
      updateData({ [fieldName]: [...data[fieldName], value] });
    } else {
      updateData({
        [fieldName]: data[fieldName].filter((item) => item !== value),
      });
    }
  };

    /**
   * Attempt geocoding with a public API (OpenStreetMap / Nominatim).
   * Return { lat, lon } or throw an error if not found.
   */
    const geocodeAddress = async (addressLine1, city, state, zipcode) => {
      const query = encodeURIComponent(`${addressLine1}, ${city}, ${state} ${zipcode}, USA`);
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`;
  
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Geocoding request failed.");
      }
  
      const results = await response.json();
      // If results is an empty array => address not found
      if (!results || results.length === 0) {
        throw new Error("Address not found. Please check your details.");
      }
  
      // We pick the first result
      const { lat, lon } = results[0];
      if (!lat || !lon) {
        throw new Error("Invalid geocode response. Please check your address details.");
      }
  
      return { lat, lon };
    };

  /**
   * Called when user clicks "Next".
   * We'll geocode the address. If invalid, show an error and do not proceed.
   */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const { addressLine1, city, state, zipcode } = data;

    try {
      const { lat, lon } = await geocodeAddress(addressLine1, city, state, zipcode);
      console.log("Geocode success:", lat, lon);

      // If successful, store lat/long in formData, then proceed.
      updateData({ latitude: lat, longitude: lon });

      onNext(); // Move to next section
    } catch (error) {
      console.error("Geocoding error:", error.message);
      setErrorMsg(error.message || "Invalid address. Please correct your details.");
    }
  };

  return (
    <form className="form-container" onSubmit={handleFormSubmit}>
      <h1 className="form-heading">
        STEAM Superheroes Mentor Mentee Matching Form
      </h1>
      <h2 className="form-heading">Section 1 - Basic Info</h2>

      {/* Email (floating label) */}
      <label className="floating-label">
        <input
          type="email"
          name="email"
          placeholder=" "
          className="floating-input"
          value={data.email}
          onChange={handleChange}
          required
        />
        <span className="floating-label-text">Email</span>
      </label>

      {/* Name (floating label) */}
      <label className="floating-label">
        <input
          type="text"
          name="name"
          placeholder=" "
          className="floating-input"
          value={data.name}
          onChange={handleChange}
        />
        <span className="floating-label-text">Name</span>
      </label>

      {/* Age Bracket (radio)
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold" }}>Age Bracket:</label>
        <div>
          {AGE_BRACKETS.map((bracket) => (
            <label key={bracket} style={{ display: "block", marginTop: "5px" }}>
              <input
                type="radio"
                name="ageBracket"
                value={bracket}
                checked={data.ageBracket === bracket}
                onChange={handleChange}
              />
              {` ${bracket}`}
            </label>
          ))}
        </div>
      </div> */}

      {/* Date of Birth (NEW) */}
      <label className="floating-label">
        <input
          type="date"
          name="dateOfBirth"
          placeholder=" "
          className="floating-input"
          value={data.dateOfBirth || ""}
          onChange={handleChange}
          required
        />
        <span className="floating-label-text">Date of Birth</span>
      </label>

      {/* Phone Number (floating label) */}
      <label className="floating-label">
        <input
          type="text"
          name="phoneNumber"
          placeholder=" "
          className="floating-input"
          value={data.phoneNumber}
          onChange={handleChange}
        />
        <span className="floating-label-text">Phone Number</span>
      </label>
          
      {errorMsg && <div className="error-message">{errorMsg}</div>}

      {/* Address Line 1 (NEW) */}
      <label className="floating-label">
        <input
          type="text"
          name="addressLine1"
          placeholder=" "
          className="floating-input"
          value={data.addressLine1}
          onChange={handleChange}
        />
        <span className="floating-label-text">Address (Line 1)</span>
      </label>

      {/* City (floating label) */}
      <label className="floating-label">
        <input
          type="text"
          name="city"
          placeholder=" "
          className="floating-input"
          value={data.city}
          onChange={handleChange}
        />
        <span className="floating-label-text">City</span>
      </label>

      {/* State (select) */}
      <label style={{ fontWeight: "bold" }}>State:</label>
      <select
        name="state"
        className="form-input"
        value={data.state}
        onChange={handleChange}
        style={{ marginBottom: "15px" }}
      >
        <option value="">Select State</option>
        {US_STATES.map((st) => (
          <option key={st.value} value={st.value}>
            {`${st.value} : ${st.label}`}
          </option>
        ))}
      </select>

      {/* Zipcode (floating label) */}
      <label className="floating-label">
        <input
          type="text"
          name="zipcode"
          placeholder=" "
          className="floating-input"
          value={data.zipcode}
          onChange={handleChange}
          pattern="[0-9]{5}"
          title="Please enter a valid 5-digit US zipcode"
          required
        />
        <span className="floating-label-text">Zipcode</span>
      </label>

      {/* Ethnicities (checkboxes) */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold" }}>Ethnicities:</label>
        <div>
          {ETHNICITY_OPTIONS.map((eth) => (
            <label key={eth} style={{ display: "block", marginTop: "5px" }}>
              <input
                type="checkbox"
                name="ethnicities"
                value={eth}
                checked={data.ethnicities.includes(eth)}
                onChange={(e) => handleCheckboxChange(e, "ethnicities")}
              />
              {` ${eth}`}
            </label>
          ))}
        </div>
      </div>

      {/* Session Preferences (checkbox) - new addition */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold" }}>Session Type Preference:</label>
        <div>
          {SESSION_TYPE_PREFERENCES.map((pref) => (
            <label key={pref} style={{ display: "block", marginTop: "5px" }}>
              <input
                type="checkbox"
                name="sessionPreferences"
                value={pref}
                checked={data.sessionPreferences.includes(pref)}
                onChange={(e) => handleCheckboxChange(e, "sessionPreferences")}
              />
              {` ${pref}`}
            </label>
          ))}
        </div>
      </div>

      {/* Ethnicity Matching Preference (radio) */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold" }}>
          What is your preference in being matched with a person of the same ethnicity?
        </label>
        <div>
          {ETHNICITY_MATCH_OPTIONS.map((option) => (
            <label key={option} style={{ display: "block", marginTop: "5px" }}>
              <input
                type="radio"
                name="ethnicityPreference"
                value={option}
                checked={data.ethnicityPreference === option}
                onChange={handleChange}
              />
              {` ${option}`}
            </label>
          ))}
        </div>
      </div>

      {/* Gender (checkboxes) */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold" }}>Gender:</label>
        <div>
          {GENDER_OPTIONS.map((g) => (
            <label key={g} style={{ display: "block", marginTop: "5px" }}>
              <input
                type="checkbox"
                name="gender"
                value={g}
                checked={data.gender.includes(g)}
                onChange={(e) => handleCheckboxChange(e, "gender")}
              />
              {` ${g}`}
            </label>
          ))}
        </div>
      </div>

      {/* Gender Matching Preference (radio) */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold" }}>
          What is your preference regarding being matched with a person of the same gender identity?
        </label>
        <div>
          {GENDER_MATCH_OPTIONS.map((option) => (
            <label key={option} style={{ display: "block", marginTop: "5px" }}>
              <input
                type="radio"
                name="genderPreference"
                value={option}
                checked={data.genderPreference === option}
                onChange={handleChange}
              />
              {` ${option}`}
            </label>
          ))}
        </div>
      </div>

      {/* Methods (checkboxes) */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold" }}>What methods are you open to?</label>
        <div>
          {METHOD_OPTIONS.map((m) => (
            <label key={m} style={{ display: "block", marginTop: "5px" }}>
              <input
                type="checkbox"
                name="methods"
                value={m}
                checked={data.methods.includes(m)}
                onChange={(e) => handleCheckboxChange(e, "methods")}
              />
              {` ${m}`}
            </label>
          ))}
        </div>
      </div>

      {/* Role (radio) */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ fontWeight: "bold" }}>Choose the role you're signing up for:</label>
        <div>
          <label style={{ display: "block", marginTop: "5px" }}>
            <input
              type="radio"
              name="role"
              value="mentor"
              checked={data.role === "mentor"}
              onChange={handleChange}
            />
            {" Mentor (the person providing guidance)"}
          </label>
          <label style={{ display: "block", marginTop: "5px" }}>
            <input
              type="radio"
              name="role"
              value="mentee"
              checked={data.role === "mentee"}
              onChange={handleChange}
            />
            {" Mentee (the person receiving guidance)"}
          </label>
        </div>
      </div>

      {/* Next Button */}
      {errorMsg && <div className="error-message">{errorMsg}</div>}
      <button type="submit" className="form-button">
        Next
      </button>
    </form>
  );
}

export default Section1;
