import React, { useState, useEffect } from 'react';
import './Form04.css';
import DocumentHeader from '../../DocumentHeader/DocumentHeader';
import FormFooter from '../../DocumentHeader/FormFooter';

const Form4 = ({ user, onBack, editMode, existingData, duplicateData, requestId, backendUrl, submitting }) => {
    // Keep your existing form structure exactly as is
    const [formData, setFormData] = useState({
        day: '',
        sessions: Array(5).fill({ title: '', facilitator: '' })
    });

    // Add backend states WITHOUT changing your structure
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [backendStatus, setBackendStatus] = useState('Checking...');
    const [cleanBackendUrl, setCleanBackendUrl] = useState('');

    // Check backend connection (runs once)
    useEffect(() => {
        const checkBackend = async () => {
            if (!backendUrl) {
                setBackendStatus('No backend URL provided');
                return;
            }

            // Fix URL format
            let urlToUse = backendUrl.trim();
            urlToUse = urlToUse.replace(/\/$/, '');
            urlToUse = urlToUse.replace(/\/api$/, '');
            setCleanBackendUrl(urlToUse);

            try {
                const response = await fetch(`${urlToUse}/api/health`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (response.ok) {
                    setBackendStatus('Connected ✅');
                } else {
                    setBackendStatus(`Error ${response.status} ❌`);
                }
            } catch (err) {
                setBackendStatus('Not connected ❌');
            }
        };
        
        if (backendUrl) checkBackend();
    }, [backendUrl]);

    // Initialize data if in edit/duplicate mode
    useEffect(() => {
        if (editMode && existingData) {
            const data = existingData.formData || existingData;
            setFormData({
                day: data.day || '',
                sessions: data.sessions || Array(5).fill({ title: '', facilitator: '' })
            });
        } else if (duplicateData) {
            const data = duplicateData.formData || duplicateData;
            setFormData({
                day: data.day || '',
                sessions: data.sessions || Array(5).fill({ title: '', facilitator: '' })
            });
        }
    }, [editMode, existingData, duplicateData]);

    // KEEP your existing handler EXACTLY as is
    const handleInputChange = (index, field, value) => {
        const updatedSessions = [...formData.sessions];
        updatedSessions[index][field] = value;
        setFormData({ ...formData, sessions: updatedSessions });
    };

    // Add handler for day field
    const handleDayChange = (e) => {
        setFormData({ ...formData, day: e.target.value });
    };

    // NEW: Enhanced submit function with backend
    const handleSubmit = async (e) => {
        console.log('=== TRAINING SCHEDULE FORM SUBMISSION ===');
        
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

       
        // Check if any sessions have content
        const hasContent = formData.sessions.some(session => 
            session.title.trim() !== '' || session.facilitator.trim() !== ''
        );
        
        if (!hasContent) {
            setError('Please fill in at least one session');
            setIsSubmitting(false);
            return;
        }

        try {
            // Prepare data for backend - using YOUR existing structure
            const requestData = {
                formId: 'form-04',  // Added for backend
                formData: formData, // Your existing structure
                submittedBy: user?.employeeId || user?.id || 'unknown',
                submitterName: user?.name || 'Unknown User',
                submitterEmail: user?.email || '',
                department: user?.department || 'General',
                status: 'pending',
                formName: 'Training Schedule Form',
                formNumber: 'OF/DG/004',
                formType: 'training',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            console.log('Submitting:', requestData);

            // Determine URL to use
            const urlToUse = cleanBackendUrl || backendUrl;
            let savedToBackend = false;

            // Try backend if available
            if (urlToUse && backendStatus.includes('Connected')) {
                try {
                    const response = await fetch(`${urlToUse}/api/requests`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(requestData)
                    });

                    if (response.ok) {
                        const result = await response.json();
                        console.log('✅ Saved to backend:', result);
                        savedToBackend = true;
                        
                        // Also save locally as backup
                        saveToLocalStorage(requestData);
                        
                        setSuccess(true);
                        setTimeout(() => {
                            if (onBack) onBack();
                        }, 2000);
                        return;
                    }
                } catch (backendError) {
                    console.log('Backend save failed, using localStorage');
                }
            }

            // Fallback to localStorage
            saveToLocalStorage(requestData);
            
            setSuccess(true);
            setTimeout(() => {
                if (onBack) onBack();
            }, 2000);
            
        } catch (err) {
            console.error('Submit error:', err);
            setError('Failed to save form: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to save to localStorage
    const saveToLocalStorage = (requestData) => {
        const newRequest = {
            ...requestData,
            _id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            savedLocally: true
        };
        
        const existingRequests = JSON.parse(localStorage.getItem('form-requests') || '[]');
        existingRequests.push(newRequest);
        localStorage.setItem('form-requests', JSON.stringify(existingRequests));
        
        console.log('💾 Saved locally:', newRequest);
    };

    // Wrapper for FormFooter to handle submit
    const handleFooterSubmit = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        handleSubmit(e);
    };

    const handleFooterCancel = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (onBack) onBack();
    };

    return (
        <div className="f4-document-container">
            {/* Watermark as seen in image 44.jpg */}
            <div className="f4-watermark">APPROVED</div>

            

            {/* Error/Success Messages (NEW) */}
            {error && (
                <div style={{
                    padding: '10px',
                    marginBottom: '15px',
                    backgroundColor: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px',
                    color: '#721c24',
                    fontSize: '14px'
                }}>
                    ⚠️ {error}
                    <button 
                        onClick={() => setError(null)}
                        style={{
                            float: 'right',
                            background: 'none',
                            border: 'none',
                            fontSize: '16px',
                            cursor: 'pointer',
                            color: '#721c24'
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            {success && (
                <div style={{
                    padding: '10px',
                    marginBottom: '15px',
                    backgroundColor: '#d4edda',
                    border: '1px solid #c3e6cb',
                    borderRadius: '4px',
                    color: '#155724',
                    fontSize: '14px'
                }}>
                    ✅ Training schedule submitted successfully!
                    <div style={{ fontSize: '12px', marginTop: '5px' }}>
                        {backendStatus.includes('✅') ? 'Saved to server' : 'Saved locally'}
                    </div>
                </div>
            )}

            {/* YOUR EXISTING LAYOUT - NO CHANGES */}
            <div className="f4-master-layout">
                <DocumentHeader 
                    docTitle="TRAINING SCHEDULE FORM" 
                    docNo="OF/DG/004" 
                    issueNo="1" 
                    pageInfo="Page 1 of 2" 
                />

                <div className="f4-document-body">
                    <table className="f4-schedule-table">
                        <thead>
                            {/* Bilingual Header Row 1 */}
                            <tr className="f4-header-amharic">
                                <th>ልጠናው ርዕስ<br></br>
                                    TRAINING TITLE</th>
                                <th>ቀን እና ሰዓት<br></br>
                                    DATE & TIME
                                </th>
                                <th>አመቻቾች<br></br>
                                   FACILITATOR</th>
                            </tr>
                        </thead>
                        <tbody>
                           

                            {/* Row for Day/Date Input */}
                            <tr className="f4-day-row">
                                <td>
                                    
                                </td>
                                <td className="f4-date-cell">
                                    <div className="f4-day-label">ቀን</div>
                                    <div className="f4-day-label">Day</div>
                                    <div className="f4-day-label">8:30 – 9:00</div>
                                    <div className="f4-day-label">9:00 – 10:30 AM</div>
                                </td>
                                <td>
                                   
                                </td>
                            </tr>

                          

                            {/* Break Row */}
                            <tr className="f4-static-row">
                                <td className="f4-label-cell">
                                    <div className="f4-amharic-small">የሻይ ረፍት</div>
                                    <div className="f4-bold-text">Break</div>
                                </td>
                                <td className="f4-time-cell">10:30 – 11:00</td>
                                <td>
                                    <textarea 
                                        className="f4-table-input" 
                                        placeholder="Break"
                                        disabled={true}
                                        style={{ backgroundColor: '#f8f9fa' }}
                                    />
                                </td>
                            </tr>

                            {/* Session 3 */}
                            <tr>
                                <td>
                                    <textarea 
                                        className="f4-table-input" 
                                        onChange={(e) => handleInputChange(2, 'title', e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </td>
                                <td className="f4-time-cell">11:00 – 12:30</td>
                                <td>
                                    <textarea 
                                        className="f4-table-input" 
                                        onChange={(e) => handleInputChange(2, 'facilitator', e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </td>
                            </tr>

                            {/* Lunch Row */}
                            <tr className="f4-static-row">
                                <td className="f4-label-cell">
                                    <div className="f4-amharic-small">ምሳ</div>
                                    <div className="f4-bold-text">Lunch</div>
                                </td>
                                <td className="f4-time-cell">12:30 – 2:00 PM</td>
                                <td>
                                    <textarea 
                                        className="f4-table-input" 
                                        placeholder="Lunch"
                                        disabled={true}
                                        style={{ backgroundColor: '#f8f9fa' }}
                                    />
                                </td>
                            </tr>

                            {/* Session 4 */}
                            <tr>
                                <td>
                                    <textarea 
                                        className="f4-table-input" 
                                        onChange={(e) => handleInputChange(3, 'title', e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </td>
                                <td className="f4-time-cell">2:00 – 3:30</td>
                                <td>
                                    <textarea 
                                        className="f4-table-input" 
                                        onChange={(e) => handleInputChange(3, 'facilitator', e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </td>
                            </tr>

                            {/* Second Break Row */}
                            <tr className="f4-static-row">
                                <td className="f4-label-cell">
                                    <div className="f4-amharic-small">የሻይ ረፍት</div>
                                    <div className="f4-bold-text">Break</div>
                                </td>
                                <td className="f4-time-cell">3:30 – 4:00</td>
                                <td>
                                    <textarea 
                                        className="f4-table-input" 
                                        placeholder="Break"
                                        disabled={true}
                                        style={{ backgroundColor: '#f8f9fa' }}
                                    />
                                </td>
                            </tr>

                            {/* Session 5 */}
                            <tr>
                                <td>
                                    <textarea 
                                        className="f4-table-input" 
                                        onChange={(e) => handleInputChange(4, 'title', e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </td>
                                <td className="f4-time-cell">4:00 – 5:00</td>
                                <td>
                                    <textarea 
                                        className="f4-table-input" 
                                        onChange={(e) => handleInputChange(4, 'facilitator', e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Debug/Info Section (NEW but optional) */}
                  
                </div>

                {/* Updated FormFooter with backend integration */}
                <FormFooter 
                    onCancel={handleFooterCancel} 
                    onSubmit={handleFooterSubmit} 
                    isSubmitting={isSubmitting}
                    submitText={editMode ? "Update Schedule" : "Submit Schedule"}
                />
            </div>
        </div>
    );
};

export default Form4;