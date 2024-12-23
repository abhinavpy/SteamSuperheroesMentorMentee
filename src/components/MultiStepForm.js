// src/components/MultiStepForm.jsx

import React, { useState, useContext } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Section1 from "./Section1";
import Section2Mentor from "./Section2Mentor";
import Section3Mentee from "./Section3Mentee";
import Section4 from "./Section4";
import StepProgressBar from "./StepProgressBar";
import { FaArrowLeft } from "react-icons/fa";
import "../styling/Form.css"; // Assuming separate CSS
import { AuthContext } from "../context/AuthContext";

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    // ====== Section 1 fields ======
    email: "",
    name: "",
    ageBracket: "",
    phoneNumber: "",
    city: "",
    state: "",
    ethnicities: [],
    ethnicityPreference: "",
    gender: [],
    genderPreference: "",
    methods: [],
    role: "", // 'mentor' or 'mentee'

    // ====== Section 2 (Mentor) fields ======
    steamBackground: "", // "Professional" or "Student"
    academicLevel: "", // e.g. "College Undergraduate", etc.
    professionalTitle: "", // e.g. "Software Engineer" or "N/A"
    currentEmployer: "", // e.g. "Google"
    reasonsForMentoring: "", // e.g. "Give back to community"
    willingToAdvise: 1, // slider 1 - 10

    // ====== Section 3 (Mentee) fields ======
    grade: "",
    reasonsForMentor: [],
    reasonsForMentorOther: "",
    interests: [],
    interestsOther: "",

    // ====== Section 4 ======
    availability: [],
  });

  const totalSteps = 4;
  const stepLabels = ["Basic Info", "Mentor Profile", "Mentee Profile", "Calendar Availability"];

  /**
   * Helper to merge updates from child components into our main formData state.
   */
  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  /**
   * Move from Section 1 -> either Section 2 or Section 3
   */
  const handleNextFromSection1 = () => {
    if (formData.role === "mentor") {
      setStep(2);
      navigate("/form/section2");
    } else if (formData.role === "mentee") {
      setStep(3);
      navigate("/form/section3");
    } else {
      alert("Please select a role (Mentor or Mentee) in Section 1.");
    }
  };

  /**
   * Move from Section 2 -> Section 4 (if Mentor)
   */
  const handleNextFromSection2 = () => {
    // Perform any validation if needed
    setStep(4);
    navigate("/form/section4");
  };

  /**
   * Move from Section 3 -> Section 4 (if Mentee)
   */
  const handleNextFromSection3 = () => {
    // Perform any validation if needed
    setStep(4);
    navigate("/form/section4");
  };

  /**
   * Final submit in Section 4
   */
  const handleSubmitFinal = () => {
    // Perform final validations, or post data to an API, etc.
    // For now, we'll generate and download the CSV

    const csv = convertToCSV(formData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "form_data.csv"); // Filename

    // Append to the document and trigger click
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Optionally, notify the user and logout or reset form
    alert("Form submitted successfully! Your data has been downloaded as form_data.csv.");
    console.log("Final Form Data:", formData);
    logout(); // Log out after submission
    navigate("/login"); // Redirect to login
  };

  /**
   * Allow user to go back
   */
  const handleBack = () => {
    if (step === 2) {
      // Mentor -> go back to Section 1
      setStep(1);
      navigate("/form/section1");
    } else if (step === 3) {
      // Mentee -> go back to Section 1
      setStep(1);
      navigate("/form/section1");
    } else if (step === 4) {
      // If user is on step 4, check role
      if (formData.role === "mentor") {
        setStep(2); // go back to Mentor section
        navigate("/form/section2");
      } else {
        setStep(3); // go back to Mentee section
        navigate("/form/section3");
      }
    }
  };

  // Helper function to convert JSON to CSV
  const convertToCSV = (data) => {
    const headers = Object.keys(data);
    const rows = [];

    // Header row
    const headerRow = headers.map((header) => `"${header}"`).join(",");
    rows.push(headerRow);

    // Data row
    const dataRow = headers
      .map((header) => {
        let value = data[header];

        if (Array.isArray(value)) {
          // Join array items with semicolon
          value = value.join("; ");
        }

        // Handle undefined or null values
        if (value === undefined || value === null) {
          value = "";
        }

        // Escape double quotes by doubling them
        if (typeof value === "string") {
          value = value.replace(/"/g, '""');
        }

        return `"${value}"`;
      })
      .join(",");

    rows.push(dataRow);

    return rows.join("\n");
  };

  return (
    <div className="page-container">
      {/* Step Progress Bar at the top */}
      <StepProgressBar
        step={step}
        totalSteps={totalSteps}
        stepLabels={stepLabels}
        role={formData.role} // Pass the role to handle specific step styling
      />

      {/* 
        Show a back arrow/button if we’re not on step 1.
      */}
      {step > 1 && (
        <button
          type="button"
          onClick={handleBack}
          className="back-button"
        >
          <FaArrowLeft size={16} style={{ marginRight: "5px" }} />
          Back
        </button>
      )}

      {/* Nested Routes for Each Section */}
      <Routes>
        <Route
          path="section1"
          element={
            <Section1
              data={formData}
              updateData={updateFormData}
              onNext={handleNextFromSection1}
            />
          }
        />
        <Route
          path="section2"
          element={
            formData.role === "mentor" ? (
              <Section2Mentor
                data={formData}
                updateData={updateFormData}
                onNext={handleNextFromSection2}
              />
            ) : (
              <Navigate to="section1" replace />
            )
          }
        />
        <Route
          path="section3"
          element={
            formData.role === "mentee" ? (
              <Section3Mentee
                data={formData}
                updateData={updateFormData}
                onNext={handleNextFromSection3}
              />
            ) : (
              <Navigate to="section1" replace />
            )
          }
        />
        <Route
          path="section4"
          element={<Section4 data={formData} updateData={updateFormData} onSubmit={handleSubmitFinal} />}
        />
        {/* Redirect /form to /form/section1 */}
        <Route path="/" element={<Navigate to="section1" replace />} />
      </Routes>
    </div>
  );
}

export default MultiStepForm;
