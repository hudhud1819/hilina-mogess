import React, { useState, useEffect } from 'react';
import DocumentHeader from '../../DocumentHeader/DocumentHeader';
import FormFooter from '../../DocumentHeader/FormFooter'; 
import './Form09.css';

const RiskAssessmentForm = ({ onBack, user, editMode, existingData, duplicateData, requestId, backendUrl }) => {
  // Initial form state
  const [formState, setFormState] = useState({
    // Page 1
    directorateService: '',
    assessmentNo: '',
    assessmentDate: '',
    reviewDate: '',
    
    // Page 2
    riskAreaDescription: '',
    
    // Page 3
    riskAssessmentTeam: '',
    consultants: '',
    physicalEnvironmentRisks: '',
    ergonomicRisks: '',
    psychologicalRisks: '',
    
    // Page 4 - Dynamic identified risks
    identifiedRisks: [
      { id: 1, description: '' },
      { id: 2, description: '' },
      { id: 3, description: '' }
    ],
    
    // Page 5
    specificCircumstances: '',
    regulations: Array(8).fill(''),
    
    // Page 6 - Controls
    eliminationControl: false,
    substitutionControl: false,
    isolationControl: false,
    engineeringControl: false,
    administrationControl: false,
    ppeControl: false,
    
    // Page 7 - Dynamic risk assessments
    riskAssessments: [
      { 
        id: 1, 
        risk: '',
        consequence: '',
        likelihood: '',
        rating: '',
        requiredYes: false,
        requiredNo: false,
        implementedYes: false,
        implementedNo: false,
        controlMethod: ''
      },
      { 
        id: 2, 
        risk: '',
        consequence: '',
        likelihood: '',
        rating: '',
        requiredYes: false,
        requiredNo: false,
        implementedYes: false,
        implementedNo: false,
        controlMethod: ''
      }
    ],
    
    // Page 8 - Dynamic implementation plan
    implementationPlan: [
      { 
        id: 1, 
        controlOption: '',
        resources: '',
        responsiblePerson: '',
        implementationDate: ''
      }
    ],
    
    // Page 12 - Dynamic team signatures
    teamSignatures: [
      { id: 1, name: '', signature: '', date: '' }
    ],
    
    // Common
    submittedBy: user?.name || '',
    submissionDate: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 13;

  // Initialize form data
  useEffect(() => {
    if (editMode && existingData) {
      setFormState(existingData);
    } else if (duplicateData) {
      setFormState(duplicateData);
    } else if (user) {
      setFormState(prev => ({
        ...prev,
        submittedBy: user.name || '',
        submissionDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [editMode, existingData, duplicateData, user]);

  // Universal change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, index, child] = name.split('.');
      
      if (child) {
        setFormState(prev => ({
          ...prev,
          [parent]: prev[parent].map((item, i) => 
            i === parseInt(index) ? { ...item, [child]: type === 'checkbox' ? checked : value } : item
          )
        }));
      } else {
        setFormState(prev => ({
          ...prev,
          [parent]: prev[parent].map((item, i) => 
            i === parseInt(index) ? value : item
          )
        }));
      }
    } else {
      setFormState(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle array field changes
  const handleArrayChange = (arrayName, index, field, value) => {
    setFormState(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // =========================================================================
  // ADD ROW FUNCTIONALITY
  // =========================================================================

  // Add a new identified risk row
  const addIdentifiedRiskRow = () => {
    const newId = Math.max(...formState.identifiedRisks.map(r => r.id), 0) + 1;
    setFormState(prev => ({
      ...prev,
      identifiedRisks: [
        ...prev.identifiedRisks,
        { id: newId, description: '' }
      ]
    }));
  };

  // Remove an identified risk row
  const removeIdentifiedRiskRow = (index) => {
    if (formState.identifiedRisks.length > 1) {
      setFormState(prev => ({
        ...prev,
        identifiedRisks: prev.identifiedRisks.filter((_, i) => i !== index)
      }));
    }
  };

  // Add a new risk assessment row
  const addRiskAssessmentRow = () => {
    const newId = Math.max(...formState.riskAssessments.map(r => r.id), 0) + 1;
    setFormState(prev => ({
      ...prev,
      riskAssessments: [
        ...prev.riskAssessments,
        { 
          id: newId, 
          risk: '',
          consequence: '',
          likelihood: '',
          rating: '',
          requiredYes: false,
          requiredNo: false,
          implementedYes: false,
          implementedNo: false,
          controlMethod: ''
        }
      ]
    }));
  };

  // Remove a risk assessment row
  const removeRiskAssessmentRow = (index) => {
    if (formState.riskAssessments.length > 1) {
      setFormState(prev => ({
        ...prev,
        riskAssessments: prev.riskAssessments.filter((_, i) => i !== index)
      }));
    }
  };

  // Add a new implementation plan row
  const addImplementationPlanRow = () => {
    const newId = Math.max(...formState.implementationPlan.map(r => r.id), 0) + 1;
    setFormState(prev => ({
      ...prev,
      implementationPlan: [
        ...prev.implementationPlan,
        { 
          id: newId, 
          controlOption: '',
          resources: '',
          responsiblePerson: '',
          implementationDate: ''
        }
      ]
    }));
  };

  // Remove an implementation plan row
  const removeImplementationPlanRow = (index) => {
    if (formState.implementationPlan.length > 1) {
      setFormState(prev => ({
        ...prev,
        implementationPlan: prev.implementationPlan.filter((_, i) => i !== index)
      }));
    }
  };

  // Add a new team signature row
  const addTeamSignatureRow = () => {
    const newId = Math.max(...formState.teamSignatures.map(r => r.id), 0) + 1;
    setFormState(prev => ({
      ...prev,
      teamSignatures: [
        ...prev.teamSignatures,
        { id: newId, name: '', signature: '', date: '' }
      ]
    }));
  };

  // Remove a team signature row
  const removeTeamSignatureRow = (index) => {
    if (formState.teamSignatures.length > 1) {
      setFormState(prev => ({
        ...prev,
        teamSignatures: prev.teamSignatures.filter((_, i) => i !== index)
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!formState.directorateService || !formState.assessmentNo || !formState.assessmentDate) {
      setError('Please fill in all required fields on Page 1.');
      setLoading(false);
      setCurrentPage(1);
      return;
    }
    
    if (!formState.riskAreaDescription) {
      setError('Please describe the risk area on Page 2.');
      setLoading(false);
      setCurrentPage(2);
      return;
    }

    try {
      console.log('Submitting form data:', formState);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setTimeout(() => {
        if (onBack && typeof onBack === 'function') {
          onBack();
        }
      }, 2000);
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      if (onBack && typeof onBack === 'function') {
        onBack();
      } else {
        window.history.back();
      }
    }
  };

  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Render current page content
  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="form09-part-section">
            
            {/* HEADER STRUCTURE WITH TWO ROWS */}
            <div className="form09-header-container">
              {/* First row: Directorate or Service (full width) */}
              <div className="form09-header-row form09-full-width">
                <div className="form09-header-label">Directorate or Service:</div>
                <div className="form09-header-value">
                  <input 
                    type="text" 
                    value={formState.directorateService}
                    onChange={handleChange}
                    name="directorateService"
                    disabled={loading}
                    className="form09-header-input"
                    placeholder="Enter directorate/service"
                  />
                </div>
              </div>
              
              {/* Second row: Three fields side by side */}
              <div className="form09-header-row form09-three-columns">
                {/* Assessment No */}
                <div className="form09-header-column">
                  <div className="form09-header-label">Assessment No:</div>
                  <div className="form09-header-value">
                    <input 
                      type="text" 
                      value={formState.assessmentNo}
                      onChange={handleChange}
                      name="assessmentNo"
                      disabled={loading}
                      className="form09-header-input"
                      placeholder="Enter assessment number"
                    />
                  </div>
                </div>
                
                {/* Assessment Date */}
                <div className="form09-header-column">
                  <div className="form09-header-label">Assessment Date:</div>
                  <div className="form09-header-value">
                    <input 
                      type="date" 
                      value={formState.assessmentDate}
                      onChange={handleChange}
                      name="assessmentDate"
                      disabled={loading}
                      className="form09-header-input"
                    />
                  </div>
                </div>
                
                {/* Review Date */}
                <div className="form09-header-column">
                  <div className="form09-header-label">Review Date:</div>
                  <div className="form09-header-value">
                    <input 
                      type="date" 
                      value={formState.reviewDate}
                      onChange={handleChange}
                      name="reviewDate"
                      disabled={loading}
                      className="form09-header-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form09-part-section">
            <div className="form09-step-section">
              <label>What is the risk area being assessed? Describe the item, job, process, work arrangement, etc.: *</label>
              <textarea 
                rows="8" 
                value={formState.riskAreaDescription}
                onChange={handleChange}
                name="riskAreaDescription"
                disabled={loading}
                placeholder="Describe the risk area..."
                className="form09-textarea"
              />
            </div>
            <div className="form09-step-section">
              <h2>Step - 1: Form Risk Assessment team</h2>
              <p>Decide who else should be consulted.</p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form09-part-section">
            
            <div className="form09-form-row-group">
              <label>Risk Assessment team:</label>
              <textarea 
                rows="4" 
                value={formState.riskAssessmentTeam}
                onChange={handleChange}
                name="riskAssessmentTeam"
                disabled={loading}
                placeholder="List team members..."
                className="form09-textarea"
              />
            </div>

            <div className="form09-form-row-group">
              <label>Name of Consultants:</label>
              <textarea 
                rows="4" 
                value={formState.consultants}
                onChange={handleChange}
                name="consultants"
                disabled={loading}
                placeholder="List consultants..."
                className="form09-textarea"
              />
            </div>

            <div className="form09-step-section">
              <h2>Step - 2: Identify the risk associated with the subject or situation being assessed</h2>
              <p>The following table categories the risk areas:</p>
              <table className="form09-category-table">
                <thead>
                  <tr>
                    <th>Physical Work Environment</th>
                    <th>Ergonomic</th>
                    <th>Psychological environment and management</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <textarea 
                        rows="6" 
                        value={formState.physicalEnvironmentRisks}
                        onChange={handleChange}
                        name="physicalEnvironmentRisks"
                        disabled={loading}
                        placeholder="Describe physical risks..."
                        className="form09-textarea"
                      />
                    </td>
                    <td>
                      <textarea 
                        rows="6" 
                        value={formState.ergonomicRisks}
                        onChange={handleChange}
                        name="ergonomicRisks"
                        disabled={loading}
                        placeholder="Describe ergonomic risks..."
                        className="form09-textarea"
                      />
                    </td>
                    <td>
                      <textarea 
                        rows="6" 
                        value={formState.psychologicalRisks}
                        onChange={handleChange}
                        name="psychologicalRisks"
                        disabled={loading}
                        placeholder="Describe psychological risks..."
                        className="form09-textarea"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form09-part-section">
            
            <div className="form09-step-section">
              <h2>Health and Security / Equipment / Other</h2>
              <table className="form09-category-table">
                <thead>
                  <tr>
                    <th>Health and Security</th>
                    <th>Equipment</th>
                    <th>Other</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <textarea 
                        rows="8" 
                        value={formState.healthSecurityRisks}
                        onChange={handleChange}
                        name="healthSecurityRisks"
                        disabled={loading}
                        placeholder="Health and security risks..."
                        className="form09-textarea"
                      />
                    </td>
                    <td>
                      <textarea 
                        rows="8" 
                        value={formState.equipmentRisks}
                        onChange={handleChange}
                        name="equipmentRisks"
                        disabled={loading}
                        placeholder="Equipment risks..."
                        className="form09-textarea"
                      />
                    </td>
                    <td>
                      <textarea 
                        rows="8" 
                        value={formState.otherRisks}
                        onChange={handleChange}
                        name="otherRisks"
                        disabled={loading}
                        placeholder="Other risks..."
                        className="form09-textarea"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>List the risks identified from the above:</h2>
            <div className="form09-dynamic-list-section">
              <ol className="form09-risk-list">
                {formState.identifiedRisks.map((risk, index) => (
                  <li key={risk.id} className="form09-dynamic-row">
                    <div className="form09-row-number">{index + 1}.</div>
                    <input 
                      type="text" 
                      value={risk.description}
                      onChange={(e) => handleArrayChange('identifiedRisks', index, 'description', e.target.value)}
                      disabled={loading}
                      placeholder={`Describe risk ${index + 1}...`}
                      className="form09-risk-input"
                    />
                    {formState.identifiedRisks.length > 1 && (
                      <button 
                        type="button" 
                        className="form09-remove-row-btn"
                        onClick={() => removeIdentifiedRiskRow(index)}
                        disabled={loading}
                        title="Remove this risk"
                      >
                        ×
                      </button>
                    )}
                  </li>
                ))}
              </ol>
              <button 
                type="button" 
                className="form09-add-plus-btn"
                onClick={addIdentifiedRiskRow}
                disabled={loading}
                title="Add another risk"
              >
                +
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="form09-part-section">
            
            <div className="form09-step-section">
              <label>Any specific circumstances (describe):</label>
              <textarea 
                rows="6" 
                value={formState.specificCircumstances}
                onChange={handleChange}
                name="specificCircumstances"
                disabled={loading}
                placeholder="Describe specific circumstances..."
                className="form09-textarea"
              />
            </div>

            <div className="form09-step-section">
              <h2>Any relevant regulation, code, standard or guideline (list):</h2>
              <div className="form09-step-section">
              <label>Any specific circumstances (describe):</label>
              <textarea 
                rows="6" 
                value={formState.specificCircumstances}
                onChange={handleChange}
                name="specificCircumstances"
                disabled={loading}
                placeholder="Describe specific circumstances..."
                className="form09-textarea"
              />
            </div>
            </div>

            <div className="form09-step-section">
              <h2>Step 3 - Risk Assessment</h2>
              <p>For each identified risk, rate the risk using the Risk Rating Matrix</p>
              <p>(Refer to pages 9-11 for rating tables)</p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="form09-part-section">
            
            <div className="form09-step-section">
              <h2>Step 4 - Risk Controls</h2>
              <p>Detail controls measures required to address the risks applying the Hierarchy of Controls</p>
              <p>Controls to be considered from the following hierarchy of control:</p>
              <div className="form09-controls-hierarchy">
                <div className="form09-control-item">
                  <input 
                    type="checkbox" 
                    checked={formState.eliminationControl}
                    onChange={handleChange}
                    name="eliminationControl"
                    disabled={loading}
                    className="form09-control-checkbox"
                  /> 
                  <strong>1. Elimination</strong> (is it necessary?)
                </div>
                <div className="form09-control-item">
                  <input 
                    type="checkbox" 
                    checked={formState.substitutionControl}
                    onChange={handleChange}
                    name="substitutionControl"
                    disabled={loading}
                    className="form09-control-checkbox"
                  /> 
                  <strong>2. Substitution</strong>
                </div>
                <div className="form09-control-item">
                  <input 
                    type="checkbox" 
                    checked={formState.isolationControl}
                    onChange={handleChange}
                    name="isolationControl"
                    disabled={loading}
                    className="form09-control-checkbox"
                  /> 
                  <strong>3. Isolation</strong> (restrict access)
                </div>
                <div className="form09-control-item">
                  <input 
                    type="checkbox" 
                    checked={formState.engineeringControl}
                    onChange={handleChange}
                    name="engineeringControl"
                    disabled={loading}
                    className="form09-control-checkbox"
                  /> 
                  <strong>4. Engineering</strong> (guarding, redesign)
                </div>
                <div className="form09-control-item">
                  <input 
                    type="checkbox" 
                    checked={formState.administrationControl}
                    onChange={handleChange}
                    name="administrationControl"
                    disabled={loading}
                    className="form09-control-checkbox"
                  /> 
                  <strong>5. Administration</strong> (training, SOPs)
                </div>
                <div className="form09-control-item">
                  <input 
                    type="checkbox" 
                    checked={formState.ppeControl}
                    onChange={handleChange}
                    name="ppeControl"
                    disabled={loading}
                    className="form09-control-checkbox"
                  /> 
                  <strong>6. Personal Protective Equipment (PPE)</strong> (eg gloves, leather apron, coveralls, respirator)
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="form09-part-section">
            
            <h2>Risk Assessment Summary Table</h2>
            <div className="form09-dynamic-table-section">
              <table className="form09-risk-summary-table">
                <thead>
                  <tr>
                    <th rowSpan="2">Identified Risks</th>
                    <th colSpan="2">Risk assessment</th>
                    <th rowSpan="2">Risk Rating</th>
                    <th colSpan="2">Required Controls</th>
                    <th colSpan="2">Controls implemented</th>
                    <th rowSpan="2">Actions</th>
                  </tr>
                  <tr>
                    <th>Consequences</th>
                    <th>Likelihood</th>
                    <th>Yes</th>
                    <th>No</th>
                    <th>Yes</th>
                    <th>No</th>
                  </tr>
                </thead>
                <tbody>
                  {formState.riskAssessments.map((assessment, index) => (
                    <tr key={assessment.id}>
                      <td>
                        <input 
                          type="text" 
                          value={assessment.risk}
                          onChange={(e) => handleArrayChange('riskAssessments', index, 'risk', e.target.value)}
                          disabled={loading}
                          placeholder={`Risk ${index + 1}`}
                          className="form09-table-input"
                        />
                      </td>
                      <td>
                        <select 
                          value={assessment.consequence}
                          onChange={(e) => handleArrayChange('riskAssessments', index, 'consequence', e.target.value)}
                          disabled={loading}
                          className="form09-table-select"
                        >
                          <option value="">Select</option>
                          <option value="Critical">Critical</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                          <option value="Negligible">Negligible</option>
                        </select>
                      </td>
                      <td>
                        <select 
                          value={assessment.likelihood}
                          onChange={(e) => handleArrayChange('riskAssessments', index, 'likelihood', e.target.value)}
                          disabled={loading}
                          className="form09-table-select"
                        >
                          <option value="">Select</option>
                          <option value="Almost Certain">Almost Certain</option>
                          <option value="Likely">Likely</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Unlikely">Unlikely</option>
                          <option value="Rare">Rare</option>
                        </select>
                      </td>
                      <td>
                        <input 
                          type="text" 
                          value={assessment.rating}
                          onChange={(e) => handleArrayChange('riskAssessments', index, 'rating', e.target.value)}
                          disabled={loading}
                          placeholder="Rating"
                          className="form09-table-input"
                        />
                      </td>
                      <td className="form09-checkbox-cell">
                        <input 
                          type="checkbox" 
                          checked={assessment.requiredYes}
                          onChange={(e) => handleArrayChange('riskAssessments', index, 'requiredYes', e.target.checked)}
                          disabled={loading}
                          className="form09-table-checkbox"
                        />
                      </td>
                      <td className="form09-checkbox-cell">
                        <input 
                          type="checkbox" 
                          checked={assessment.requiredNo}
                          onChange={(e) => handleArrayChange('riskAssessments', index, 'requiredNo', e.target.checked)}
                          disabled={loading}
                          className="form09-table-checkbox"
                        />
                      </td>
                      <td className="form09-checkbox-cell">
                        <input 
                          type="checkbox" 
                          checked={assessment.implementedYes}
                          onChange={(e) => handleArrayChange('riskAssessments', index, 'implementedYes', e.target.checked)}
                          disabled={loading}
                          className="form09-table-checkbox"
                        />
                      </td>
                      <td className="form09-checkbox-cell">
                        <input 
                          type="checkbox" 
                          checked={assessment.implementedNo}
                          onChange={(e) => handleArrayChange('riskAssessments', index, 'implementedNo', e.target.checked)}
                          disabled={loading}
                          className="form09-table-checkbox"
                        />
                      </td>
                      <td className="form09-action-cell">
                        {formState.riskAssessments.length > 1 && (
                          <button 
                            type="button" 
                            className="form09-remove-row-btn"
                            onClick={() => removeRiskAssessmentRow(index)}
                            disabled={loading}
                            title="Remove this assessment"
                          >
                            ×
                          </button>
                        )}
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
              <button 
                type="button" 
                className="form09-add-plus-btn"
                onClick={addRiskAssessmentRow}
                disabled={loading}
                title="Add another risk assessment"
              >
                +
              </button>
            </div>
            <div className="form09-control-method-section">
              <p><em>If yes, describe the control method taken in the space below:</em></p>
              <textarea 
                rows="4" 
                value={formState.riskAssessments[0]?.controlMethod || ''}
                onChange={(e) => handleArrayChange('riskAssessments', 0, 'controlMethod', e.target.value)}
                disabled={loading}
                placeholder="Describe control methods..."
                className="form09-textarea"
              />
            </div>
          </div>
        );

      case 8:
        return (
          <div className="form09-part-section">
            
            <div className="form09-step-section">
              <h2>Step 5 - Implementation Plan (for controls not already in place)</h2>
              <div className="form09-dynamic-table-section">
                <table className="form09-implementation-plan-table">
                  <thead>
                    <tr>
                      <th>Control Option</th>
                      <th>Resources Required</th>
                      <th>Person(s) responsible</th>
                      <th>Proposed implementation date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formState.implementationPlan.map((plan, index) => (
                      <tr key={plan.id}>
                        <td>
                          <input 
                            type="text" 
                            value={plan.controlOption}
                            onChange={(e) => handleArrayChange('implementationPlan', index, 'controlOption', e.target.value)}
                            disabled={loading}
                            placeholder="Control option..."
                            className="form09-table-input"
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={plan.resources}
                            onChange={(e) => handleArrayChange('implementationPlan', index, 'resources', e.target.value)}
                            disabled={loading}
                            placeholder="Resources needed..."
                            className="form09-table-input"
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            value={plan.responsiblePerson}
                            onChange={(e) => handleArrayChange('implementationPlan', index, 'responsiblePerson', e.target.value)}
                            disabled={loading}
                            placeholder="Responsible person..."
                            className="form09-table-input"
                          />
                        </td>
                        <td>
                          <input 
                            type="date" 
                            value={plan.implementationDate}
                            onChange={(e) => handleArrayChange('implementationPlan', index, 'implementationDate', e.target.value)}
                            disabled={loading}
                            className="form09-table-input"
                          />
                        </td>
                        <td className="form09-action-cell">
                          {formState.implementationPlan.length > 1 && (
                            <button 
                              type="button" 
                              className="form09-remove-row-btn"
                              onClick={() => removeImplementationPlanRow(index)}
                              disabled={loading}
                              title="Remove this plan"
                            >
                              ×
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button 
                  type="button" 
                  className="form09-add-plus-btn"
                  onClick={addImplementationPlanRow}
                  disabled={loading}
                  title="Add another implementation plan"
                >
                  +
                </button>
              </div>
            </div>

            <div className="form09-step-section">
              <h2>Step 6 - Comments and endorsements of team members</h2>
              <div className="form09-team-endorsements">
                {formState.teamSignatures.map((signature, index) => (
                  <div key={signature.id} className="form09-signature-block form09-dynamic-signature">
                    <div className="form09-signature-row">
                      <label>Name:</label>
                      <input 
                        type="text" 
                        value={signature.name}
                        onChange={(e) => handleArrayChange('teamSignatures', index, 'name', e.target.value)}
                        disabled={loading}
                        className="form09-signature-input"
                      />
                    </div>
                    <div className="form09-signature-row">
                      <label>Signature:</label>
                      <input 
                        type="text" 
                        value={signature.signature}
                        onChange={(e) => handleArrayChange('teamSignatures', index, 'signature', e.target.value)}
                        disabled={loading}
                        placeholder="Sign here"
                        className="form09-signature-input"
                      />
                    </div>
                    <div className="form09-signature-row">
                      <label>Date:</label>
                      <input 
                        type="date" 
                        value={signature.date}
                        onChange={(e) => handleArrayChange('teamSignatures', index, 'date', e.target.value)}
                        disabled={loading}
                        className="form09-signature-input"
                      />
                    </div>
                    {formState.teamSignatures.length > 1 && (
                      <button 
                        type="button" 
                        className="form09-remove-signature-btn"
                        onClick={() => removeTeamSignatureRow(index)}
                        disabled={loading}
                        title="Remove this signature"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  className="form09-add-plus-btn"
                  onClick={addTeamSignatureRow}
                  disabled={loading}
                  title="Add another team member"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="form09-part-section">
            
            <h2>RISK CONSEQUENCE RATING TABLE</h2>
            <table className="form09-rating-table">
              <thead>
                <tr><th>Types</th><th>Interpretation</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>Critical</strong></td><td>The consequences would stop the operation/service from reaching its key strategic goals and objectives.</td></tr>
                <tr><td><strong>High</strong></td><td>The consequences would threaten the operation/service's key strategic goals and objectives.</td></tr>
                <tr><td><strong>Medium</strong></td><td>The consequences would not threaten the operation/service's key strategic goals and objectives but would subject it to significant review.</td></tr>
                <tr><td><strong>Low</strong></td><td>The consequences would threaten a minor aspect of the operation/service but it would not affect the overall performance of the operation/service.</td></tr>
                <tr><td><strong>Negligible</strong></td><td>The consequences pose no material threat to the operation/service.</td></tr>
              </tbody>
            </table>
            
            <h2>RISK PROBABILITY RATING TABLE</h2>
            <table className="form09-rating-table">
              <thead>
                <tr><th>Types</th><th>Interpretation</th></tr>
              </thead>
              <tbody>
                <tr><td><strong>Almost Certain</strong></td><td>The event is expected to occur in most circumstances</td></tr>
                <tr><td><strong>Likely</strong></td><td>The event will probably occur in most circumstances</td></tr>
                <tr><td><strong>Moderate</strong></td><td>The event should occur at some time</td></tr>
              </tbody>
            </table>
          </div>
        );

      case 10:
        return (
          <div className="form09-part-section">
            
            <h2>RISK PROBABILITY RATING TABLE (Continued)</h2>
            <table className="form09-rating-table">
              <tbody>
                <tr><td><strong>Unlikely</strong></td><td>The event could occur at some time</td></tr>
                <tr><td><strong>Rare</strong></td><td>The event may only occur in exceptional circumstances</td></tr>
              </tbody>
            </table>
            
            <h2>RISK ASSESSMENT MATRIX - PRIORITISING RISKS</h2>
            <table className="form09-matrix-table">
              <thead>
                <tr>
                  <th rowSpan="2">CONSEQUENCE</th>
                  <th colSpan="5">PROBABILITY</th>
                </tr>
                <tr>
                  <th>ALMOST CERTAIN</th>
                  <th>LIKELY</th>
                  <th>MODERATE</th>
                  <th>UNLIKELY</th>
                  <th>RARE</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><strong>Critical</strong></td><td>High</td><td>High</td><td>High</td><td>Medium</td><td>Medium</td></tr>
                <tr><td><strong>High</strong></td><td>High</td><td>High</td><td>Medium</td><td>Medium</td><td>Medium</td></tr>
                <tr><td><strong>Medium</strong></td><td>High</td><td>Medium</td><td>Medium</td><td>Low</td><td>Low</td></tr>
              </tbody>
            </table>
          </div>
        );

      case 11:
        return (
          <div className="form09-part-section">
            
            <h2>RISK ASSESSMENT MATRIX (Continued)</h2>
            <table className="form09-matrix-table">
              <tbody>
                <tr><td><strong>Low</strong></td><td>Medium</td><td>Medium</td><td>Low</td><td>Low</td><td>Low</td></tr>
                <tr><td><strong>Negligible</strong></td><td>Medium</td><td>Low</td><td>Low</td><td>Low</td><td>Low</td></tr>
              </tbody>
            </table>
            
            <h2>RISK PRIORITY SUMMARY TABLE</h2>
            <table className="form09-priority-table">
              <thead>
                <tr>
                  <th>Risk Priority level</th>
                  <th>Definitions of Priority</th>
                  <th>Suggested Time Frame for action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>High</strong></td>
                  <td>Situation critical, stop work immediately or consider cessation of work process. Must be fixed today, consider short term and/or long term actions.</td>
                  <td><strong>Without undue delay (Now)</strong></td>
                </tr>
                <tr>
                  <td><strong>Medium</strong></td>
                  <td>It is very important and must be fixed this week, considering short-term and/or long-term actions.</td>
                  <td><strong>This Week</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case 12:
        return (
          <div className="form09-part-section">
            
            <h2>RISK PRIORITY SUMMARY TABLE (Continued)</h2>
            <table className="form09-priority-table">
              <tbody>
                <tr>
                  <td><strong>Low</strong></td>
                  <td>Is still important but can be dealt with through scheduled maintenance or similar types of programming. However, if the solution is quick and easy then fix it today. Review and/or manage by routine procedures.</td>
                  <td><strong>1 - 3 Months</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="form09-document-container">
      
      {/* ========================================================================= */}
      {/* 1. DOCUMENT HEADER                                                        */}
      {/* ========================================================================= */}
      <DocumentHeader 
        docTitle="RISK ASSESSMENT PLAN" 
        docNo="OF/DG/009" 
        issueNo="1" 
        pageInfo={`Page ${currentPage} of ${totalPages}`}
      />

      {/* ========================================================================= */}
      {/* 2. FORM BODY                                                              */}
      {/* ========================================================================= */}
      <div className="form09-form-body-container">
          
        {/* Error and Success Messages */}
        {error && (
          <div className="form09-error-message">
            ⚠️ {error}
            <button onClick={() => setError(null)} className="form09-close-error">×</button>
          </div>
        )}

        {success && (
          <div className="form09-success-message">
            ✅ {editMode ? 'Risk assessment updated successfully!' : 'Risk assessment submitted successfully!'} Redirecting...
          </div>
        )}

        {/* Page Navigation */}
        <div className="form09-page-navigation">
          <button 
            onClick={goToPrevPage} 
            disabled={currentPage === 1 || loading}
            className="form09-nav-button form09-prev-button"
          >
            ← Previous Page
          </button>
          <button 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages || loading}
            className="form09-nav-button form09-next-button"
          >
            Next Page →
          </button>
        </div>

        {/* Current Page Content */}
        {renderPageContent()}

        <FormFooter 
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          isSubmitting={loading}
          submitText={editMode ? "Update Request" : "Submit Form"}
        />
      </div>
    </div>
  );
};

export default RiskAssessmentForm;