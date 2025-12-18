import React, { useState } from 'react';
import DocumentHeader from '../../DocumentHeader/DocumentHeader';
import FormFooter from '../../DocumentHeader/FormFooter';
import './Form12.css';

const MasterListForm = ({ onBack }) => {
  // State for table rows
  const [rows, setRows] = useState([
    { sn: 1, title: '', docNumber: '', issueNumber: '', directorate: '', type: '', remark: '' },
    { sn: 2, title: '', docNumber: '', issueNumber: '', directorate: '', type: '', remark: '' },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Add a new row
  const addRow = () => {
    const newRow = {
      sn: rows.length + 1,
      title: '',
      docNumber: '',
      issueNumber: '',
      directorate: '',
      type: '',
      remark: ''
    };
    setRows([...rows, newRow]);
  };

  // Handle input change
  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validation
    const hasData = rows.some(row => 
      row.title || row.docNumber || row.directorate || row.type
    );
    
    if (!hasData) {
      setError('Please fill in at least one document entry.');
      setLoading(false);
      return;
    }
    
    try {
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
    <div className="master-list-form-afma-dg-012 document-container">
      {/* ========================================================================= */}
      {/* 1. DOCUMENT HEADER COMPONENT                                              */}
      {/* ========================================================================= */}
      <DocumentHeader 
        docTitle="MASTER LIST OF DOCUMENT FORM" 
        docNo="OF/DG/012" 
        issueNo="1" 
        pageInfo="Page 1 of 1"
      />

      {/* ========================================================================= */}
      {/* 2. FORM BODY CONTAINER                                                    */}
      {/* ========================================================================= */}
      <div className="form-body-container">
        
        {/* Error and Success Messages */}
        {error && (
          <div className="form-error-message">
            ⚠️ {error}
            <button onClick={() => setError(null)} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
          </div>
        )}

        {success && (
          <div className="form-success-message">
            ✅ Master list form submitted successfully! Redirecting...
          </div>
        )}

        {/* Table Column Headers */}
        <div className="table-column-headers">
          <div className="table-header-cell sn-header">S.<br />N</div>
          <div className="table-header-cell title-header">Document<br />Title</div>
          <div className="table-header-cell docnum-header">Document<br />Number</div>
          <div className="table-header-cell issue-header">Issue<br />Number</div>
          <div className="table-header-cell directorate-header">Directorate</div>
          <div className="table-header-cell type-header">Type</div>
          <div className="table-header-cell remark-header">Remark</div>
        </div>

        {/* Main Table */}
        <div className="master-list-table-container">
          <table className="master-list-table">
            <thead>
              <tr>
                <th className="column-sn">S.<br />N</th>
                <th className="column-title">Document<br />Title</th>
                <th className="column-docnum">Document<br />Number</th>
                <th className="column-issue">Issue<br />Number</th>
                <th className="column-directorate">Directorate</th>
                <th className="column-type">Type</th>
                <th className="column-remark">Remark</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.sn}>
                  <td className="column-sn">{row.sn}</td>
                  <td className="column-title">
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Enter document title"
                      value={row.title}
                      onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                      disabled={loading}
                    />
                  </td>
                  <td className="column-docnum">
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Doc. No."
                      value={row.docNumber}
                      onChange={(e) => handleInputChange(index, 'docNumber', e.target.value)}
                      disabled={loading}
                    />
                  </td>
                  <td className="column-issue">
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Issue No."
                      value={row.issueNumber}
                      onChange={(e) => handleInputChange(index, 'issueNumber', e.target.value)}
                      disabled={loading}
                    />
                  </td>
                  <td className="column-directorate">
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Directorate"
                      value={row.directorate}
                      onChange={(e) => handleInputChange(index, 'directorate', e.target.value)}
                      disabled={loading}
                    />
                  </td>
                  <td className="column-type">
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Type"
                      value={row.type}
                      onChange={(e) => handleInputChange(index, 'type', e.target.value)}
                      disabled={loading}
                    />
                  </td>
                  <td className="column-remark">
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Remark"
                      value={row.remark}
                      onChange={(e) => handleInputChange(index, 'remark', e.target.value)}
                      disabled={loading}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* ========================================================================= */}
        {/* 3. ACTION BUTTONS                                                        */}
        {/* ========================================================================= */}
        <div className="action-buttons">
          <button 
            className="btn-add-row-plus"
            onClick={addRow}
            disabled={loading}
            title="Add New Row"
            aria-label="Add New Row"
          >
            <span className="plus-icon">+</span>
          </button>
          
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
    </div>
  );
};

export default MasterListForm;