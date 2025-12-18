import React, { useState, useEffect } from 'react';
import DocumentHeader from '../../DocumentHeader/DocumentHeader';
import FormFooter from '../../DocumentHeader/FormFooter';
import './Form08.css';

const FileClosingForm = ({ onBack, user, editMode, existingData, duplicateData }) => {
  const [formState, setFormState] = useState({
    // File Information
    fileNumber: '',
    reasonForClosing: '',
    closureAuthorizedBy: '',
    dateClosed: '',
    successiveFileNumber: '',
    custodianName: '',
    custodianSignature: '',
    
    // Additional fields
    additionalReasons: '',
    closureNotes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (editMode && existingData) {
      setFormState(existingData);
    } else if (duplicateData) {
      setFormState(duplicateData);
    } else if (user) {
      setFormState(prev => ({
        ...prev,
        custodianName: user.name || '',
        dateClosed: new Date().toISOString().split('T')[0]
      }));
    }
  }, [editMode, existingData, duplicateData, user]);

  // Universal change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validation
    if (!formState.fileNumber || !formState.reasonForClosing || !formState.dateClosed) {
      setError('Please fill in required fields (File Number, Reason for Closing, Date Closed).');
      setLoading(false);
      return;
    }

    try {
      // Your API call here
      console.log('Submitting file closing form:', formState);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => {
        if (onBack && typeof onBack === 'function') {
          onBack();
        }
      }, 2000);
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      if (onBack && typeof onBack === 'function') {
        onBack();
      } else {
        window.history.back();
      }
    }
  };

  return (
    <div className="document-container">
      
      {/* ========================================================================= */}
      {/* 1. DOCUMENT HEADER                                                        */}
      {/* ========================================================================= */}
      <DocumentHeader 
        docTitle="FILE CLOSING FORM" 
        docNo="OF/DG/008" 
        issueNo="1" 
        pageInfo="Page 1 of 1"
      />

      {/* ========================================================================= */}
      {/* 2. FORM BODY                                                              */}
      {/* ========================================================================= */}
      <div className="form-body-container file-closing-form-container">
        
        

        {/* Error and Success Messages */}
        {error && (
          <div className="form-error-message">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="form-success-message">
            ✅ {editMode ? 'Form updated successfully!' : 'File closing form submitted successfully!'} Redirecting...
          </div>
        )}

        {/* File Identification Section */}
        <div className="file-closing-section file-section">
          <div className="section-header bilingual-header">
            <span>የተዘጋ ፋይል / Closed File</span>
          </div>
          
          <div className="form-row file-closing-row">
            <div className="field-label bilingual-label">
              <span>የፋይል ቁጥር / File Number:</span>
            </div>
            <div className="field-input-container">
              <input 
                type="text" 
                className="field-input file-number-input"
                name="fileNumber"
                value={formState.fileNumber}
                onChange={handleChange}
                placeholder="Enter file number"
                disabled={loading}
                required
              />
            </div>
          </div>
        </div>

        {/* Reason for Closing Section */}
        <div className="form-section closing-reason-section">
          <div className="form-row file-closing-row">
            <div className="field-label bilingual-label">
              <span>ፋይሉ የተዘጋበት ምክንያት / Reason(s) for closing this File:</span>
            </div>
          </div>
          <div className="text-area-container">
            <textarea 
              className="field-input reason-textarea"
              name="reasonForClosing"
              value={formState.reasonForClosing}
              onChange={handleChange}
              placeholder="Describe the reason(s) for closing this file..."
              rows="3"
              disabled={loading}
              required
            />
          </div>
        </div>

        {/* Authorization and Date Section */}
        <div className="two-column-section closing-authorization-section">
          <div className="form-column">
            <div className="field-label bilingual-label">
              <span>ፋይሉ እንዲዘጋ የፈቀደው / Closure is authorized by:</span>
            </div>
            <div className="input-container">
              <input 
                type="text" 
                className="field-input"
                name="closureAuthorizedBy"
                value={formState.closureAuthorizedBy}
                onChange={handleChange}
                placeholder="Enter authorizer's name"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="form-column">
            <div className="field-label bilingual-label">
              <span>የተዘጋበት ቀን / Date closed:</span>
            </div>
            <div className="input-container">
              <input 
                type="date" 
                className="field-input"
                name="dateClosed"
                value={formState.dateClosed}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>
        </div>

        {/* Successive File Reference Section */}
        <div className="form-section successive-file-section">
          <div className="form-row file-closing-row">
            <div className="field-label bilingual-label">
              <span>ቀጣዩ የፋይል ቁጥር / The successive File Number:</span>
            </div>
            <div className="field-input-container">
              <input 
                type="text" 
                className="field-input successive-file-input"
                name="successiveFileNumber"
                value={formState.successiveFileNumber}
                onChange={handleChange}
                placeholder="Enter successive file number (if applicable)"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Closure Notes Section */}
        <div className="form-section closure-notes-section">
          <div className="form-row file-closing-row">
            <div className="field-label">
              <span>Additional Notes / ተጨማሪ ማስታወሻ:</span>
            </div>
          </div>
          <div className="text-area-container">
            <textarea 
              className="field-input notes-textarea"
              name="closureNotes"
              value={formState.closureNotes}
              onChange={handleChange}
              placeholder="Any additional notes about the file closure..."
              rows="2"
              disabled={loading}
            />
          </div>
        </div>

        {/* Signature Section */}
        <div className="signature-section file-closing-signatures">
          <div className="signature-column">
            <div className="field-label bilingual-label">
              <span>የፋይል ደህንነት ጠባቂ ስም / Name of the Custodian:</span>
            </div>
            <div className="signature-input-container">
              <input 
                type="text" 
                className="signature-input"
                name="custodianName"
                value={formState.custodianName}
                onChange={handleChange}
                placeholder="Enter custodian name"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Form Footer */}
        <FormFooter 
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          isSubmitting={loading}
          submitText={editMode ? "Update Form" : "Submit Closure Form"}
        />
      </div>
    </div>
  );
};

export default FileClosingForm;