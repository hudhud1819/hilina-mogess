import React, { useState } from 'react';
import DocumentHeader from '../../DocumentHeader/DocumentHeader';
import FormFooter from '../../DocumentHeader/FormFooter';
import './Form05.css';

const Form05 = ({ user, onBack, backendUrl, editMode, requestId }) => {
  const [submitting, setSubmitting] = useState(false);
  // Initialize with 10 empty rows
  const [rows, setRows] = useState(Array(10).fill({
    fileNo: '', deliveredTo: '', dateDelivered: '', recipientSignature: '', issuedBy: '', dateReturned: '', remarks: ''
  }));

  const handleInputChange = (rowIndex, field, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [field]: value };
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { fileNo: '', deliveredTo: '', dateDelivered: '', recipientSignature: '', issuedBy: '', dateReturned: '', remarks: '' }]);
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
      formId: 'OF/DG/005',
      formName: 'File Movement Register',
      formData: { movementRecords: rows.filter(r => r.fileNo) },
      submittedBy: user?.employeeId,
      department: user?.department
    };

    try {
      const response = await fetch(`${backendUrl}/requests`, {
        method: editMode && requestId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });
      if (response.ok) {
        alert('Success!');
        onBack();
      }
    } catch (error) {
      alert('Error submitting form');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="f05-full-page-container">
      <div className="f05-training-form-container">
        <DocumentHeader 
            docTitle="FILE MOVEMENT REGISTER" 
            docNo="OF/DG/005" 
            issueNo="1" 
            pageInfo="Page 1 of 1"
        />

        <div className="f05-document-body">
          <table className="f05-movement-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>ተ.ቁ<br/>S.N.</th>
                <th>የፋይል ቁጥር<br/>File No.</th>
                <th style={{ width: '25%' }}>የፋይሉን ተረካቢ<br/>File Delivered to</th>
                <th>ቀን<br/>Date</th>
                <th>ፊርማ<br/>Signature</th>
                <th style={{ width: '20%' }}>የፋይሉን አስረካቢ<br/>Issued By</th>
                <th>የተመለሰበት ቀን<br/>Returned</th>
                <th>ምልከታ<br/>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td><input type="text" className="f05-form-input" value={row.fileNo} onChange={(e) => handleInputChange(index, 'fileNo', e.target.value)} /></td>
                  <td><input type="text" className="f05-form-input" value={row.deliveredTo} onChange={(e) => handleInputChange(index, 'deliveredTo', e.target.value)} /></td>
                  <td><input type="date" className="f05-form-input" value={row.dateDelivered} onChange={(e) => handleInputChange(index, 'dateDelivered', e.target.value)} /></td>
                  <td><input type="text" className="f05-form-input" value={row.recipientSignature} onChange={(e) => handleInputChange(index, 'recipientSignature', e.target.value)} /></td>
                  <td><input type="text" className="f05-form-input" value={row.issuedBy} onChange={(e) => handleInputChange(index, 'issuedBy', e.target.value)} /></td>
                  <td><input type="date" className="f05-form-input" value={row.dateReturned} onChange={(e) => handleInputChange(index, 'dateReturned', e.target.value)} /></td>
                  <td><input type="text" className="f05-form-input" value={row.remarks} onChange={(e) => handleInputChange(index, 'remarks', e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Row Controls (Hidden on Print) */}
          <div className="f05-row-controls no-print">
            <button type="button" onClick={addRow} className="f05-control-btn add">+</button>
            <button type="button" onClick={removeRow} className="f05-control-btn remove">-</button>
      
          </div>

          <FormFooter onCancel={onBack} onSubmit={handleSubmit} isSubmitting={submitting} />
        </div>
      </div>
    </div>
  );
};

export default Form05;