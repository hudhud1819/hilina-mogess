import React, { useState } from 'react';
import DocumentHeader from '../../DocumentHeader/DocumentHeader';
import FormFooter from '../../DocumentHeader/FormFooter';
// Make sure this path is correct - adjust if needed
import './Form17.css'; // Changed from InternalQualityAuditPlan.css

const Form017 = ({ onBack, submitting, editMode, documentId }) => {
  const [formData, setFormData] = useState({
    auditee: '',
    auditNumber: '',
    auditDate: '',
    auditors: '',
    standard: '',
    objectives: '',
    scope: '',
    planRows: [
      { place: '', contact: '', dateTime: '', auditors: '' },
      { place: '', contact: '', dateTime: '', auditors: '' },
      { place: '', contact: '', dateTime: '', auditors: '' },
      { place: '', contact: '', dateTime: '', auditors: '' },
      { place: '', contact: '', dateTime: '', auditors: '' }
    ],
    leadAuditor: '',
    signature: '',
    signDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...formData.planRows];
    updatedRows[index][field] = value;
    setFormData({ ...formData, planRows: updatedRows });
  };

  const addRow = () => {
    setFormData({
      ...formData,
      planRows: [...formData.planRows, { place: '', contact: '', dateTime: '', auditors: '' }]
    });
  };

  return (
    <div className="internal-audit-container">
      <div className="audit-watermark">APPROVED</div>

      <div className="audit-master-layout">
        <DocumentHeader 
          docTitle="INTERNAL QUALITY AUDIT PLAN" 
          docNo="OF/DG/017" 
          issueNo="1" 
          pageInfo="Page 1 of 1" 
        />
        
        <div className="audit-document-body">
          <div className="audit-top-fields">
            <div className="audit-field-row">
              <div className="audit-input-group">
                <span className="audit-label">1. AUDITEE:</span>
                <input 
                  type="text" 
                  name="auditee" 
                  value={formData.auditee} 
                  onChange={handleInputChange} 
                  className="audit-input-field" 
                />
              </div>
              <div className="audit-input-group">
                <span className="audit-label">2. AUDIT NUMBER:</span>
                <input 
                  type="text" 
                  name="auditNumber" 
                  value={formData.auditNumber} 
                  onChange={handleInputChange} 
                  className="audit-input-field" 
                />
              </div>
            </div>

            <div className="audit-field-row">
              <div className="audit-input-group">
                <span className="audit-label">3. DATE OF AUDIT:</span>
                <input 
                  type="date" 
                  name="auditDate" 
                  value={formData.auditDate} 
                  onChange={handleInputChange} 
                  className="audit-input-field" 
                />
              </div>
              <div className="audit-input-group">
                <span className="audit-label">4. AUDITORS:</span>
                <input 
                  type="text" 
                  name="auditors" 
                  value={formData.auditors} 
                  onChange={handleInputChange} 
                  className="audit-input-field" 
                />
              </div>
            </div>

            <div className="audit-field-row full-width">
              <div className="audit-input-group">
                <span className="audit-label">5. STANDARD:</span>
                <input 
                  type="text" 
                  name="standard" 
                  value={formData.standard} 
                  onChange={handleInputChange} 
                  className="audit-input-field" 
                />
              </div>
            </div>

            <div className="audit-field-row full-width">
              <div className="audit-input-group">
                <span className="audit-label">6. OBJECTIVES:</span>
                <textarea 
                  name="objectives" 
                  rows="2" 
                  value={formData.objectives} 
                  onChange={handleInputChange} 
                  className="audit-textarea-field" 
                />
              </div>
            </div>

            <div className="audit-field-row full-width">
              <div className="audit-input-group">
                <span className="audit-label">7. SCOPE:</span>
                <textarea 
                  name="scope" 
                  rows="2" 
                  value={formData.scope} 
                  onChange={handleInputChange} 
                  className="audit-textarea-field" 
                />
              </div>
            </div>
          </div>

          <div className="audit-plan-section">
            <h3 className="audit-section-title">8. AUDIT PLAN</h3>
            <table className="audit-plan-table">
              <thead>
                <tr>
                  <th>Place</th>
                  <th>Person to be contacted</th>
                  <th>Date and Time</th>
                  <th>Auditor(s)</th>
                </tr>
              </thead>
              <tbody>
                {formData.planRows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <input 
                        type="text" 
                        className="audit-table-input" 
                        value={row.place} 
                        onChange={(e) => handleRowChange(index, 'place', e.target.value)} 
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="audit-table-input" 
                        value={row.contact} 
                        onChange={(e) => handleRowChange(index, 'contact', e.target.value)} 
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="audit-table-input" 
                        value={row.dateTime} 
                        onChange={(e) => handleRowChange(index, 'dateTime', e.target.value)} 
                      />
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="audit-table-input" 
                        value={row.auditors} 
                        onChange={(e) => handleRowChange(index, 'auditors', e.target.value)} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addRow} className="audit-add-row-btn">+ Add Row</button>
          </div>

          <div className="audit-signature-section">
            <div className="audit-signature-row">
              <div className="audit-sig-box">
                <span className="audit-label">Lead Auditor's Name:</span>
                <input 
                  type="text" 
                  name="leadAuditor" 
                  value={formData.leadAuditor} 
                  onChange={handleInputChange} 
                  className="audit-input-field" 
                />
              </div>
              <div className="audit-sig-box">
                <span className="audit-label">Signature:</span>
                <input 
                  type="text" 
                  name="signature" 
                  value={formData.signature} 
                  onChange={handleInputChange} 
                  className="audit-input-field" 
                />
              </div>
              <div className="audit-sig-box">
                <span className="audit-label">Date:</span>
                <input 
                  type="date" 
                  name="signDate" 
                  value={formData.signDate} 
                  onChange={handleInputChange} 
                  className="audit-input-field" 
                />
              </div>
            </div>
          </div>
        </div>

        
        <FormFooter 
          onCancel={onBack} 
          onSubmit={() => console.log(formData)} 
          isSubmitting={submitting}
          editMode={editMode}
          documentId={documentId}
        />
      </div>
    </div>
  );
};

export default Form017;