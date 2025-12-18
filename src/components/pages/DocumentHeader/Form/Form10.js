import React, { useState } from 'react';
import DocumentHeader from '../../DocumentHeader/DocumentHeader';
import FormFooter from '../../DocumentHeader/FormFooter';
import './Form10.css';

// Document Constants
const totalPages = 1; 
const DocumentNo = 'OF/DG/010';
const IssueNo = '1';

// Initial state for one row in the registration table
const initialRow = {
  regNumber: '',
  dateRegistered: '',
  title: '',
  enclosures: '',
  sendTo: '',
  fileNo: '',
  registeredBy: '',
  implementation: '',
  signature: '',
};

// --- RegistrationTable Component (Dynamic Table) ---
const RegistrationTable = ({ rows, setRows }) => {
  const handleAddRow = () => {
    // Add 1 empty row
    const newRows = [...rows, { ...initialRow }];
    setRows(newRows);
  };

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  return (
    <div className="outgoing-doc-registration-container registration-table-container">
      <table className="form-table outgoing-doc-table">
        <thead>
          <tr>
            <th>S/N</th>
            <th>Registration Number</th>
            <th>Date Registered</th>
            <th>Title of the Record/Document/Subject</th>
            <th>Enclosures</th>
            <th>Send to</th>
            <th>File No. In which the Copy is Attached</th>
            <th>Registered by Name & Sign.</th>
            <th>Implementation</th>
            <th>Signature</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td><input type="text" value={row.regNumber} onChange={(e) => handleInputChange(i, 'regNumber', e.target.value)} /></td>
              <td><input type="date" value={row.dateRegistered} onChange={(e) => handleInputChange(i, 'dateRegistered', e.target.value)} /></td>
              <td><input type="text" value={row.title} onChange={(e) => handleInputChange(i, 'title', e.target.value)} /></td>
              <td><input type="text" value={row.enclosures} onChange={(e) => handleInputChange(i, 'enclosures', e.target.value)} /></td>
              <td><input type="text" value={row.sendTo} onChange={(e) => handleInputChange(i, 'sendTo', e.target.value)} /></td>
              <td><input type="text" value={row.fileNo} onChange={(e) => handleInputChange(i, 'fileNo', e.target.value)} /></td>
              <td><input type="text" value={row.registeredBy} onChange={(e) => handleInputChange(i, 'registeredBy', e.target.value)} /></td>
              <td><input type="text" value={row.implementation} onChange={(e) => handleInputChange(i, 'implementation', e.target.value)} /></td>
              <td><input type="text" value={row.signature} onChange={(e) => handleInputChange(i, 'signature', e.target.value)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button 
        onClick={handleAddRow} 
        className="add-row-button plus-button"
        title="Add New Row"
        aria-label="Add New Row"
      >
        +
      </button>
    </div>
  );
};

// --- Main App Component ---
const OutgoingDocumentForm = ({ onBack }) => {
  // Initialize with enough rows for a standard form
  const [rows, setRows] = useState([...Array(2)].map(() => ({...initialRow})));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Basic validation - check if at least one row has data
    const hasData = rows.some(row => 
      row.regNumber || row.title || row.sendTo || row.registeredBy
    );
    
    if (!hasData) {
      setError('Please fill in at least one row of data.');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Submitting form data:', rows);
      
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
      <div className="form-body-container outgoing-doc-registration-container">
        
        {/* Document Header */}
        <DocumentHeader 
          docTitle="OUTGOING DOCUMENT REGISTRATION FORM" 
          docNo={DocumentNo} 
          issueNo={IssueNo} 
          pageInfo={`Page 1 of ${totalPages}`}
        />

        {/* Error and Success Messages */}
        {error && (
          <div className="form-error-message">
            ⚠️ {error}
            <button onClick={() => setError(null)} className="close-error">×</button>
          </div>
        )}

        {success && (
          <div className="form-success-message">
            ✅ Outgoing document form submitted successfully! Redirecting...
          </div>
        )}

        {/* PART SECTION - Like Form01 */}
        <div className="part-section outgoing-doc-section">
          <div className="part-header">OUTGOING DOCUMENT REGISTRATION</div>
          
          {/* Page Content */}
          <div className="page-content outgoing-doc-content">
            <RegistrationTable rows={rows} setRows={setRows} />
          </div>
        </div>

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

export default OutgoingDocumentForm;