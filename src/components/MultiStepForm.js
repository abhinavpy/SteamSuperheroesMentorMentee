// src/components/MultiStepForm.jsx

import React, { useState, useContext } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Section1 from "./Section1";
import Section2Mentor from "./Section2Mentor";
import Section3Mentee from "./Section3Mentee";
import Section4 from "./Section4";
import StepProgressBar from "./StepProgressBar";
import { FaArrowLeft } from "react-icons/fa";
import "../styling/Form.css";
import { AuthContext } from "../context/AuthContext";
import { registerMentor, registerMentee } from "../api"; // Import API functions

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  /**
   * Updated formData:
   * - dateOfBirth: ""  (replaces ageBracket)
   * - addressLine1: "" 
   * - zipcode: ""      
   * - latitude, longitude: null 
   * - sessionPreferences: []
   * - unavailableDates: "" 
   * 
   * Additional DB fields (match_pair_ids, is_available_for_matching, mentoring_sessions_completed) 
   * will be set in final submission code.
   */
  const [formData, setFormData] = useState({
    // ====== Section 1 fields ======
    email: "",
    name: "",
    dateOfBirth: "",     // was ageBracket, replaced with dateOfBirth
    phoneNumber: "",
    addressLine1: "",    // new address line
    city: "",
    state: "",
    zipcode: "",
    latitude: null,      // lat from geocoding
    longitude: null,     // lon from geocoding
    ethnicities: [],
    sessionPreferences: [],
    ethnicityPreference: "",
    gender: [],
    genderPreference: "",
    methods: [],
    role: "", // 'mentor' or 'mentee'

    // ====== Section 2 (Mentor) fields ======
    steamBackground: "", // "Professional" or "Student"
    academicLevel: "",   // e.g. "College Undergraduate"
    professionalTitle: "",
    currentEmployer: "",
    reasonsForMentoring: "",
    willingToAdvise: 1,

    // ====== Section 3 (Mentee) fields ======
    grade: "",
    reasonsForMentor: [],
    reasonsForMentorOther: "",
    interests: [],
    interestsOther: "",

    // ====== Section 4 ======
    availability: [],
    unavailableDates: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalSteps = 4;
  const stepLabels = [
    "Basic Info",
    "Mentor Profile",
    "Mentee Profile",
    "Calendar Availability",
  ];

  /** Merge updates from child forms into main formData state. */
  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  /**
   * Navigation logic after Section 1 -> Section 2 or 3
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

  const handleNextFromSection2 = () => {
    setStep(4);
    navigate("/form/section4");
  };

  const handleNextFromSection3 = () => {
    setStep(4);
    navigate("/form/section4");
  };

  /**
   * Final submit in Section 4
   */
  const handleSubmitFinal = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (formData.role === "mentor") {
        // Prepare mentor data
        const mentorData = {
          email: formData.email,
          name: formData.name,
          date_of_birth: formData.dateOfBirth,
          phone_number: formData.phoneNumber,
          address_line_1: formData.addressLine1,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode,
          latitude: formData.latitude,
          longitude: formData.longitude,
          ethnicities: formData.ethnicities,
          ethnicity_preference: formData.ethnicityPreference,
          gender: formData.gender,
          gender_preference: formData.genderPreference,
          methods: formData.methods,
          sessionPreferences: formData.sessionPreferences,
          role: formData.role,
          steamBackground: formData.steamBackground,
          academicLevel: formData.academicLevel,
          professionalTitle: formData.professionalTitle,
          currentEmployer: formData.currentEmployer,
          reasonsForMentoring: formData.reasonsForMentoring,
          willingToAdvise: formData.willingToAdvise,
          unavailableDates: formData.unavailableDates,

          // ============= New fields for DB =============
          match_pair_ids: [],                 // Empty array initially
          is_available_for_matching: true,    // True by default
          mentoring_sessions_completed: 0,    // 0 by default
        };

        response = await registerMentor(mentorData);

      } else if (formData.role === "mentee") {
        // Prepare mentee data
        const menteeData = {
          email: formData.email,
          name: formData.name,
          date_of_birth: formData.dateOfBirth,
          phone_number: formData.phoneNumber,
          address_line_1: formData.addressLine1,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode,
          latitude: formData.latitude,
          longitude: formData.longitude,
          ethnicities: formData.ethnicities,
          ethnicity_preference: formData.ethnicityPreference,
          gender: formData.gender,
          gender_preference: formData.genderPreference,
          methods: formData.methods,
          sessionPreferences: formData.sessionPreferences,
          role: formData.role,
          grade: formData.grade,
          reasons_for_mentoring: formData.reasonsForMentor,
          interests: formData.interests,
          availability: formData.availability,
          unavailableDates: formData.unavailableDates,

          // ============= New fields for DB =============
          match_pair_ids: [],
          is_available_for_matching: true,
          mentoring_sessions_completed: 0,
        };

        // If Mentee selected "Other..." reason
        if (formData.reasonsForMentor.includes("Other…")) {
          menteeData.reasons_for_mentoring = [
            ...menteeData.reasons_for_mentoring,
            formData.reasonsForMentorOther,
          ];
        }
        // If Mentee selected "Other..." interest
        if (formData.interests.includes("Other…")) {
          menteeData.interests = [
            ...menteeData.interests,
            formData.interestsOther,
          ];
        }

        response = await registerMentee(menteeData);

      } else {
        throw new Error("Invalid role selected.");
      }

      console.log("Registration successful:", response.data);

      alert("Form submitted successfully! Your data has been uploaded.");
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.response?.data?.detail || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      navigate("/form/section1");
    } else if (step === 3) {
      setStep(1);
      navigate("/form/section1");
    } else if (step === 4) {
      if (formData.role === "mentor") {
        setStep(2);
        navigate("/form/section2");
      } else {
        setStep(3);
        navigate("/form/section3");
      }
    }
  };

  return (
    <div className="page-container">
      <StepProgressBar
        step={step}
        totalSteps={totalSteps}
        stepLabels={stepLabels}
        role={formData.role}
      />

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

      {error && <div className="error-message">{error}</div>}

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
          element={
            <Section4
              data={formData}
              updateData={updateFormData}
              onSubmit={handleSubmitFinal}
              loading={loading}
            />
          }
        />
        {/* Redirect /form to /form/section1 */}
        <Route path="/" element={<Navigate to="section1" replace />} />
      </Routes>
    </div>
  );
}

export default MultiStepForm;
