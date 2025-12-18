import React, { useState } from 'react';
import DocumentHeader from '../../DocumentHeader/DocumentHeader';
import FormFooter from '../../DocumentHeader/FormFooter';
import './Form07.css';

const Form07 = ({ user, onBack, backendUrl, editMode, requestId }) => {
  const [submitting, setSubmitting] = useState(false);
  
  // State for the top section fields
  const [headerInfo, setHeaderInfo] = useState({
    companyName: '',
    requesterName: user?.name || '',
    department: user?.department || '',
    purpose: ''
  });

  // State for the table rows - Starting with 15 rows as per standard registration forms
  const [rows, setRows] = useState(Array(15).fill({
    recordName: '', reason: '', location: '', authorizedPerson: ''
  }));

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    setHeaderInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleTableChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { recordName: '', reason: '', location: '', authorizedPerson: '' }]);
  };

  const removeRow = () => {
    if (rows.length > 1) {
      setRows(rows.slice(0, -1));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);

    const submissionData = {
      formId: 'OF/DG/007',
      formName: 'Access to Documents/Records Authorization Form',
      formData: {
        ...headerInfo,
        accessRecords: rows.filter(r => r.recordName !== '') 
      },
      submittedBy: user?.employeeId,
      submittedAt: new Date().toISOString()
    };

    try {
      const response = await fetch(`${backendUrl}/requests`, {
        method: editMode && requestId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        alert('Form submitted successfully!');
        if (onBack) onBack();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit form.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="f07-full-page-container">
      <div className="f07-form-paper">
        
        <DocumentHeader 
          docTitle="ACCESS TO DOCUMENTS/RECORDS AUTHORIZATION FORM" 
          docNo="OF/DG/007" 
          issueNo="1" 
          pageInfo="Page 1 of 1"
        />

        <div className="f07-document-body">
          {/* Requester Information Section */}
          <div className="f07-info-section">
            <div className="f07-info-grid">
              <div className="f07-input-group">
                <label>Company Name:</label>
                <input name="companyName" value={headerInfo.companyName} onChange={handleHeaderChange} />
              </div>
              <div className="f07-input-group">
                <label>Requester Name:</label>
                <input name="requesterName" value={headerInfo.requesterName} onChange={handleHeaderChange} />
              </div>
              <div className="f07-input-group">
                <label>Department:</label>
                <input name="department" value={headerInfo.department} onChange={handleHeaderChange} />
              </div>
              <div className="f07-input-group">
                <label>Purpose of Access:</label>
                <textarea name="purpose" value={headerInfo.purpose} onChange={handleHeaderChange} rows="2" />
              </div>
            </div>
          </div>

          {/* Records Table */}
          <table className="f07-access-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>S. N</th>
                <th>Access Controlled Records</th>
                <th>Reasons for Access Controlled</th>
                <th>Location</th>
                <th>Authorized Persons</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td><input className="f07-table-input" value={row.recordName} onChange={(e) => handleTableChange(index, 'recordName', e.target.value)} /></td>
                  <td><input className="f07-table-input" value={row.reason} onChange={(e) => handleTableChange(index, 'reason', e.target.value)} /></td>
                  <td><input className="f07-table-input" value={row.location} onChange={(e) => handleTableChange(index, 'location', e.target.value)} /></td>
                  <td><input className="f07-table-input" value={row.authorizedPerson} onChange={(e) => handleTableChange(index, 'authorizedPerson', e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Dynamic Row Controls */}
          <div className="f07-row-controls f07-no-print">
            <button type="button" onClick={addRow} className="f07-control-btn">+</button>
            <button type="button" onClick={removeRow} className="f07-control-btn">-</button>
            <span className="f07-control-label">Update Rows</span>
          </div>

          <FormFooter 
            onCancel={onBack} 
            onSubmit={handleSubmit} 
            isSubmitting={submitting}
            submitText={editMode ? "Update Authorization" : "Submit Authorization"}
          />
        </div>
      </div>
    </div>
  );
};

export default Form07;