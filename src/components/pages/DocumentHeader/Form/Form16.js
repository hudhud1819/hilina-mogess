// src/pages/DocumentHeader/Form/Form016.js
import React, { useState, useEffect } from 'react';
import DocumentHeader from '../DocumentHeader';
import FormFooter from '../FormFooter'; 
import './Form16.css';

const Form016 = ({ user, onBack, backendUrl, editMode, existingData, requestId, duplicateData }) => {
  // Define months in the exact order as in the document
  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    auditRows: [{
      id: 1,
      directorate: '',
      monthData: {
        Sep: '',
        Oct: '',
        Nov: '',
        Dec: '',
        Jan: '',
        Feb: '',
        Mar: '',
        Apr: '',
        May: '',
        Jun: '',
        Jul: '',
        Aug: ''
      }
    }]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Map state to the variable name used in your snippet
  const submitting = isSubmitting;

  // Load existing data if in edit mode
  useEffect(() => {
    if (existingData) {
      setFormData(existingData);
    } else if (duplicateData) {
      setFormData(duplicateData);
    }
  }, [existingData, duplicateData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDirectorateChange = (index, value) => {
    setFormData(prev => {
      const newRows = [...prev.auditRows];
      newRows[index] = {
        ...newRows[index],
        directorate: value
      };
      return {
        ...prev,
        auditRows: newRows
      };
    });
  };

  const handleMonthDataChange = (rowIndex, month, value) => {
    setFormData(prev => {
      const newRows = [...prev.auditRows];
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        monthData: {
          ...newRows[rowIndex].monthData,
          [month]: value
        }
      };
      return {
        ...prev,
        auditRows: newRows
      };
    });
  };

  const addNewRow = () => {
    setFormData(prev => ({
      ...prev,
      auditRows: [
        ...prev.auditRows,
        {
          id: prev.auditRows.length + 1,
          directorate: '',
          monthData: {
            Sep: '',
            Oct: '',
            Nov: '',
            Dec: '',
            Jan: '',
            Feb: '',
            Mar: '',
            Apr: '',
            May: '',
            Jun: '',
            Jul: '',
            Aug: ''
          }
        }
      ]
    }));
  };

  const removeRow = (index) => {
    if (formData.auditRows.length > 1) {
      setFormData(prev => ({
        ...prev,
        auditRows: prev.auditRows.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const draftData = {
        formId: 'form-016',
        formName: 'OF DG 016 - Internal Audit Program',
        title: `Internal Audit Program - ${formData.year || 'Current Year'}`,
        category: 'Quality',
        priority: 'medium',
        status: 'draft',
        submittedAt: new Date().toISOString(),
        submittedBy: user.employeeId,
        formData: formData,
        metadata: {
          department: user.department,
          requesterName: user.name,
          requesterEmail: user.email
        }
      };

      const response = await fetch(`${backendUrl}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draftData)
      });

      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || 'Failed to save draft');
      
      setSuccess('Draft saved successfully!');
      
      setTimeout(() => {
        onBack();
      }, 1500);

    } catch (err) {
      console.error('Save draft error:', err);
      setError(err.message || 'Failed to save draft. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Prepare the form data
      const requestData = {
        formId: 'form-016',
        formName: 'OF DG 016 - Internal Audit Program',
        title: `Internal Audit Program - ${formData.year || 'Current Year'}`,
        category: 'Quality',
        priority: 'medium',
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        submittedBy: user.employeeId,
        formData: formData,
        metadata: {
          department: user.department,
          requesterName: user.name,
          requesterEmail: user.email
        }
      };

      // If editing, update existing request
      if (editMode && requestId) {
        const response = await fetch(`${backendUrl}/requests/${requestId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            formData: formData,
            status: 'submitted',
            updatedAt: new Date().toISOString()
          })
        });

        if (!response.ok) throw new Error('Failed to update request');
        setSuccess('Internal Audit Program updated successfully!');
      } else {
        // Submit new request
        const response = await fetch(`${backendUrl}/requests`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        });

        const result = await response.json();
        
        if (!response.ok) throw new Error(result.message || 'Submission failed');
        
        setSuccess('Internal Audit Program submitted successfully!');
      }

      // Wait a moment then go back
      setTimeout(() => {
        onBack();
      }, 2000);

    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form016-container">
      {/* Form Header */}
      <DocumentHeader 
        docTitle="Internal Audit Program"
        docNo="OF DG 016"
        issueNo="1"
        pageInfo="Page 1 of 1"
      />


      {/* Form Content */}
      <form className="form016-form" onSubmit={handleSubmit}>
      {/* Main Table - EXACT structure as in document */}
        <div className="form016-table-container">
          <table className="form016-main-table">
            <thead>
              <tr className="header-row">
                <th rowSpan="2" className="col-sn">
                  <strong>S.N.</strong>
                </th>
                <th rowSpan="2" className="col-directorate">
                  <strong>Directorate/Service</strong>
                </th>
                <th colSpan="12" className="col-year">
                  <strong>Year: {formData.year}</strong>
                </th>
              </tr>
              <tr className="months-header-row">
                {months.map(month => (
                  <th key={month} className={`col-month col-${month.toLowerCase()}`}>
                    <strong>{month}</strong>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {formData.auditRows.map((row, rowIndex) => (
                <tr key={row.id} className="audit-row">
                  {/* Serial Number Column */}
                  <td className="col-sn">
                    <div className="serial-number">
                      {rowIndex + 1}
                    </div>
                  </td>
                  
                  {/* Directorate/Service Column */}
                  <td className="col-directorate">
                    <input
                      type="text"
                      value={row.directorate}
                      onChange={(e) => handleDirectorateChange(rowIndex, e.target.value)}
                      placeholder="Enter directorate/service name"
                      className="directorate-input"
                      required
                    />
                  </td>
                  
                  {/* Month Columns */}
                  {months.map(month => (
                    <td key={month} className={`col-month col-${month.toLowerCase()}`}>
                      <select
                        value={row.monthData[month]}
                        onChange={(e) => handleMonthDataChange(rowIndex, month, e.target.value)}
                        className="month-select"
                      >
                        <option value="">--</option>
                        <option value="MR">MR</option>
                        <option value="CA&V">CA&V</option>
                        <option value="IA, MR">IA, MR</option>
                        <option value="IA, CA&V">IA, CA&V</option>
                        <option value="MR, CA&V">MR, CA&V</option>
                        <option value="IA, MR, CA&V">IA, MR, CA&V</option>
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
              
              {/* Add empty rows to match document layout if needed */}
              {Array.from({ length: 8 - formData.auditRows.length }).map((_, index) => (
                <tr key={`empty-${index}`} className="empty-row">
                  <td className="col-sn">
                    <div className="serial-number">
                      {formData.auditRows.length + index + 1}
                    </div>
                  </td>
                  <td className="col-directorate">
                    <div className="empty-directorate"></div>
                  </td>
                  {months.map(month => (
                    <td key={month} className={`col-month col-${month.toLowerCase()}`}>
                      <div className="empty-month"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
         
        </div>
          {/* Action Buttons */}
          <div className="form016-row-actions">
            <button
              type="button"
              className="add-row-btn"
              onClick={addNewRow}
              disabled={isSubmitting}
            >
       +
            </button>
            
            {formData.auditRows.length > 1 && (
              <button
                type="button"
                className="remove-row-btn"
                onClick={() => removeRow(formData.auditRows.length - 1)}
                disabled={isSubmitting}
              >
                -              </button>
            )}
          </div>
        Abbreviation:
          <div className="abrv"><strong>IA:</strong> Internal Audit<br></br></div>
          <div className="abre"><strong>MR:</strong> Management Review<br></br></div>
           <div className="abrev"><strong>CA&V:</strong> Corrective Action and Verification<br></br>
           </div>

        {/* Form Actions with Cancel, Save Draft, and Submit */}
        <div className="form016-actions">
          {error && (
            <div className="form016-error">
              ❌ {error}
            </div>
          )}
          
          {success && (
            <div className="form016-success">
              ✅ {success}
            </div>
          )}

        </div>

        <FormFooter 
          onCancel={onBack} 
          onSubmit={handleSubmit} 
          isSubmitting={submitting}
          submitText="Submit NCR"
        />
        
      </form>
      
    </div>
  );
};

export default Form016;