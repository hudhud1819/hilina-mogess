import React, { useState, useEffect } from 'react';
import DocumentHeader from '../../DocumentHeader/DocumentHeader'; 
import FormFooter from '../../DocumentHeader/FormFooter';
import './Form.css'; 

const Form02_Approval = ({ onBack, user, editMode, existingData, duplicateData, requestId, backendUrl }) => {
  // 1. Local State
  const [formState, setFormState] = useState({
    assignmentDate: '',
    docTitle1: '',
    docNumber1: '',
    requesterName: '',
    requesterSignature: '',
    requesterDate: '',
    approvalNotes: '',
    registrationList: [
      { sn: 1, function: '', docTitle: '', docNo: '', copies: '' },
      { sn: 2, function: '', docTitle: '', docNo: '', copies: '' },
      { sn: 3, function: '', docTitle: '', docNo: '', copies: '' },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [cleanBackendUrl, setCleanBackendUrl] = useState('');
  const formId = 'form-02';

  // 2. Check backend connection
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
          const data = await response.json();
          console.log('✅ Backend is available:', data);
          setBackendStatus('Connected ✅');
        } else {
          console.warn('⚠️ Backend returned error:', response.status);
          setBackendStatus(`Error ${response.status} ❌`);
        }
      } catch (err) {
        console.log('❌ Backend not available:', err.message);
        setBackendStatus('Not connected ❌');
      }
    };
    
    checkBackend();
  }, [backendUrl]);

  // 3. Initialize Data
  useEffect(() => {
    if (editMode && existingData) {
      setFormState(existingData.formData || existingData);
      console.log('📝 Loaded existing data for editing:', existingData);
    } else if (duplicateData) {
      setFormState(duplicateData.formData || duplicateData);
      console.log('📋 Loaded data for duplication:', duplicateData);
    } else if (user) {
      setFormState(prev => ({
        ...prev,
        requesterName: user.name || '',
        requesterDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [editMode, existingData, duplicateData, user]);

  // 4. Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleListChange = (index, field, value) => {
    const newList = [...formState.registrationList];
    newList[index][field] = value;
    setFormState(prevState => ({
      ...prevState,
      registrationList: newList,
    }));
  };

  // 5. Add new row to registration list
  const addRegistrationRow = () => {
    setFormState(prevState => ({
      ...prevState,
      registrationList: [
        ...prevState.registrationList,
        { 
          sn: prevState.registrationList.length + 1, 
          function: '', 
          docTitle: '', 
          docNo: '', 
          copies: '' 
        }
      ]
    }));
  };

  // 6. Remove row from registration list
  const removeRegistrationRow = (index) => {
    if (formState.registrationList.length <= 1) return;
    
    const newList = formState.registrationList.filter((_, i) => i !== index);
    // Reassign serial numbers
    const updatedList = newList.map((item, idx) => ({
      ...item,
      sn: idx + 1
    }));
    
    setFormState(prevState => ({
      ...prevState,
      registrationList: updatedList
    }));
  };

  // 7. Enhanced Submit function with MongoDB backend
  const handleSubmit = async (e) => {
    console.log('=== FORM 02 SUBMISSION START ===');
    
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validation
    const validationErrors = [];
    
    if (!formState.docTitle1?.trim()) {
      validationErrors.push('Document Title is required');
    }
    
    if (!formState.docNumber1?.trim()) {
      validationErrors.push('Document Number is required');
    }
    
    if (!formState.requesterName?.trim()) {
      validationErrors.push('Requester Name is required');
    }
    
    if (!formState.requesterDate) {
      validationErrors.push('Requester Date is required');
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join('. ') + '.');
      setLoading(false);
      return;
    }

    try {
      // Prepare form data
      const formData = {
        formId: formId,
        formData: formState,
        submittedBy: user?.employeeId || user?.id || user?.email || 'unknown',
        submitterName: user?.name || formState.requesterName || '',
        submitterEmail: user?.email || '',
        department: user?.department || '',
        status: 'pending',
        priority: 'medium',
        formType: 'approval',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('📤 Form data ready:', formData);

      // Determine which URL to use
      const urlToUse = cleanBackendUrl || (backendUrl?.endsWith('/api') ? backendUrl.slice(0, -4) : backendUrl);
      
      let savedToBackend = false;
      
      // Try backend submission if connected
      if (urlToUse && (backendStatus.includes('Connected') || backendStatus.includes('Checking'))) {
        console.log('🌐 Attempting to submit to backend:', urlToUse);
        
        try {
          const endpoint = `${urlToUse}/api/requests`;
          console.log(`📡 Calling: POST ${endpoint}`);
          
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
          });

          console.log('📨 Response status:', response.status);
          
          if (response.ok) {
            const result = await response.json();
            console.log('✅ Backend success:', result);
            savedToBackend = true;
            
            // Also save to localStorage as backup
            await saveToLocalStorage(formData);
            
            setSuccess(true);
            setTimeout(() => {
              if (onBack) onBack({ action: 'submitted', data: result.data });
            }, 2000);
            return;
          } else {
            const errorText = await response.text();
            console.warn(`⚠️ Backend returned ${response.status}:`, errorText);
          }
        } catch (backendError) {
          console.warn('❌ Backend failed:', backendError.message);
        }
      }

      // Fallback to localStorage
      console.log('💾 Using localStorage fallback');
      const localResult = await saveToLocalStorage(formData);
      
      setSuccess(true);
      setTimeout(() => {
        if (onBack) onBack({ 
          action: 'submitted_locally', 
          data: localResult,
          message: savedToBackend ? 'Saved to server' : 'Saved locally (backend unavailable)'
        });
      }, 2000);
      
    } catch (err) {
      console.error('❌ Final error:', err);
      setError('Form submission failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 8. Helper function to save to localStorage
  const saveToLocalStorage = async (formData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newRequest = {
      ...formData,
      _id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      savedLocally: true,
      formName: 'Document Approval Request Form',
      formNumber: 'OF/DG/002'
    };
    
    // Save to localStorage
    const existingRequests = JSON.parse(localStorage.getItem('form-requests') || '[]');
    existingRequests.push(newRequest);
    localStorage.setItem('form-requests', JSON.stringify(existingRequests));
    
    console.log('💾 Saved to localStorage:', newRequest);
    console.log('📊 Total local requests:', existingRequests.length);
    
    return newRequest;
  };

  // 9. Reset form
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form? All unsaved changes will be lost.')) {
      setFormState({
        assignmentDate: '',
        docTitle1: '',
        docNumber1: '',
        requesterName: user?.name || '',
        requesterSignature: '',
        requesterDate: new Date().toISOString().split('T')[0],
        approvalNotes: '',
        registrationList: [
          { sn: 1, function: '', docTitle: '', docNo: '', copies: '' },
          { sn: 2, function: '', docTitle: '', docNo: '', copies: '' },
          { sn: 3, function: '', docTitle: '', docNo: '', copies: '' },
        ],
      });
      setError(null);
      setSuccess(false);
    }
  };

  // 10. Wrapper for FormFooter
  const handleFooterSubmit = (e) => {
    console.log('🖱️ Submit button clicked for Form 02');
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

  // Get display URL
  const displayUrl = cleanBackendUrl || (backendUrl?.endsWith('/api') ? backendUrl.slice(0, -4) : backendUrl);

  return (
    <div className="document-container">
      <DocumentHeader 
        docTitle="DOCUMENT APPROVAL REQUEST FORM" 
        docNo="OF/DG/002" 
        issueNo="1" 
        pageInfo="Page 1 of 1"
      />

      <div className="form-body-container">
        {/* Debug info */}
        <div className="debug-info" style={{
          padding: '10px',
          marginBottom: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          borderLeft: '4px solid #17a2b8',
          fontSize: '12px'
        }}>
          <div>
            <strong>Backend Status:</strong> 
            <span style={{ 
              color: backendStatus.includes('✅') ? '#28a745' : '#dc3545',
              marginLeft: '8px',
              fontWeight: 'bold'
            }}>
              {backendStatus}
            </span>
          </div>
          {displayUrl && (
            <div style={{ marginTop: '5px', color: '#6c757d' }}>
              <strong>Server URL:</strong> {displayUrl}
            </div>
          )}
        </div>

        {/* Status Messaging */}
        {error && (
          <div className="form-error-message" style={{
            padding: '10px',
            margin: '10px 0',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            color: '#721c24'
          }}>
            ⚠️ {error}
          </div>
        )}
        
        {success && (
          <div className="form-success-message" style={{
            padding: '10px',
            margin: '10px 0',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            color: '#155724'
          }}>
            ✅ {editMode ? 'Request updated successfully!' : 'Request submitted successfully!'} 
            {backendStatus.includes('✅') ? ' (Sent to server)' : ' (Saved locally)'}
            <div style={{ fontSize: '12px', marginTop: '5px' }}>
              Redirecting in 2 seconds...
            </div>
          </div>
        )}

        {/* PART 1: REQUESTER */}
        <div className="part-section part-1">
          <div className="part-header">PART 1: TO BE COMPLETED BY THE REQUESTER</div>

          <div className="form-row-group" style={{padding: '10px', borderBottom: '1px solid black'}}>
            <p style={{margin: 0, fontSize: '14px', lineHeight: '1.4'}}>
              In accordance with the previous assignment dated 
              <input 
                type="text" 
                className="field-input" 
                style={{
                  width: '200px', 
                  marginLeft: '5px', 
                  borderBottom: '1px solid black',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  background: 'transparent',
                  outline: 'none'
                }}
                value={formState.assignmentDate} 
                onChange={handleChange} 
                name="assignmentDate" 
                placeholder="DD/MM/YYYY"
                disabled={loading}
              />
              , I am submitting the following documents for your approval.
            </p>
          </div>
          
          <table className="form-table numbered-fields-table" style={{border: 'none', margin: 0}}>
            <tbody>
              <tr>
                <td className="numbered-label" style={{width: '200px', borderLeft: 'none'}}>Document Title:</td>
                <td className="large-input-cell">
                  <input 
                    type="text" 
                    className="field-input large-input" 
                    value={formState.docTitle1} 
                    onChange={handleChange} 
                    name="docTitle1" 
                    disabled={loading}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="numbered-label" style={{width: '200px', borderLeft: 'none'}}>Document Number:</td>
                <td className="large-input-cell">
                  <input 
                    type="text" 
                    className="field-input large-input" 
                    value={formState.docNumber1} 
                    onChange={handleChange} 
                    name="docNumber1" 
                    disabled={loading}
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <table className="form-table numbered-fields-table">
            <tbody>
              <tr className="signature-row">
                <td colSpan="2"> 
                  <div className="signature-block" style={{justifyContent: 'flex-end'}}>
                    <div className="signature-field">
                      <span className="field-label">Name:</span>
                      <input 
                        type="text" 
                        className="signature-line" 
                        value={formState.requesterName} 
                        onChange={handleChange} 
                        name="requesterName" 
                        disabled={loading}
                        required
                      />
                    </div>
                    <div className="signature-field">
                      <span className="field-label">Signature:</span>
                      <input 
                        type="text" 
                        className="signature-line" 
                        value={formState.requesterSignature} 
                        onChange={handleChange} 
                        name="requesterSignature" 
                        disabled={loading}
                        placeholder="(Initials or electronic)"
                      />
                    </div>
                    <div className="signature-field">
                      <span className="field-label">Date:</span>
                      <input 
                        type="date" 
                        className="signature-line" 
                        value={formState.requesterDate} 
                        onChange={handleChange} 
                        name="requesterDate" 
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PART 2: APPROVER */}
        <div className="part-section part-2" style={{marginTop: '20px'}}>
          <div className="part-header">PART 2: TO BE COMPLETED BY AUTHORIZED APPROVER</div>
          
          <table className="form-table numbered-fields-table" style={{border: 'none', margin: 0}}>
            <tbody>
              <tr>
                <td 
                  className="numbered-label justification-field-label" 
                  style={{
                    borderLeft: 'none', 
                    verticalAlign: 'top', 
                    paddingTop: '15px', 
                    width: '250px'
                  }}
                >
                  Review and approval notes:
                </td>
                <td 
                  className="large-input-cell justification-field-cell" 
                  style={{borderRight: 'none'}}
                >
                  <textarea 
                    className="field-input large-input tall-input" 
                    value={formState.approvalNotes} 
                    onChange={handleChange} 
                    name="approvalNotes" 
                    disabled={loading}
                    rows={4}
                    placeholder="Enter review notes, comments, or approval remarks here..."
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{
            padding: '10px 10px 5px 10px', 
            fontSize: '14px', 
            borderBottom: '1px solid black',
            marginTop: '15px'
          }}>
            <p style={{fontWeight: 'bold', margin: '0 0 5px 0'}}>To: The Quality Representative:</p>
            <p style={{margin: 0}}>
              Please register and issue the aforementioned documents to the following function(s) / person(s):
            </p>
          </div>

          {/* Registration List Table */}
          <div style={{ margin: '15px 0' }}>
            <table className="form-table" style={{ margin: 0, border: 'none', width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: '50px', border: '1px solid black', padding: '5px' }}>S/N</th>
                  <th style={{ width: '150px', border: '1px solid black', padding: '5px' }}>Function</th>
                  <th style={{ width: '300px', border: '1px solid black', padding: '5px' }}>Document Title</th>
                  <th style={{ width: '200px', border: '1px solid black', padding: '5px' }}>Document No.</th>
                  <th style={{ width: '100px', border: '1px solid black', padding: '5px' }}>Copies</th>
                  <th style={{ width: '80px', border: '1px solid black', padding: '5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formState.registrationList.map((item, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: 'center', border: '1px solid black', padding: '5px' }}>
                      {item.sn}
                    </td>
                    <td style={{ border: '1px solid black', padding: 0 }}>
                      <input 
                        type="text" 
                        className="field-input large-input" 
                        style={{ border: 'none', width: '100%', padding: '5px' }}
                        value={item.function} 
                        onChange={(e) => handleListChange(index, 'function', e.target.value)}
                        disabled={loading}
                        placeholder="Department/Role"
                      />
                    </td>
                    <td style={{ border: '1px solid black', padding: 0 }}>
                      <input 
                        type="text" 
                        className="field-input large-input" 
                        style={{ border: 'none', width: '100%', padding: '5px' }}
                        value={item.docTitle} 
                        onChange={(e) => handleListChange(index, 'docTitle', e.target.value)}
                        disabled={loading}
                        placeholder="Document title"
                      />
                    </td>
                    <td style={{ border: '1px solid black', padding: 0 }}>
                      <input 
                        type="text" 
                        className="field-input large-input" 
                        style={{ border: 'none', width: '100%', padding: '5px' }}
                        value={item.docNo} 
                        onChange={(e) => handleListChange(index, 'docNo', e.target.value)}
                        disabled={loading}
                        placeholder="Document number"
                      />
                    </td>
                    <td style={{ border: '1px solid black', padding: 0 }}>
                      <input 
                        type="text" 
                        className="field-input large-input" 
                        style={{ border: 'none', width: '100%', padding: '5px' }}
                        value={item.copies} 
                        onChange={(e) => handleListChange(index, 'copies', e.target.value)}
                        disabled={loading}
                        placeholder="Number of copies"
                      />
                    </td>
                    <td style={{ border: '1px solid black', padding: '5px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => removeRegistrationRow(index)}
                        disabled={loading || formState.registrationList.length <= 1}
                        style={{
                          padding: '3px 8px',
                          fontSize: '12px',
                          backgroundColor: formState.registrationList.length <= 1 ? '#ccc' : '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: formState.registrationList.length <= 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Add Row Button */}
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={addRegistrationRow}
                disabled={loading}
                style={{
                  padding: '8px 15px',
                  fontSize: '14px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                + Add Another Row
              </button>
            </div>
          </div>
          
          <div style={{ height: '30px', borderTop: '1px solid black', marginTop: '20px' }}></div>
        </div>

        {/* Form Actions */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            style={{
              padding: '8px 15px',
              fontSize: '14px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Reset Form
          </button>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => {
                console.log('Form State:', formState);
                alert('Form data logged to console');
              }}
              disabled={loading}
              style={{
                padding: '8px 15px',
                fontSize: '14px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              Debug Data
            </button>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <FormFooter 
          onCancel={handleFooterCancel} 
          onSubmit={handleFooterSubmit} 
          isSubmitting={loading}
          submitText={editMode ? "Update Approval Request" : "Submit Approval Request"}
        />
      </div>
    </div>
  );
};

export default Form02_Approval;