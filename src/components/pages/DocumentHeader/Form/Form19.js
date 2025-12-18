import React, { useState } from 'react';
import './Form19.css';
import DocumentHeader from '../../DocumentHeader/DocumentHeader';
import FormFooter from '../../DocumentHeader/FormFooter';

const Form19 = ({ user, onBack, backendUrl }) => {
    const [formData, setFormData] = useState({
        dateAuditConducted: '',
        auditRefNo: '',
        ncrNo: '',
        auditee: '',
        location: '',
        ncrDescription: '',
        objectiveEvidence: '',
        standardRequirement: '',
        dateIssued: '', // Added state for the shared date field
        correctiveActions: Array(4).fill({ action: '', date: '' })
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        // Submission logic here
        setSubmitting(false);
    };

    return (
        <div className="f19-full-page-container">
            <div className="f19-form-paper">
                <DocumentHeader 
                    docTitle="NON-CONFORMANCE REPORT FORM" 
                    docNo="OF/DG/019" 
                    issueNo="1" 
                    pageInfo="Page 1 of 1"
                />

                <div className="f18-document-body">
                    <table className="f19-main-table">
                        <tbody>
                            {/* Row 1-3: Date, Audit Ref, NCR No */}
                            <tr>
                                <td colSpan="2" style={{ width: '60%' }}>
                                    <label className="f19-label">1. Date audit conducted:</label>
                                    <input type="text" className="f19-input" value={formData.dateAuditConducted} onChange={(e) => handleChange('dateAuditConducted', e.target.value)} />
                                </td>
                                <td colSpan="1" style={{ width: '40%' }}>
                                    <div className="f19-nested-cell">
                                        <label className="f19-label">2. Audit Ref. No.:</label>
                                        <input type="text" className="f19-input" value={formData.auditRefNo} onChange={(e) => handleChange('auditRefNo', e.target.value)} />
                                    </div>
                                    <div className="f19-nested-cell f19-border-top">
                                        <label className="f19-label">3. NCR No.:</label>
                                        <input type="text" className="f19-input" value={formData.ncrNo} onChange={(e) => handleChange('ncrNo', e.target.value)} />
                                    </div>
                                </td>
                            </tr>

                            {/* Section 4: Auditor Details - Updated for 3 Name/Signature Rows */}
                            <tr className="f19-section-row">
                                <td colSpan="3"><label className="f19-label">4. Auditor(s)</label></td>
                            </tr>
                            <tr className="f19-sub-header-row">
                                <td style={{ width: '40%' }}>Name</td>
                                <td style={{ width: '30%' }}>Signature</td>
                                <td style={{ width: '30%' }}>Date the NCR issued to the Auditee:</td>
                            </tr>
                            
                            {/* Auditor Row 1 */}
                            <tr>
                                <td><input type="text" className="f19-input" /></td>
                                <td><div className="f19-sig-space"></div></td>
                                {/* Date cell spans 3 rows vertically */}
                                <td rowSpan="3" className="f19-vertical-center">
                                    <input 
                                        type="text" 
                                        className="f19-input f19-text-center" 
                                        placeholder="DD/MM/YYYY" 
                                        value={formData.dateIssued}
                                        onChange={(e) => handleChange('dateIssued', e.target.value)}
                                    />
                                </td>
                            </tr>
                            
                            {/* Auditor Row 2 */}
                            <tr>
                                <td><input type="text" className="f19-input" /></td>
                                <td><div className="f19-sig-space"></div></td>
                            </tr>

                            {/* Auditor Row 3 (NEW) */}
                            <tr>
                                <td><input type="text" className="f19-input" /></td>
                                <td><div className="f19-sig-space"></div></td>
                            </tr>

                            {/* Standard Rows 5-9 */}
                            <tr>
                                <td colSpan="3">
                                    <label className="f19-label">5. Auditee:</label>
                                    <input type="text" className="f19-input" value={formData.auditee} onChange={(e) => handleChange('auditee', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    <label className="f19-label">6. Location:</label>
                                    <input type="text" className="f19-input" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    <label className="f19-label">7. Description of the non-conformity:</label>
                                    <textarea className="f19-textarea" rows="3" value={formData.ncrDescription} onChange={(e) => handleChange('ncrDescription', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    <label className="f19-label">8. Objective evidence for the non-conformity:</label>
                                    <textarea className="f19-textarea" rows="3" value={formData.objectiveEvidence} onChange={(e) => handleChange('objectiveEvidence', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    <label className="f19-label">9. The relevant ISO 9001 standard requirement/Quality Manual/Procedure/Work Instruction:</label>
                                    <textarea className="f19-textarea" rows="2" value={formData.standardRequirement} onChange={(e) => handleChange('standardRequirement', e.target.value)} />
                                </td>
                            </tr>

                            {/* Section 10: Agreement */}
                            <tr className="f19-section-row">
                                <td colSpan="3"><label className="f19-label">10. The Auditee has understood and agreed on this NCR.</label></td>
                            </tr>
                            <tr className="f19-sig-row">
                                <td>
                                    <label className="f19-small-label">Name:</label>
                                    <input type="text" className="f19-input" />
                                </td>
                                <td>
                                    <label className="f19-small-label">Signature:</label>
                                    <div className="f19-sig-space"></div>
                                </td>
                                <td>
                                    <label className="f19-small-label">Date:</label>
                                    <input type="text" className="f19-input f19-text-center" />
                                </td>
                            </tr>

                            {/* Section 11: Corrective Actions */}
                            <tr className="f19-section-row">
                                <td colSpan="3"><label className="f19-label">11. Corrective action(s) recommended by the Auditee and date of realization</label></td>
                            </tr>
                            <tr className="f19-sub-header-row">
                                <td colSpan="2">Corrective action(s)</td>
                                <td>Date of realization</td>
                            </tr>
                            {formData.correctiveActions.map((_, idx) => (
                                <tr key={idx}>
                                    <td colSpan="2"><input type="text" className="f19-input" /></td>
                                    <td><input type="text" className="f19-input f19-text-center" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <FormFooter 
                        onCancel={onBack} 
                        onSubmit={handleSubmit} 
                        isSubmitting={submitting}
                        submitText="Submit NCR"
                    />
                </div>
            </div>
        </div>
    );
};

export default Form19;