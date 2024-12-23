import React, { useState } from "react";
import Section1 from "./Section1";
import Section2Mentor from "./Section2Mentor";
import Section3Mentee from "./Section3Mentee";
import Section4 from "./Section4";
import "../styling/Form.css"; // Ensure your CSS is imported here

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
    // ... If you have additional universal fields at the end
  });

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
    alert("Form submitted successfully!");
    console.log("Final Form Data:", formData);

    // Optionally reset or do something else
    // setStep(1);
    // setFormData({ ...initialValues });
  };

  return (
    <div className="page-container">
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
