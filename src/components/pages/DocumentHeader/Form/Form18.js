import React, { useState } from 'react';
import './Form18.css';
import DocumentHeader from '../../DocumentHeader/DocumentHeader';
import FormFooter from '../../DocumentHeader/FormFooter';

const Form18 = ({ user, onBack, backendUrl }) => {
    const [formData, setFormData] = useState({
        auditee: '',
        auditProcess: '',
        description: '',
        dateConducted: '',
        objectives: '',
        scope: '',
        documentsUsed: '',
        auditPlan: '',
        findings: '', // Added field for Section 9 input
        strength: '',
        potentialImprovements: '',
        nonConformities: '',
        excludedRequirements: '',
        conclusion: '',
        leadAuditor: '',
        signature: '',
        date: ''
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        // Add your submission logic here
        setSubmitting(false);
    };

    return (
        <div className="f18-full-page-container">
            <div className="f18-form-paper">
                <DocumentHeader 
                    docTitle="INTERNAL AUDIT REPORT FORM" 
                    docNo="OF/DG/018" 
                    issueNo="1" 
                    pageInfo="Page 1 of 1"
                />

                <div className="f18-document-body">
                    <table className="f18-main-table">
                        <tbody>
                            <tr>
                                <td colSpan="3">
                                    <span className="f18-label">1. Auditee:</span>
                                    <input type="text" className="f18-input" value={formData.auditee} onChange={(e) => handleChange('auditee', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    <span className="f18-label">2. Audit process:</span>
                                    <input type="text" className="f18-input" value={formData.auditProcess} onChange={(e) => handleChange('auditProcess', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    <span className="f18-label">3. Short Description of the audit:</span>
                                    <textarea className="f18-textarea" rows="2" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    <span className="f18-label">4. Date Audit conducted:</span>
                                    <input type="text" className="f18-input" value={formData.dateConducted} onChange={(e) => handleChange('dateConducted', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    <span className="f18-label">5. Objective(s) of the audit:</span>
                                    <textarea className="f18-textarea" value={formData.objectives} onChange={(e) => handleChange('objectives', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    <span className="f18-label">6. Scope of the audit:</span>
                                    <input type="text" className="f18-input" value={formData.scope} onChange={(e) => handleChange('scope', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    <span className="f18-label">7. Documents used:</span>
                                    <input type="text" className="f18-input" value={formData.documentsUsed} onChange={(e) => handleChange('documentsUsed', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    <span className="f18-label">8. Audit Plan:</span>
                                    <input type="text" className="f18-input" value={formData.auditPlan} onChange={(e) => handleChange('auditPlan', e.target.value)} />
                                </td>
                            </tr>

                            {/* --- UPDATED SECTION 9: STACKED IN ONE ROW --- */}
                            <tr>
                                <td colSpan="3" className="f18-combined-findings-cell">
                                    <div className="f18-findings-group">
                                        <div className="f18-sub-section">
                                            <span className="f18-label">9. Findings:</span>
                                            <input 
                                                type="text" 
                                                className="f18-input f18-bold" 
                                                value={formData.findings} 
                                                onChange={(e) => handleChange('findings', e.target.value)} 
                                            />
                                        </div>
                                        <div className="f18-sub-section f18-border-top">
                                            <span className="f18-label">9.1 Strength:</span>
                                            <textarea className="f18-textarea" value={formData.strength} onChange={(e) => handleChange('strength', e.target.value)} />
                                        </div>
                                        <div className="f18-sub-section f18-border-top">
                                            <span className="f18-label">9.2 Potential for Improvements:</span>
                                            <textarea className="f18-textarea" value={formData.potentialImprovements} onChange={(e) => handleChange('potentialImprovements', e.target.value)} />
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            {/* 9.3 Remains separate or you can move it into the group above if needed */}
                            <tr>
                                <td colSpan="3">
                                    <span className="f18-label">9.3 Agreed non-conformities:</span>
                                    <textarea className="f18-textarea" value={formData.nonConformities} onChange={(e) => handleChange('nonConformities', e.target.value)} />
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="3">
                                    <span className="f18-label">10. Excluded requirements of ISO 9001:2008:</span>
                                    <input type="text" className="f18-input" value={formData.excludedRequirements} onChange={(e) => handleChange('excludedRequirements', e.target.value)} />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="3">
                                    <span className="f18-label">11. Conclusion:</span>
                                    <textarea className="f18-textarea" rows="3" value={formData.conclusion} onChange={(e) => handleChange('conclusion', e.target.value)} />
                                </td>
                            </tr>

                            {/* Bottom Lead Auditor Section */}
                            <tr className="f18-footer-row">
                                <td style={{ width: '40%' }}>
                                    <span className="f18-label">Lead Auditor Name:</span>
                                    <input type="text" className="f18-input" value={formData.leadAuditor} onChange={(e) => handleChange('leadAuditor', e.target.value)} />
                                </td>
                                <td style={{ width: '30%' }}>
                                    <span className="f18-label">Signature:</span>
                                    <div className="f18-signature-placeholder"></div>
                                </td>
                                <td style={{ width: '30%' }}>
                                    <span className="f18-label">Date:</span>
                                    <input type="Date" className="f18-input" value={formData.date} onChange={(e) => handleChange('date', e.target.value)} />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <FormFooter 
                        onCancel={onBack} 
                        onSubmit={handleSubmit} 
                        isSubmitting={submitting}
                        submitText="Submit Audit Report"
                    />
                </div>
            </div>
        </div>
    );
};

export default Form18;