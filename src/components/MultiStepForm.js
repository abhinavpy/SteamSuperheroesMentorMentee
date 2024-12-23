import React, { useState } from "react";
import Section1 from "./Section1";
import Section2Mentor from "./Section2Mentor";
import Section3Mentee from "./Section3Mentee";
import Section4 from "./Section4";
import StepProgressBar from "./StepProgressBar";
import "../styling/Form.css"; // Ensure your CSS is imported here
import { FaArrowLeft } from "react-icons/fa";
import { convertToCSV } from "../utils"; // Import the helper function

function MultiStepForm() {
  // This state tracks which step (page) the user is on
  const [step, setStep] = useState(1);

  // Consolidated form data across all sections
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
    steamBackground: "",     // "Professional" or "Student"
    academicLevel: "",       // e.g. "College Undergraduate", etc.
    professionalTitle: "",   // e.g. "Software Engineer" or "N/A"
    currentEmployer: "",     // e.g. "Google"
    reasonsForMentoring: "", // e.g. "Give back to community"
    willingToAdvise: 1,      // slider 1 - 10

    // ====== Section 3 (Mentee) fields ======
    grade: "",
    reasonsForMentor: [],          // e.g. ["Career Exploration", "Other…"]
    reasonsForMentorOther: "",     // If "Other…" is checked
    interests: [],                 // e.g. ["Science", "Art", "Other…"]
    interestsOther: "",            // If "Other…" is checked

    // ====== (Optional) Section4 fields ======
    availability: [],
  });

  const totalSteps = 4;
  const stepLabels = ["Basic Info", "Mentor", "Mentee", "Calendar"];

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
    // Validate if role is chosen
    if (formData.role === "mentor") {
      setStep(2);
    } else if (formData.role === "mentee") {
      setStep(3);
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
  };

  /**
   * Move from Section 3 -> Section 4 (if Mentee)
   */
  const handleNextFromSection3 = () => {
    // Perform any validation if needed
    setStep(4);
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

    // Optionally, notify the user
    alert("Form submitted successfully! Your data has been downloaded as form_data.csv.");
    console.log("Final Form Data:", formData);
    // Optionally reset the form or navigate away
  };

    // Allow user to go back
    const handleBack = () => {
        if (step === 2) {
            // Mentor -> go back to Section 1
            setStep(1);
        } else if (step === 3) {
            // Mentee -> go back to Section 1
            setStep(1);
        } else if (step === 4) {
            // If user is on step 4, check role
            if (formData.role === "mentor") {
            setStep(2); // go back to Mentor section
            } else {
            setStep(3); // go back to Mentee section
            }
        }
        };

  return (
    <div className="page-container">
      {/* Step bar at the top */}
      <StepProgressBar step={step} totalSteps={totalSteps} stepLabels={stepLabels} role={formData.role} />

      {step > 1 && (
        <button
            type="button"
            onClick={handleBack}
            style={{ background: "none", border: "none", cursor: "pointer" }}
        >
            <FaArrowLeft size={20} color="#00B3A6" />
            <span style={{ marginLeft: "8px", color: "#00B3A6" }}> Back</span>
        </button>
        )}

      {/* Conditionally render one section at a time based on 'step' */}
      {step === 1 && (
        <Section1
          data={formData}
          updateData={updateFormData}
          onNext={handleNextFromSection1}
        />
      )}

      {step === 2 && (
        <Section2Mentor
          data={formData}
          updateData={updateFormData}
          onNext={handleNextFromSection2}
        />
      )}

      {step === 3 && (
        <Section3Mentee
          data={formData}
          updateData={updateFormData}
          onNext={handleNextFromSection3}
        />
      )}

      {step === 4 && (
        <Section4
          data={formData}
          updateData={updateFormData}
          onSubmit={handleSubmitFinal}
        />
      )}
    </div>
  );
}

export default MultiStepForm;
