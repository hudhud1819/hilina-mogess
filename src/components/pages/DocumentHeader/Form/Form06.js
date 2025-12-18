import React, { useState } from 'react';
import DocumentHeader from '../../DocumentHeader/DocumentHeader';
import FormFooter from '../../DocumentHeader/FormFooter';
import './Form06.css';

const Form06 = ({ user, onBack, backendUrl, editMode, requestId }) => {
    const [submitting, setSubmitting] = useState(false);
    
    // Initialize with 10 empty rows as requested
    const [rows, setRows] = useState(Array(10).fill({
        regNo: '', enclosures: '', source: '', title: '', dateReceived: '', referredTo: '', fileNo: '', registeredBy: ''
    }));

    const handleInputChange = (rowIndex, field, value) => {
        const updatedRows = [...rows];
        updatedRows[rowIndex] = { ...updatedRows[rowIndex], [field]: value };
        setRows(updatedRows);
    };

    const addRow = () => {
        setRows([...rows, { regNo: '', enclosures: '', source: '', title: '', dateReceived: '', referredTo: '', fileNo: '', registeredBy: '' }]);
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
            formId: 'OF/DG/006',
            formName: 'Incoming Records and Document Registration Form',
            formData: { registrationRecords: rows.filter(r => r.regNo || r.title) },
            submittedBy: user?.employeeId,
            submittedByName: user?.name,
            department: user?.department,
            status: 'submitted'
        };

        try {
            const response = await fetch(`${backendUrl}/requests`, {
                method: editMode && requestId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData)
            });

            if (response.ok) {
                alert('Registration form submitted successfully!');
                onBack();
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
        <div className="f06-full-page-container">
            <div className="f06-form-paper">
                
                {/* 1. Integrated Header */}
                <DocumentHeader 
                    docTitle="INCOMING RECORDS AND DOCUMENT REGISTRATION FORM" 
                    docNo="OF/DG/006" 
                    issueNo="1" 
                    pageInfo="Page 1 of 1"
                />

                <div className="f06-document-body">
                    {/* 2. Main Registration Table */}
                    <table className="f06-registration-table">
                        <thead>
                            <tr>
                                <th style={{ width: '7%' }}>Regist
                                    ration No.</th>
                                <th style={{ width: '7%' }}>Enclosures</th>
                                <th style={{ width: '15%' }}>Source/Sender of the Document/Record</th>
                                <th style={{ width: '22%' }}>Title of the Record/Document/Subject</th>
                                <th style={{ width: '10%' }}>Date Received</th>
                                <th style={{ width: '10%' }}>Referred to</th>
                                <th style={{ width: '7%' }}>File No.</th>
                                <th style={{ width: '12%' }}>Registered by Name & Sign.</th>
                                <th style={{ width: '5%' }}>Implem
                                    entation</th>
                                <th style={{ width: '5%' }}>Signa
                                    ture</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index}>
                                    <td><input type="text" className="f06-table-input" value={row.regNo} onChange={(e) => handleInputChange(index, 'regNo', e.target.value)} /></td>
                                    <td><input type="text" className="f06-table-input" value={row.enclosures} onChange={(e) => handleInputChange(index, 'enclosures', e.target.value)} /></td>
                                    <td><input type="text" className="f06-table-input" value={row.source} onChange={(e) => handleInputChange(index, 'source', e.target.value)} /></td>
                                    <td><input type="text" className="f06-table-input" value={row.title} onChange={(e) => handleInputChange(index, 'title', e.target.value)} /></td>
                                    <td><input type="date" className="f06-table-input" value={row.dateReceived} onChange={(e) => handleInputChange(index, 'dateReceived', e.target.value)} /></td>
                                    <td><input type="text" className="f06-table-input" value={row.referredTo} onChange={(e) => handleInputChange(index, 'referredTo', e.target.value)} /></td>
                                    <td><input type="text" className="f06-table-input" value={row.fileNo} onChange={(e) => handleInputChange(index, 'fileNo', e.target.value)} /></td>
                                    <td><input type="text" className="f06-table-input" value={row.registeredBy} onChange={(e) => handleInputChange(index, 'registeredBy', e.target.value)} /></td>
                                    <td><input type="text" className="f06-table-input" /></td>
                                    <td><input type="text" className="f06-table-input" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* 3. Row Controls (Rectangular & Gray) */}
                    <div className="f06-row-controls f06-no-print">
                        <button type="button" onClick={addRow} className="f06-control-btn">+</button>
                        <button type="button" onClick={removeRow} className="f06-control-btn">-</button>
                        <span className="f06-control-label">Update rows</span>
                    </div>

                    {/* 4. Footer */}
                    <FormFooter 
                        onCancel={onBack} 
                        onSubmit={handleSubmit} 
                        isSubmitting={submitting} 
                        submitText={editMode ? "Update Registration" : "Submit Registration"}
                    />
                </div>
            </div>
        </div>
    );
};

export default Form06;