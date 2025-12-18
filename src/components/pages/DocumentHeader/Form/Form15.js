import React, { useState } from 'react';
import './Form15.css';
import DocumentHeader from '../../DocumentHeader/DocumentHeader';
import FormFooter from '../../DocumentHeader/FormFooter';

const Form15 = ({ onBack, submitting }) => {
    // Initializing state with 5 empty rows as seen in the template
    const [formData, setFormData] = useState({
        functionName: '',
        date: '',
        rows: Array(5).fill({
            nonConformity: '',
            ncrNo: '',
            rootCauses: '',
            actions: '',
            realizationDate: '',
            followUpDate: '',
            responsibility: '',
            isClosed: false,
            isNotClosed: false
        })
    });

    const handleTopChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRowChange = (index, field, value) => {
        const updatedRows = [...formData.rows];
        
        // Handle mutual exclusivity for the status checkboxes
        if (field === 'isClosed' && value === true) {
            updatedRows[index] = { ...updatedRows[index], isClosed: true, isNotClosed: false };
        } else if (field === 'isNotClosed' && value === true) {
            updatedRows[index] = { ...updatedRows[index], isClosed: false, isNotClosed: true };
        } else {
            updatedRows[index] = { ...updatedRows[index], [field]: value };
        }
        
        setFormData({ ...formData, rows: updatedRows });
    };

    return (
        <div className="f15-document-container">
            {/* APPROVED Watermark */}
            <div className="f15-watermark">APPROVED</div>

            <div className="f15-master-layout">
                <DocumentHeader 
                    docTitle="CORRECTIVE ACTION PLAN" 
                    docNo="OF/DG/015" 
                    issueNo="1" 
                    pageInfo="Page 1 of 1" 
                />

                <div className="f15-document-body">
                    {/* Top Section */}
                    <div className="f15-top-grid">
                        <div className="f15-input-group function-box">
                            <label className="f15-bold-label">Name of the Function: (Planner)</label>
                            <input 
                                type="text" 
                                name="functionName"
                                value={formData.functionName}
                                onChange={handleTopChange}
                                className="f15-line-input"
                            />
                        </div>
                        <div className="f15-input-group date-box">
                            <label className="f15-bold-label">Date:</label>
                            <input 
                                type="text" 
                                name="date"
                                value={formData.date}
                                onChange={handleTopChange}
                                className="f15-line-input"
                            />
                        </div>
                    </div>

                    {/* Main Corrective Action Table */}
                    <table className="f15-action-table">
                        <thead>
                            <tr>
                                <th rowSpan="2" style={{ width: '15%' }}>Actual/Potential Non-conformities</th>
                                <th rowSpan="2" style={{ width: '8%' }}>NCR No. (if applicable)</th>
                                <th rowSpan="2" style={{ width: '12%' }}>Root Causes</th>
                                <th rowSpan="2" style={{ width: '15%' }}>Actions to be taken</th>
                                <th rowSpan="2" style={{ width: '10%' }}>Specific Date of Realization</th>
                                <th rowSpan="2" style={{ width: '10%' }}>Follow-up Date (s)</th>
                                <th rowSpan="2" style={{ width: '12%' }}>Responsibility</th>
                                <th colSpan="2">Corrective Action Status</th>
                            </tr>
                            <tr>
                                <th className="f15-sub-th">Closed</th>
                                <th className="f15-sub-th">Not Closed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.rows.map((row, index) => (
                                <tr key={index}>
                                    <td><textarea value={row.nonConformity} onChange={(e) => handleRowChange(index, 'nonConformity', e.target.value)} /></td>
                                    <td><textarea value={row.ncrNo} onChange={(e) => handleRowChange(index, 'ncrNo', e.target.value)} /></td>
                                    <td><textarea value={row.rootCauses} onChange={(e) => handleRowChange(index, 'rootCauses', e.target.value)} /></td>
                                    <td><textarea value={row.actions} onChange={(e) => handleRowChange(index, 'actions', e.target.value)} /></td>
                                    <td><input value={row.realizationDate} onChange={(e) => handleRowChange(index, 'realizationDate', e.target.value)} /></td>
                                    <td><input value={row.followUpDate} onChange={(e) => handleRowChange(index, 'followUpDate', e.target.value)} /></td>
                                    <td><input value={row.responsibility} onChange={(e) => handleRowChange(index, 'responsibility', e.target.value)} /></td>
                                    <td className="f15-checkbox-cell">
                                        <input type="checkbox" checked={row.isClosed} onChange={(e) => handleRowChange(index, 'isClosed', e.target.checked)} />
                                    </td>
                                    <td className="f15-checkbox-cell">
                                        <input type="checkbox" checked={row.isNotClosed} onChange={(e) => handleRowChange(index, 'isNotClosed', e.target.checked)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* N.B Note */}
                    <div className="f15-note-section">
                        <p><strong>N.B:</strong> The action plan shall be by the responsible function and a copy of the plan shall be submitted to the Quality Manager</p>
                    </div>
                </div>

                {/* Footer Warnings */}
                <div className="f15-footer-warning">
                    <p className="f15-amharic">ከመጠቀም በፊት ትክክለኛው ቅጽ መሆኑን ያረጋግጡ ።</p>
                    <p className="f15-english">PLEASE MAKE SURE THAT THIS IS THE CORRECT ISSUE BEFORE USE</p>
                </div>

                <FormFooter 
                    onCancel={onBack} 
                    onSubmit={() => console.log(formData)} 
                    isSubmitting={submitting}
                />
            </div>
        </div>
    );
};

export default Form15;