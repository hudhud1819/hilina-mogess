import React from "react";
import "./FormFooter.css";

const FormFooter = ({ onCancel, onSubmit, isSubmitting = false, submitText = "Submit" }) => {
  const handleSubmit = (e) => {
    console.log("FormFooter: Submit button clicked"); // Debug log
    e.preventDefault();
    e.stopPropagation();
    
    if (onSubmit && typeof onSubmit === "function") {
      console.log("FormFooter: Calling onSubmit prop"); // Debug log
      onSubmit(e);
    } else {
      console.error("FormFooter: onSubmit is not a function", onSubmit); // Debug log
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onCancel && typeof onCancel === "function") {
      console.log("FormFooter: Calling onCancel prop"); // Debug log
      onCancel();
    }
  };

  return (
    <div className="insa-unique-footer-wrapper">
      {/* This section creates the clean line and centered text from the official doc */}
      {/* This section handles the UI buttons, hidden during printing */}
      <div className="insa-footer-button-container no-print">
        <button 
          type="button" 
          onClick={handleCancel} 
          className="insa-footer-btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          onClick={handleSubmit} 
          className="insa-footer-btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : submitText}
        </button>
      </div>
      <br></br>
      <div className="insa-footer-warning-block">
        <div className="insa-footer-divider-line"></div>
        <div className="insa-footer-amharic-text">
          ከመጠቀምዎ በፊት ትክክለኛው ቅጽ መሆኑን ያረጋግጡ ።
        </div>
        <div className="insa-footer-english-text">
          PLEASE MAKE SURE THAT THIS IS THE CORRECT ISSUE BEFORE USE
        </div>
      </div>
    </div>
  );
};

export default FormFooter;