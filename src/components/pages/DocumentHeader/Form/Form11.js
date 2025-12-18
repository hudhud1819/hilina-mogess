import React, { useState } from 'react';
import DocumentHeader from '../../DocumentHeader/DocumentHeader';
import FormFooter from '../../DocumentHeader/FormFooter';
import './Form11.css';

// Document Constants
const totalPages = 4;
const DocumentNo = 'OF/DG/011';
const IssueNo = '1';

// --- Simple Input Row Component ---
const SimpleListInput = ({ label, count }) => {
    const initialItems = [...Array(count)].map((_, i) => ({ value: '' }));
    const [items, setItems] = useState(initialItems);

    const handleAddRow = () => {
        setItems([...items, { value: '' }]);
    };

    const handleInputChange = (index, value) => {
        const newItems = [...items];
        newItems[index].value = value;
        setItems(newItems);
    };

    return (
        <div className="disciplinary-list-input-group">
            <p className="disciplinary-list-label">{label}</p>
            {items.map((item, i) => (
                <div key={i} className="disciplinary-list-item">
                    <span>{i + 1}.</span>
                    <input type="text" value={item.value} onChange={(e) => handleInputChange(i, e.target.value)} />
                </div>
            ))}
            <button 
                onClick={handleAddRow} 
                className="disciplinary-add-row-button plus-button"
                title="Add New Item"
                aria-label="Add New Item"
            >
                +
            </button>
        </div>
    );
}

// --- Main App Component ---
const DisciplinaryForm = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Form state for main fields
  const [formState, setFormState] = useState({
    caseTypeYes: false,
    caseTypeNo: false,
    applicantName: '',
    applicantSignature: '',
    applicantDate: '',
    complaintSubject: '',
    accusedName: '',
    accusedPosition: '',
    accusedId: '',
    offenseDetails: '',
    concludingRequest: '',
    complainantSignature: '',
    complainantDate: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'case_type') {
      setFormState(prev => ({
        ...prev,
        caseTypeYes: value === 'yes',
        caseTypeNo: value === 'no'
      }));
    } else {
      setFormState(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!formState.applicantName || !formState.applicantDate) {
      setError('Please fill in the applicant name and date.');
      setLoading(false);
      setCurrentPage(1);
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

  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Render current page content
  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="part-section disciplinary-part-section">
            <div className="part-header">PAGE 1: INFORMATION OF THE COMPLAINING BODY</div>
            
            <div className="page-content disciplinary-page-content">
              {/* Case Type */}
              <div className="form-row-group disciplinary-row-group">
                <p className="instruction-text disciplinary-instruction-text">
                  ክስ የቀረበበት ጉዳይ / Case Presented For:
                </p>
                <div className="checkbox-group disciplinary-checkbox-group">
                  <span className="checkbox-item disciplinary-checkbox-item">
                    <input 
                      type="radio" 
                      className="checkbox-box disciplinary-checkbox-box" 
                      checked={formState.caseTypeYes}
                      onChange={(e) => handleChange({
                        target: {
                          name: 'case_type',
                          value: 'yes'
                        }
                      })}
                      name="case_type"
                      disabled={loading}
                    /> 
                    አዎ / Yes
                  </span>
                  <span className="checkbox-item disciplinary-checkbox-item">
                    <input 
                      type="radio" 
                      className="checkbox-box disciplinary-checkbox-box" 
                      checked={formState.caseTypeNo}
                      onChange={(e) => handleChange({
                        target: {
                          name: 'case_type',
                          value: 'no'
                        }
                      })}
                      name="case_type"
                      disabled={loading}
                    /> 
                    አይደለም / No
                  </span>
                </div>
              </div>

              {/* Applicant Information */}
              <table className="form-table disciplinary-signature-table">
                <tbody>
                  <tr>
                    <td className="field-label disciplinary-field-label">የአመልካች ስም / Applicant's Name:</td>
                    <td className="field-input-cell disciplinary-input-cell">
                      <input 
                        type="text" 
                        value={formState.applicantName}
                        onChange={handleChange}
                        name="applicantName"
                        disabled={loading}
                        className="field-input disciplinary-field-input"
                      />
                    </td>
                    <td className="field-input-cell disciplinary-input-cell">
                      <input 
                        type="text" 
                        value={formState.applicantSignature}
                        onChange={handleChange}
                        name="applicantSignature"
                        disabled={loading}
                        className="field-input disciplinary-field-input"
                      />
                    </td>
                    <td className="field-label disciplinary-field-label">ቀን / Date:</td>
                    <td className="field-input-cell disciplinary-input-cell">
                      <input 
                        type="date" 
                        value={formState.applicantDate}
                        onChange={handleChange}
                        name="applicantDate"
                        disabled={loading}
                        className="field-input disciplinary-field-input"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Complaint Subject */}
              <div className="form-row-group disciplinary-row-group">
                <label>የክሱ አድራሻ / Subject of the Complaint:</label>
                <input 
                  type="text" 
                  value={formState.complaintSubject}
                  onChange={handleChange}
                  name="complaintSubject"
                  disabled={loading}
                  className="field-input disciplinary-large-input"
                  placeholder="ከ ሰነዱ ላይ የተወሰደው: - ----------------------------------"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="part-section disciplinary-part-section">
            <div className="part-header">PAGE 2: COMPLAINT DETAILS</div>
            
            <div className="page-content disciplinary-page-content">
              <p className="instruction-text disciplinary-instruction-text">
                ክስ የቀረበበትን ሰራተኛ መረጃ / Information of the accused employee:
              </p>
              
              <table className="form-table disciplinary-numbered-fields-table">
                <tbody>
                  <tr>
                    <td className="numbered-label disciplinary-numbered-label">1. ስም / Name:</td>
                    <td className="large-input-cell disciplinary-large-input-cell">
                      <input 
                        type="text" 
                        value={formState.accusedName}
                        onChange={handleChange}
                        name="accusedName"
                        disabled={loading}
                        className="field-input disciplinary-large-input"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="numbered-label disciplinary-numbered-label">2. የስራ መደብ / Position:</td>
                    <td className="large-input-cell disciplinary-large-input-cell">
                      <input 
                        type="text" 
                        value={formState.accusedPosition}
                        onChange={handleChange}
                        name="accusedPosition"
                        disabled={loading}
                        className="field-input disciplinary-large-input"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="numbered-label disciplinary-numbered-label">3. የሠራተኛ መለያ ቁጥር / ID No:</td>
                    <td className="large-input-cell disciplinary-large-input-cell">
                      <input 
                        type="text" 
                        value={formState.accusedId}
                        onChange={handleChange}
                        name="accusedId"
                        disabled={loading}
                        className="field-input disciplinary-large-input"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="form-row-group disciplinary-row-group">
                <label>
                  የተከሰሰበት የዲሲፕሊን ግድፈት ዝርዝር / Details of the disciplinary offense:
                  <br/>
                </label>
                <textarea 
                  rows="8" 
                  value={formState.offenseDetails}
                  onChange={handleChange}
                  name="offenseDetails"
                  disabled={loading}
                  className="field-input disciplinary-tall-input"
                  placeholder="እባክዎ የዲሲፕሊን ግድፈቱ የተፈፀመበትን ቀን፣ ቦታና ሁኔታ በዝርዝር ያስቀምጡ። / Please detail the date, location, and circumstances of the disciplinary offense."
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="part-section disciplinary-part-section">
            <div className="part-header">PAGE 3: EVIDENCE AND WITNESSES</div>
            
            <div className="page-content disciplinary-page-content">
              {/* Evidence List */}
              <SimpleListInput 
                label="ለክሱ ማረጋገጫ የቀረቡ ማስረጃዎች / Evidences submitted for the case" 
                count={1} 
              />

              {/* Witnesses List */}
              <SimpleListInput 
                label="የምስክር ስም ዝርዝር / List of Witnesses" 
                count={1} 
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="part-section disciplinary-part-section">
            <div className="part-header">PAGE 4: CONCLUDING REQUEST</div>
            
            <div className="page-content disciplinary-page-content">
              <div className="form-row-group disciplinary-row-group">
                <label>የመደምደሚያ ጥያቄ / Concluding Request:</label>
                <textarea 
                  rows="6" 
                  value={formState.concludingRequest}
                  onChange={handleChange}
                  name="concludingRequest"
                  disabled={loading}
                  className="field-input disciplinary-field-input"
                  placeholder="ከክሱ ጋር ተያይዞ የሚቀርበውን የመፍትሄ ጥያቄዎን ያስቀምጡ / State your requested solution/remedy in connection with the complaint."
                />
              </div>

              {/* Complainant Signature */}
              <table className="form-table disciplinary-signature-table">
                <tbody>
                  <tr>
                    <td className="field-label disciplinary-field-label">ክስ አቅራቢ ፊርማ / Complainant Signature:</td>
                    <td className="field-input-cell disciplinary-input-cell">
                      <input 
                        type="text" 
                        value={formState.complainantSignature}
                        onChange={handleChange}
                        name="complainantSignature"
                        disabled={loading}
                        className="field-input disciplinary-field-input"
                        placeholder="……………………"
                      />
                    </td>
                    <td className="field-label disciplinary-field-label">ቀን / Date:</td>
                    <td className="field-input-cell disciplinary-input-cell">
                      <input 
                        type="date" 
                        value={formState.complainantDate}
                        onChange={handleChange}
                        name="complainantDate"
                        disabled={loading}
                        className="field-input disciplinary-field-input"
                        placeholder="………"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="document-container">
      <div className="form-body-container disciplinary-form-container">
        
        {/* Document Header */}
        <DocumentHeader 
          docTitle="DISCIPLINARY CASE SUBMISSION FORM" 
          docNo={DocumentNo} 
          issueNo={IssueNo} 
          pageInfo={`Page ${currentPage} of ${totalPages}`}
        />

        {/* Error and Success Messages */}
        {error && (
          <div className="form-error-message disciplinary-error-message">
            ⚠️ {error}
            <button onClick={() => setError(null)} className="close-error disciplinary-close-error">×</button>
          </div>
        )}

        {success && (
          <div className="form-success-message disciplinary-success-message">
            ✅ Disciplinary case form submitted successfully! Redirecting...
          </div>
        )}

        {/* Page Navigation */}
        <div className="page-navigation disciplinary-page-navigation">
          <button 
            onClick={goToPrevPage} 
            disabled={currentPage === 1 || loading}
            className="nav-button disciplinary-prev-button"
          >
            ← Previous Page
          </button>
          <button 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages || loading}
            className="nav-button disciplinary-next-button"
          >
            Next Page →
          </button>
        </div>

        {/* Current Page Content */}
        {renderPageContent()}

        {/* ========================================================================= */}
        {/* FORM FOOTER COMPONENT - REPLACES OLD BUTTONS AND FOOTER NOTES            */}
        {/* ========================================================================= */}
        <FormFooter 
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          isSubmitting={loading}
          submitText="Submit Form"
        />
      </div>
    </div>
  );
};

export default DisciplinaryForm;