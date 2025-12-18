import React, { useState } from 'react';
import DocumentHeader from '../../DocumentHeader/DocumentHeader';
import FormFooter from '../../DocumentHeader/FormFooter'; 
import './Form14.css';

const ServiceRequestForm = ({ onBack, user, editMode, existingData, duplicateData, requestId, backendUrl }) => {
  // Initialize form state
  const [formState, setFormState] = useState({
    // Part A - Requesting Body
    requestNo: '',
    registrationNo: '',
    to: '',
    requestedBy: '',
    serviceRequested: '',
    attachedDocuments: '',
    additionalInformation: '',
    dateOfRequest: '',
    authorizedBy: '',
    
    // Part B - Service Giving Body (dynamic rows)
    followUpRows: [
      { 
        id: 1, 
        sn: 1, 
        receivedBy: '', 
        serviceDelivered: '', 
        dateTime: '', 
        idSign: '' 
      }
    ],
    
    // Common
    submittedBy: user?.name || '',
    submissionDate: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Initialize form data
  React.useEffect(() => {
    if (editMode && existingData) {
      setFormState(existingData);
    } else if (duplicateData) {
      setFormState(duplicateData);
    } else if (user) {
      setFormState(prev => ({
        ...prev,
        submittedBy: user.name || '',
        submissionDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [editMode, existingData, duplicateData, user]);

  // Universal change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!formState.requestNo || !formState.to || !formState.requestedBy) {
      setError('Please fill in all required fields in Part A.');
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting form data:', formState);
      
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
    <div className="service-request-form-014 srf-document-container">
      
      {/* ========================================================================= */}
      {/* 1. DOCUMENT HEADER                                                        */}
      {/* ========================================================================= */}
      <DocumentHeader 
        docTitle="SERVICE REQUEST FORM" 
        docNo="OF/DG/014" 
        issueNo="1" 
        pageInfo="Page 1 of 1"
      />

      {/* ========================================================================= */}
      {/* 2. FORM BODY                                                              */}
      {/* ========================================================================= */}
      <div className="service-request-form-014-body srf-form-body-container">
          
        {/* Error and Success Messages */}
        {error && (
          <div className="service-request-form-014-error srf-error-message">
            ⚠️ {error}
            <button onClick={() => setError(null)} className="service-request-form-014-close-error srf-close-error">×</button>
          </div>
        )}

        {success && (
          <div className="service-request-form-014-success srf-success-message">
            ✅ {editMode ? 'Service request updated successfully!' : 'Service request submitted successfully!'} Redirecting...
          </div>
        )}

        {/* ========================================================================= */}
        {/* PART A: TO BE COMPLETED BY REQUESTING BODY                                 */}
        {/* ========================================================================= */}
        <div className="service-request-form-014-part-section srf-part-section">
          <div className="service-request-form-014-part-header srf-part-header">
            PART A: TO BE COMPLETED BY REQUESTING BODY
          </div>
          
          <div className="service-request-form-014-form-row-group srf-form-row-group">
            <div className="service-request-form-014-field-row srf-field-row">
              <div className="service-request-form-014-field srf-field">
                <label className="service-request-form-014-label">Request No.:</label>
                <input 
                  type="text" 
                  value={formState.requestNo}
                  onChange={handleChange}
                  name="requestNo"
                  disabled={loading}
                  className="service-request-form-014-input srf-bottom-border-input"
                  placeholder="Enter request number"
                />
              </div>
              <div className="service-request-form-014-field srf-field">
                <label className="service-request-form-014-label">Registration No.:</label>
                <input 
                  type="text" 
                  value={formState.registrationNo}
                  onChange={handleChange}
                  name="registrationNo"
                  disabled={loading}
                  className="service-request-form-014-input srf-bottom-border-input"
                  placeholder="Enter registration number"
                />
              </div>
            </div>
          </div>

          <div className="service-request-form-014-form-row-group srf-form-row-group">
            <label className="service-request-form-014-label">1. To:</label>
            <input 
              type="text" 
              value={formState.to}
              onChange={handleChange}
              name="to"
              disabled={loading}
              className="service-request-form-014-input srf-bottom-border-input"
              placeholder="Enter recipient"
            />
          </div>

          <div className="service-request-form-014-form-row-group srf-form-row-group">
            <label className="service-request-form-014-label">2. Requested by:</label>
            <input 
              type="text" 
              value={formState.requestedBy}
              onChange={handleChange}
              name="requestedBy"
              disabled={loading}
              className="service-request-form-014-input srf-bottom-border-input"
              placeholder="Enter requester name"
            />
          </div>

          <div className="service-request-form-014-form-row-group srf-form-row-group">
            <label className="service-request-form-014-label">3. Service requested:</label>
            <textarea 
              rows="4" 
              value={formState.serviceRequested}
              onChange={handleChange}
              name="serviceRequested"
              disabled={loading}
              placeholder="Describe the service requested..."
              className="service-request-form-014-textarea srf-textarea"
            />
          </div>

          <div className="service-request-form-014-form-row-group srf-form-row-group">
            <label className="service-request-form-014-label">4. Attached documents (Title and No. of pages):</label>
            <input 
              type="text" 
              value={formState.attachedDocuments}
              onChange={handleChange}
              name="attachedDocuments"
              disabled={loading}
              className="service-request-form-014-input srf-bottom-border-input"
              placeholder="List attached documents"
            />
          </div>

          <div className="service-request-form-014-form-row-group srf-form-row-group">
            <label className="service-request-form-014-label">5. Additional information (if any):</label>
            <input 
              type="text" 
              value={formState.additionalInformation}
              onChange={handleChange}
              name="additionalInformation"
              disabled={loading}
              className="service-request-form-014-input srf-bottom-border-input"
              placeholder="Enter additional information"
            />
          </div>

          <div className="service-request-form-014-form-row-group srf-form-row-group">
            <div className="service-request-form-014-field-row srf-field-row">
              <div className="service-request-form-014-field srf-field">
                <label className="service-request-form-014-label">Date of request (YY/MM/DD/TIME):</label>
                <input 
                  type="text" 
                  value={formState.dateOfRequest}
                  onChange={handleChange}
                  name="dateOfRequest"
                  disabled={loading}
                  className="service-request-form-014-input srf-bottom-border-input"
                  placeholder="YYYY/MM/DD/HH:MM"
                />
              </div>
            </div>
          </div>
        </div>

        <FormFooter 
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          isSubmitting={loading}
          submitText={editMode ? "Update Request" : "Submit Form"}
        />
      </div>
    </div>
  );
};

export default ServiceRequestForm;