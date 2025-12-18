import React, { useState, useEffect, useCallback } from 'react';
import DocumentHeader from '../../DocumentHeader/DocumentHeader';
import FormFooter from '../../DocumentHeader/FormFooter';
import './Form.css'; 

const Form01 = ({ onBack, user, editMode, existingData, duplicateData, requestId, backendUrl }) => {
  const [formState, setFormState] = useState({
    instructionMarked: false, 
    newDoc: false,
    docChange: false,
    externalDoc: false,
    docTitle: '',
    docNo: '',
    issueNoIndicate: '',
    affectedProcesses: '',
    processOwner: '',
    justification: '',
    enclosure: '',
    requesterName: '',
    requesterDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [cleanBackendUrl, setCleanBackendUrl] = useState('');
  const [debugLogs, setDebugLogs] = useState([]);
  const formId = 'form-01';

  // Add debug logging function
  const addDebugLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const log = { timestamp, message, type };
    setDebugLogs(prev => [log, ...prev.slice(0, 19)]); // Keep last 20 logs
    console.log(`[${timestamp}] ${message}`);
  };

  // Check if backend is available on mount
  useEffect(() => {
    const checkBackend = async () => {
      if (!backendUrl) {
        addDebugLog('❌ No backend URL provided', 'error');
        setBackendStatus('No backend URL provided');
        return;
      }

      // Try multiple URL formats
      let urlToUse = backendUrl.trim();
      addDebugLog(`🔗 Original URL: ${urlToUse}`, 'info');
      
      // Remove trailing slash
      urlToUse = urlToUse.replace(/\/$/, '');
      
      // Try to find the correct base URL
      const possibleBaseUrls = [];
      
      if (urlToUse.endsWith('/api')) {
        possibleBaseUrls.push(urlToUse.slice(0, -4)); // Remove '/api'
      }
      
      possibleBaseUrls.push(urlToUse); // Use as-is
      possibleBaseUrls.push(urlToUse.replace(/\/api$/, '')); // Remove /api if exists
      
      addDebugLog(`🔄 Trying base URLs: ${possibleBaseUrls.join(', ')}`, 'info');

      for (const baseUrl of possibleBaseUrls) {
        addDebugLog(`🔍 Testing: ${baseUrl}`, 'info');
        
        // Try multiple health endpoints
        const endpoints = [
          `${baseUrl}/api/health`,
          `${baseUrl}/health`,
          `${baseUrl}/api`,
          `${baseUrl}/`
        ];

        for (const endpoint of endpoints) {
          try {
            addDebugLog(`📡 Checking: ${endpoint}`, 'info');
            const response = await fetch(endpoint, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              mode: 'cors',
              cache: 'no-cache'
            });
            
            if (response.ok || response.status === 200) {
              const data = await response.json().catch(() => ({}));
              addDebugLog(`✅ Backend found at: ${baseUrl}`, 'success');
              setCleanBackendUrl(baseUrl);
              setBackendStatus('Connected ✅');
              return;
            }
          } catch (err) {
            addDebugLog(`❌ Failed ${endpoint}: ${err.message}`, 'warning');
          }
        }
      }

      addDebugLog('❌ Could not connect to any backend endpoint', 'error');
      setBackendStatus('Not connected ❌');
    };
    
    checkBackend();
  }, [backendUrl]);

  useEffect(() => {
    if (editMode && existingData) {
      setFormState(existingData);
      addDebugLog('📝 Loaded existing data for editing', 'info');
    } else if (duplicateData) {
      setFormState(duplicateData);
      addDebugLog('📋 Loaded data for duplication', 'info');
    } else if (user) {
      setFormState(prev => ({
        ...prev,
        requesterName: user.name || '',
        requesterDate: new Date().toISOString().split('T')[0]
      }));
      addDebugLog('👤 User data loaded', 'info');
    }
  }, [editMode, existingData, duplicateData, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Enhanced Submit function
  const handleSubmit = async (e) => {
    addDebugLog('=== FORM SUBMISSION STARTED ===', 'info');
    
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    // Enhanced Validation
    const validationErrors = [];
    
    if (!formState.requesterName?.trim()) {
      validationErrors.push('Please enter your name');
    }
    
    if (!formState.requesterDate) {
      validationErrors.push('Please select a date');
    }
    
    if (!formState.newDoc && !formState.docChange && !formState.externalDoc) {
      validationErrors.push('Please select at least one request type');
    }
    
    if (validationErrors.length > 0) {
      const errorMsg = validationErrors.join('. ');
      setError(errorMsg);
      addDebugLog(`❌ Validation failed: ${errorMsg}`, 'error');
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      addDebugLog('📤 Form data prepared', 'info');
      console.log('Form data:', formData);

      // Determine which URL to use
      const urlToUse = cleanBackendUrl || backendUrl;
      
      if (urlToUse && (backendStatus.includes('Connected') || backendStatus.includes('Checking'))) {
        addDebugLog(`🌐 Attempting backend submission to: ${urlToUse}`, 'info');
        
        try {
          // Try multiple endpoints
          const endpoints = [
            `${urlToUse}/api/requests`,
            `${urlToUse}/requests`,
            `${urlToUse}/api/form-submit`,
            `${urlToUse}/form-submit`
          ];

          let submissionSuccess = false;
          
          for (const endpoint of endpoints) {
            try {
              addDebugLog(`📡 POST to: ${endpoint}`, 'info');
              
              const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify(formData)
              });

              addDebugLog(`📨 Response: ${response.status} ${response.statusText}`, 
                response.ok ? 'success' : 'warning');

              if (response.ok) {
                const result = await response.json();
                addDebugLog('✅ Backend submission successful', 'success');
                console.log('Backend result:', result);
                
                // Save to localStorage as backup
                await saveToLocalStorage(formData, true);
                
                setSuccess(true);
                setTimeout(() => {
                  if (onBack) onBack();
                }, 2000);
                
                submissionSuccess = true;
                break;
              } else {
                const errorText = await response.text().catch(() => 'No error text');
                addDebugLog(`⚠️ Endpoint failed: ${response.status} - ${errorText}`, 'warning');
              }
            } catch (endpointError) {
              addDebugLog(`❌ Endpoint error: ${endpointError.message}`, 'warning');
            }
          }
          
          if (submissionSuccess) return;
          
          addDebugLog('⚠️ All backend endpoints failed, using localStorage', 'warning');
          
        } catch (backendError) {
          addDebugLog(`❌ Backend submission error: ${backendError.message}`, 'error');
        }
      }

      // Fallback to localStorage only
      addDebugLog('💾 Using localStorage fallback only', 'info');
      await saveToLocalStorage(formData, false);
      
      setSuccess(true);
      setTimeout(() => {
        if (onBack) onBack();
      }, 2000);
      
    } catch (err) {
      addDebugLog(`❌ Critical error: ${err.message}`, 'error');
      console.error('Submit error:', err);
      setError(`Failed to save: ${err.message}. Please try again or contact support.`);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced localStorage save function
  const saveToLocalStorage = async (formData, fromBackend = false) => {
    addDebugLog(`💾 Saving to localStorage ${fromBackend ? '(backup)' : '(primary)'}`, 'info');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newRequest = {
      ...formData,
      _id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      savedLocally: !fromBackend,
      savedFromBackend: fromBackend,
      formName: 'Document Creation Form',
      formNumber: 'OF/DG/001',
      syncStatus: fromBackend ? 'synced' : 'pending'
    };
    
    // Save to localStorage
    const storageKey = 'form-requests';
    const existingRequests = JSON.parse(localStorage.getItem(storageKey) || '[]');
    existingRequests.push(newRequest);
    localStorage.setItem(storageKey, JSON.stringify(existingRequests));
    
    // Also save to session storage for immediate access
    sessionStorage.setItem('last-submitted-form', JSON.stringify(newRequest));
    
    addDebugLog(`💾 Saved to localStorage. Total: ${existingRequests.length}`, 'success');
    console.log('Saved request:', newRequest);
    
    return newRequest;
  };

  // Test backend connection
  const testBackendConnection = async () => {
    addDebugLog('🧪 Testing backend connection...', 'info');
    
    const urlToUse = cleanBackendUrl || backendUrl;
    
    if (!urlToUse) {
      alert('No backend URL available');
      return;
    }
    
    const endpoints = [
      `${urlToUse}/api/health`,
      `${urlToUse}/health`,
      `${urlToUse}/api`,
      `${urlToUse}/`
    ];

    let foundEndpoint = null;
    
    for (const endpoint of endpoints) {
      try {
        addDebugLog(`🔍 Testing: ${endpoint}`, 'info');
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          mode: 'cors'
        });
        
        if (response.ok) {
          const data = await response.json().catch(() => ({}));
          foundEndpoint = endpoint;
          addDebugLog(`✅ Working endpoint: ${endpoint}`, 'success');
          
          alert(`✅ Backend is working!\n\nEndpoint: ${endpoint}\nStatus: ${response.status}\nServer: ${data.server || 'Unknown'}\nRequests: ${data.requestCount || 'N/A'}`);
          break;
        }
      } catch (err) {
        addDebugLog(`❌ Failed: ${endpoint}`, 'warning');
      }
    }
    
    if (!foundEndpoint) {
      alert(`❌ Cannot connect to backend at ${urlToUse}\n\nTried endpoints:\n${endpoints.join('\n')}`);
    }
  };

  // Test form submission
  const testFormSubmission = async () => {
    addDebugLog('🧪 Testing form submission...', 'info');
    
    const urlToUse = cleanBackendUrl || backendUrl;
    
    if (!urlToUse) {
      alert('No backend URL available');
      return;
    }
    
    const testData = {
      formId: 'test-form',
      formData: { 
        test: 'data',
        timestamp: new Date().toISOString()
      },
      submittedBy: 'tester',
      submitterName: 'Test User',
      submitterEmail: 'test@example.com',
      department: 'Testing',
      status: 'pending'
    };
    
    const endpoints = [
      `${urlToUse}/api/requests`,
      `${urlToUse}/requests`
    ];
    
    for (const endpoint of endpoints) {
      try {
        addDebugLog(`📡 Testing POST to: ${endpoint}`, 'info');
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData)
        });
        
        addDebugLog(`📨 Response: ${response.status}`, 
          response.ok ? 'success' : 'warning');
        
        if (response.ok) {
          const result = await response.json();
          alert(`✅ Test successful!\n\nEndpoint: ${endpoint}\nStatus: ${response.status}\nID: ${result.data?._id || 'N/A'}\nMessage: ${result.message}`);
          return;
        } else {
          const errorText = await response.text();
          alert(`❌ Test failed: ${response.status}\n\nEndpoint: ${endpoint}\nError: ${errorText}`);
        }
      } catch (err) {
        addDebugLog(`❌ Connection failed: ${endpoint} - ${err.message}`, 'error');
      }
    }
    
    alert(`❌ All test endpoints failed for ${urlToUse}`);
  };

  // Wrapper functions for FormFooter
  const handleFooterSubmit = (e) => {
    addDebugLog('🖱️ Submit button clicked', 'info');
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
    addDebugLog('❌ Form cancelled', 'info');
    if (onBack) onBack();
  };

  // Get the display URL (clean version)
  const displayUrl = cleanBackendUrl || (backendUrl?.endsWith('/api') ? backendUrl.slice(0, -4) : backendUrl);

  // Clear debug logs
  const clearDebugLogs = () => {
    setDebugLogs([]);
    addDebugLog('🧹 Debug logs cleared', 'info');
  };

  // Export debug logs
  const exportDebugLogs = () => {
    const logsText = debugLogs.map(log => 
      `[${log.timestamp}] ${log.type.toUpperCase()}: ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addDebugLog('📥 Debug logs exported', 'info');
  };

  // Check localStorage
  const checkLocalStorage = () => {
    const requests = JSON.parse(localStorage.getItem('form-requests') || '[]');
    alert(`LocalStorage contains ${requests.length} saved forms\n\nLast 3 forms:\n${requests.slice(-3).map(r => `• ${r.formName} (${new Date(r.createdAt).toLocaleString()})`).join('\n')}`);
    addDebugLog(`📊 LocalStorage check: ${requests.length} forms`, 'info');
  };

  return (
    <div className="document-container">
      <DocumentHeader 
        docTitle="DOCUMENT CREATION FORM" 
        docNo="OF/DG/001" 
        issueNo="1" 
        pageInfo="Page 1 of 1"
      />

      <div className="form-body-container">
        {/* Enhanced Debug info */}
        <div className="debug-info" style={{
          padding: '10px',
          marginBottom: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          borderLeft: '4px solid #17a2b8',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Backend Status:</strong> 
              <span style={{ 
                color: backendStatus.includes('✅') ? '#28a745' : 
                       backendStatus.includes('Error') ? '#dc3545' : 
                       '#ffc107',
                marginLeft: '8px',
                fontWeight: 'bold'
              }}>
                {backendStatus}
              </span>
            </div>
            <div style={{ fontSize: '10px', color: '#6c757d' }}>
              Logs: {debugLogs.length}
            </div>
          </div>
          
          {displayUrl && (
            <div style={{ marginTop: '5px', color: '#6c757d' }}>
              <strong>Server URL:</strong> {displayUrl}
            </div>
          )}
          
          {backendUrl && backendUrl !== displayUrl && (
            <div style={{ marginTop: '5px', color: '#856404', backgroundColor: '#fff3cd', padding: '5px', borderRadius: '3px' }}>
              ⚠️ <strong>Note:</strong> URL corrected from "{backendUrl}" to "{displayUrl}"
            </div>
          )}
        </div>

        {/* Error/Success Messages */}
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

        {/* Form Content */}
        <div className="part-section part-1">
          <div className="part-header">PART 1: TO BE COMPLETED BY THE REQUESTER</div>

          <div className="form-row-group">
              <p>
                Please identify the type of request by 
                <span className="instruction-checkbox-wrapper"> 
                    <input 
                        type="checkbox" 
                        className="checkbox-box instruction-marker" 
                        checked={formState.instructionMarked} 
                        onChange={handleChange} 
                        name="instructionMarked" 
                        disabled={loading}
                    />
                </span> Mark
              </p>
              <div className="checkbox-group">
                  <span className="checkbox-item">New document: 
                    <input type="checkbox" className="checkbox-box" checked={formState.newDoc} onChange={handleChange} name="newDoc" disabled={loading} />
                  </span>
                  <span className="checkbox-item">Document Change: 
                    <input type="checkbox" className="checkbox-box" checked={formState.docChange} onChange={handleChange} name="docChange" disabled={loading} />
                  </span>
                  <span className="checkbox-item">External document: 
                    <input type="checkbox" className="checkbox-box" checked={formState.externalDoc} onChange={handleChange} name="externalDoc" disabled={loading} />
                  </span>
              </div>
          </div>

          <table className="form-section-boxed form-table">
            <tbody>
              <tr>
                <td className="multi-line-title" rowSpan="2">For document <br/>Change <br/>Indicate:</td>
                <td className="field-label doc-title-label">Doc. Title:</td>
                <td className="field-label doc-no-label">Doc. No.:</td>
                <td className="field-label issue-no-label" style={{borderRight: 'none'}}>Issue No.:</td>
              </tr>
              <tr>
                <td className="field-input-cell"><input type="text" className="field-input" value={formState.docTitle} onChange={handleChange} name="docTitle" disabled={loading} /></td>
                <td className="field-input-cell"><input type="text" className="field-input" value={formState.docNo} onChange={handleChange} name="docNo" disabled={loading} /></td>
                <td className="field-input-cell" style={{borderRight: 'none'}}><input type="text" className="field-input" value={formState.issueNoIndicate} onChange={handleChange} name="issueNoIndicate" disabled={loading} /></td>
              </tr>
            </tbody>
          </table>
          
          <table className="form-table numbered-fields-table">
            <tbody>
              <tr>
                <td className="numbered-label">1. Affected Process(es):</td>
                <td className="large-input-cell"><input type="text" className="field-input large-input" value={formState.affectedProcesses} onChange={handleChange} name="affectedProcesses" disabled={loading} /></td>
              </tr>
              <tr>
                <td className="numbered-label">2. Process owner:</td>
                <td className="large-input-cell"><input type="text" className="field-input large-input" value={formState.processOwner} onChange={handleChange} name="processOwner" disabled={loading} /></td>
              </tr>
              <tr>
                <td className="numbered-label justification-field-label" style={{verticalAlign: 'top', paddingTop: '15px'}}>3. Justification for the request:</td>
                <td className="large-input-cell justification-field-cell"><textarea className="field-input large-input tall-input" value={formState.justification} onChange={handleChange} name="justification" disabled={loading} /></td>
              </tr>
              <tr>
                <td className="numbered-label">4. Enclosure (Title and No. of pages):</td>
                <td className="large-input-cell" style={{borderBottom: 'none'}}><input type="text" className="field-input large-input" value={formState.enclosure} onChange={handleChange} name="enclosure" disabled={loading} /></td>
              </tr>
              <tr className="signature-row">
                  <td colSpan="2">
                      <div className="signature-block">
                          <div className="signature-field">
                              <span className="field-label">Name:</span>
                              <input type="text" className="signature-line" value={formState.requesterName} onChange={handleChange} name="requesterName" disabled={loading} />
                          </div>
                          <div className="signature-field">
                              <span className="field-label">Date:</span>
                              <input type="date" className="signature-line" value={formState.requesterDate} onChange={handleChange} name="requesterDate" disabled={loading} />
                          </div>
                      </div>
                  </td>
              </tr>
            </tbody>
          </table>
        </div>

        <FormFooter 
            onCancel={handleFooterCancel} 
            onSubmit={handleFooterSubmit} 
            isSubmitting={loading}
            submitText={editMode ? "Update Request" : "Submit Request"}
        />
        
        {/* Enhanced Test buttons for debugging */}
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #dee2e6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <strong style={{ fontSize: '14px' }}>Debug Tools</strong>
            <div>
              <button
                onClick={clearDebugLogs}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  marginRight: '5px'
                }}
              >
                Clear Logs
              </button>
              <button
                onClick={exportDebugLogs}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Export Logs
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={testBackendConnection}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Test Connection
            </button>
            
            <button
              type="button"
              onClick={testFormSubmission}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Test Submit
            </button>
            
            <button
              type="button"
              onClick={checkLocalStorage}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Check Storage
            </button>
            
            <button
              type="button"
              onClick={() => {
                const info = `Form ID: ${formId}\nBackend: ${backendStatus}\nURL: ${displayUrl}\nUser: ${user?.name || 'Unknown'}\nMode: ${editMode ? 'Edit' : duplicateData ? 'Duplicate' : 'New'}`;
                alert(info);
                addDebugLog('ℹ️ Debug info displayed', 'info');
              }}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Debug Info
            </button>
            
            <button
              type="button"
              onClick={() => {
                const formInfo = JSON.stringify(formState, null, 2);
                console.log('Form State:', formState);
                alert('Form state logged to console');
                addDebugLog('📋 Form state dumped to console', 'info');
              }}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor: '#ffc107',
                color: '#212529',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Dump Form Data
            </button>
          </div>
          
          {/* Debug Logs Display */}
          {debugLogs.length > 0 && (
            <div style={{ 
              marginTop: '15px', 
              maxHeight: '200px', 
              overflowY: 'auto',
              fontSize: '11px',
              fontFamily: 'monospace',
              backgroundColor: '#212529',
              color: '#f8f9fa',
              padding: '10px',
              borderRadius: '4px'
            }}>
              <div style={{ marginBottom: '5px', color: '#adb5bd' }}>
                Recent Logs (newest first):
              </div>
              {debugLogs.map((log, index) => (
                <div 
                  key={index}
                  style={{
                    padding: '2px 0',
                    borderBottom: '1px solid #495057',
                    color: log.type === 'error' ? '#ff6b6b' :
                           log.type === 'success' ? '#51cf66' :
                           log.type === 'warning' ? '#ffd43b' :
                           '#f8f9fa'
                  }}
                >
                  [{log.timestamp}] {log.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form01;