import React, { useState, useEffect, useCallback } from 'react';
import FormManager from './FormManager';
import './RequesterDashboard.css';

const RequesterDashboard = ({ user, activeTab }) => {
  const currentUser = user;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestFilters, setRequestFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    dateRange: 'all'
  });
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [error, setError] = useState(null);
  const [requestSearchTerm, setRequestSearchTerm] = useState('');
  const [favoriteForms, setFavoriteForms] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState(null);
  
  const BACKEND_URL = 'http://localhost:5001/api';

  // Cleanup effect
  useEffect(() => {
    return () => {
      document.body.classList.remove('form-full-page-mode');
    };
  }, []);

  // Handle back from custom component
  const handleBackFromCustomComponent = () => {
    setSelectedComponent(null);
    document.body.classList.remove('form-full-page-mode');
    loadRequestsFromBackend();
    showTempNotification('Returned to dashboard', 'info');
  };

  // Show temporary notification banner
  const showTempNotification = useCallback((message, type = 'info') => {
    setNotificationMessage({ text: message, type });
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage('');
    }, 3000);
  }, []);

  // Generate forms using FormManager
  const generateForms = () => {
    return FormManager.generateForms(currentUser, handleBackFromCustomComponent, BACKEND_URL);
  };

  const availableForms = generateForms();
  const categoryGroups = FormManager.categoryGroups;

  // Initialize favorite forms from localStorage
  useEffect(() => {
    FormManager.initializeFavoriteForms(currentUser, setFavoriteForms);
  }, [currentUser]);

  // Save favorite forms to localStorage
  useEffect(() => {
    FormManager.saveFavoriteForms(currentUser, favoriteForms);
  }, [favoriteForms, currentUser]);

  // Load requests from backend
  const loadRequestsFromBackend = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const employeeId = currentUser?.employeeId;
      
      if (!employeeId) {
        console.error('❌ No employee ID found for user');
        setError('User information not found. Please login again.');
        return;
      }
      
      console.log('🔄 Loading requests for employee:', employeeId);
      
      const response = await fetch(`${BACKEND_URL}/requests/employee/${employeeId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        const updatedRequests = result.data;
        setRequests(updatedRequests);
        console.log(`✅ Loaded ${updatedRequests.length} requests from database`);
      } else {
        console.error('❌ Backend error loading requests:', result.message);
        setError('Failed to load requests from server.');
      }
    } catch (error) {
      console.error('❌ Network error fetching requests:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [currentUser.employeeId, BACKEND_URL]);

  // Load requests when component mounts and when activeTab changes
  useEffect(() => {
    if (activeTab === 'my-requests' || activeTab === 'dashboard') {
      loadRequestsFromBackend();
    }
  }, [activeTab, loadRequestsFromBackend]);

  // Filter forms based on category group and search
  const filteredForms = FormManager.filterForms(availableForms, selectedCategoryGroup, searchTerm);

  // Sort forms by favorites
  const sortedForms = FormManager.sortFormsByFavorites(filteredForms, favoriteForms);

  // Filter and sort requests
  const filteredRequests = requests.filter(request => {
    const matchesStatus = requestFilters.status === 'all' || 
                         request.status === requestFilters.status;
    const matchesCategory = requestFilters.category === 'all' || 
                           request.category === requestFilters.category;
    const matchesPriority = requestFilters.priority === 'all' || 
                           request.priority === requestFilters.priority;
    
    return matchesStatus && matchesCategory && matchesPriority;
  }).filter(request => 
    request.requestId.toString().includes(requestSearchTerm) ||
    request.title.toLowerCase().includes(requestSearchTerm.toLowerCase()) ||
    request.formName.toLowerCase().includes(requestSearchTerm.toLowerCase())
  ).sort((a, b) => {
    const order = sortOrder === 'asc' ? 1 : -1;
    return (a[sortBy] < b[sortBy] ? -1 : 1) * order;
  });

  // Handle form selection using FormManager
  const handleFormSelect = (formConfig) => {
    FormManager.handleFormSelect(
      formConfig, 
      setSelectedComponent, 
      currentUser, 
      handleBackFromCustomComponent, 
      BACKEND_URL, 
      showTempNotification
    );
  };

  // Handle request click to show details
  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  // Handle edit request using FormManager
  const handleEditRequest = (request) => {
    FormManager.handleEditRequest(
      request,
      availableForms,
      setSelectedComponent,
      currentUser,
      handleBackFromCustomComponent,
      BACKEND_URL,
      setShowRequestModal,
      showTempNotification
    );
  };

  // Handle duplicate request using FormManager
  const handleDuplicateRequest = (request) => {
    FormManager.handleDuplicateRequest(
      request,
      availableForms,
      setSelectedComponent,
      currentUser,
      handleBackFromCustomComponent,
      BACKEND_URL,
      setShowRequestModal,
      showTempNotification
    );
  };

  // Handle cancel request
  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/requests/${requestId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cancelledBy: currentUser.employeeId,
          reason: 'Cancelled by requester'
        })
      });
      
      if (response.ok) {
        showTempNotification('Request cancelled successfully', 'info');
        loadRequestsFromBackend();
        setShowRequestModal(false);
      }
    } catch (error) {
      console.error('Cancel failed:', error);
      showTempNotification('Failed to cancel request', 'error');
    }
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setRequestFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Helper functions for UI
  const getStatusBadge = (status) => {
    const statusConfig = {
      submitted: { class: 'status-submitted', label: 'Submitted', emoji: '📤' },
      pending: { class: 'status-pending', label: 'Pending', emoji: '⏳' },
      in_review: { class: 'status-review', label: 'In Review', emoji: '🔍' },
      approved: { class: 'status-approved', label: 'Approved', emoji: '✅' },
      rejected: { class: 'status-rejected', label: 'Rejected', emoji: '❌' },
      needs_correction: { class: 'status-correction', label: 'Needs Correction', emoji: '✏️' },
      cancelled: { class: 'status-cancelled', label: 'Cancelled', emoji: '🚫' }
    };

    const config = statusConfig[status] || { 
      class: 'status-default', 
      label: status, 
      emoji: '📋' 
    };
    
    return (
      <span className={`status-badge ${config.class}`}>
        {config.emoji} {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      urgent: { class: 'priority-urgent', label: 'Urgent', emoji: '🔴' },
      high: { class: 'priority-high', label: 'High', emoji: '🟠' },
      medium: { class: 'priority-medium', label: 'Medium', emoji: '🟡' },
      low: { class: 'priority-low', label: 'Low', emoji: '🟢' }
    };

    const config = priorityConfig[priority?.toLowerCase()] || priorityConfig['medium'];
    
    return (
      <span className={`priority-badge ${config.class}`}>
        {config.emoji} {config.label}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderFieldValue = (value) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    
    if (typeof value === 'object') {
      if (value.value !== undefined && value.label !== undefined) {
        return value.label;
      }
      if (Array.isArray(value)) {
        return value.map(item => renderFieldValue(item)).join(', ');
      }
      return JSON.stringify(value);
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    return value.toString();
  };

  // Get status counts for dashboard
  const getStatusCounts = () => {
    return {
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
      needs_correction: requests.filter(r => r.status === 'needs_correction').length,
      cancelled: requests.filter(r => r.status === 'cancelled').length,
      total: requests.length
    };
  };

  // Get form categories for filters
  const getCategories = () => {
    return FormManager.getFormCategories(availableForms);
  };

  // Get most used forms
  const getMostUsedForms = () => {
    return FormManager.getMostUsedForms(availableForms, requests);
  };

  // Get form statistics from configuration
  const getFormStatistics = () => {
    return FormManager.getFormStatistics();
  };

  // Toggle favorite form using FormManager
  const toggleFavorite = (formId, e) => {
    FormManager.toggleFavorite(formId, favoriteForms, setFavoriteForms, showTempNotification, e);
  };

  // Get quick access forms
  const getQuickAccessForms = (count = 4) => {
    return FormManager.getQuickAccessForms(availableForms, favoriteForms, count);
  };

  const statusCounts = getStatusCounts();
  const categories = getCategories();
  const mostUsedForms = getMostUsedForms();
  const formStats = getFormStatistics();
  const quickAccessForms = getQuickAccessForms();

  // If a custom component is selected, render it as FULL PAGE
  if (selectedComponent) {
    // Add CSS to hide sidebar and header when form is open
    document.body.classList.add('form-full-page-mode');
    
    const CustomComponent = selectedComponent.component;
    return (
      <div className="form-full-page-container">
        <CustomComponent 
          {...selectedComponent.config}
          user={selectedComponent.user}
          onBack={() => {
            document.body.classList.remove('form-full-page-mode');
            handleBackFromCustomComponent();
          }}
          backendUrl={BACKEND_URL}
        />
      </div>
    );
  }

  // Render request details modal
  const renderRequestModal = () => {
    if (!selectedRequest) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Request Details #{selectedRequest.requestId}</h2>
            <button 
              className="modal-close"
              onClick={() => setShowRequestModal(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          
          <div className="modal-body">
            <div className="request-details-grid">
              <div className="detail-section">
                <h3>Basic Information</h3>
                <div className="detail-row">
                  <span className="detail-label">Form:</span>
                  <span className="detail-value">{selectedRequest.formName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Title:</span>
                  <span className="detail-value">{selectedRequest.title}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">
                    <span className="category-badge">{selectedRequest.category}</span>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Priority:</span>
                  <span className="detail-value">{getPriorityBadge(selectedRequest.priority)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value">{getStatusBadge(selectedRequest.status)}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Timeline</h3>
                <div className="detail-row">
                  <span className="detail-label">Submitted:</span>
                  <span className="detail-value">{formatDate(selectedRequest.submittedAt)}</span>
                </div>
                {selectedRequest.approvedAt && (
                  <div className="detail-row">
                    <span className="detail-label">Approved:</span>
                    <span className="detail-value">{formatDate(selectedRequest.approvedAt)}</span>
                  </div>
                )}
                {selectedRequest.rejectedAt && (
                  <div className="detail-row">
                    <span className="detail-label">Rejected:</span>
                    <span className="detail-value">{formatDate(selectedRequest.rejectedAt)}</span>
                  </div>
                )}
                {selectedRequest.correctedAt && (
                  <div className="detail-row">
                    <span className="detail-label">Correction Requested:</span>
                    <span className="detail-value">{formatDate(selectedRequest.correctedAt)}</span>
                  </div>
                )}
                {selectedRequest.cancelledAt && (
                  <div className="detail-row">
                    <span className="detail-label">Cancelled:</span>
                    <span className="detail-value">{formatDate(selectedRequest.cancelledAt)}</span>
                  </div>
                )}
              </div>

              {selectedRequest.formData && (
                <div className="detail-section full-width">
                  <h3>Submitted Data</h3>
                  <div className="form-data-grid">
                    {Object.entries(selectedRequest.formData).map(([key, value]) => (
                      <div key={key} className="data-row">
                        <span className="data-label">{key}:</span>
                        <span className="data-value">{renderFieldValue(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <div className="modal-actions">
              {(selectedRequest.status === 'rejected' || selectedRequest.status === 'needs_correction') && (
                <button 
                  className="btn-secondary"
                  onClick={() => handleEditRequest(selectedRequest)}
                >
                  ✏️ Edit & Resubmit
                </button>
              )}
              
              {selectedRequest.status === 'pending' && (
                <button 
                  className="btn-warning"
                  onClick={() => handleCancelRequest(selectedRequest._id)}
                >
                  🚫 Cancel Request
                </button>
              )}
              
              <button 
                className="btn-primary"
                onClick={() => handleDuplicateRequest(selectedRequest)}
              >
                📋 Duplicate Request
              </button>
              
              <button 
                className="btn-secondary"
                onClick={() => setShowRequestModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'notifications':
        return (
          <div className="dashboard-content">
            <h2>🔔 Notifications</h2>
            <div className="insa-card">
              <p>No new notifications at the moment.</p>
              <div className="placeholder-content">
                <p>Your notifications will appear here when requests are updated.</p>
              </div>
            </div>
          </div>
        );
      
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <h2>📊 Welcome, {currentUser.name}!</h2>
            <div className="stats-grid">
              <div className="insa-card stat-card">
                <h3>Available Forms</h3>
                <p className="stat-number">{formStats.available}</p>
              </div>
              <div className="insa-card stat-card">
                <h3>Total Requests</h3>
                <p className="stat-number">{statusCounts.total}</p>
              </div>
              <div className="insa-card stat-card">
                <h3>Pending</h3>
                <p className="stat-number">{statusCounts.pending}</p>
              </div>
              <div className="insa-card stat-card">
                <h3>Approved</h3>
                <p className="stat-number">{statusCounts.approved}</p>
              </div>
              <div className="insa-card stat-card">
                <h3>Rejected</h3>
                <p className="stat-number">{statusCounts.rejected}</p>
              </div>
            </div>
            
            {/* Quick Access Forms */}
            <div className="insa-card">
              <h3>Quick Access Forms</h3>
              <div className="quick-forms">
                {quickAccessForms.map(form => (
                  <div 
                    key={form.id}
                    className="quick-form"
                    onClick={() => handleFormSelect(form)}
                  >
                    <div className="form-icon">{form.icon}</div>
                    <div className="form-name">{form.name}</div>
                    {form.comingSoon ? (
                      <div className="form-status coming-soon">Soon</div>
                    ) : (
                      <div className="form-status available">Available</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Most Used Forms */}
            {mostUsedForms.some(form => form.usageCount > 0) && (
              <div className="insa-card">
                <h3>Most Used Forms</h3>
                <div className="quick-forms">
                  {mostUsedForms
                    .filter(form => form.usageCount > 0)
                    .slice(0, 4)
                    .map(form => (
                      <div 
                        key={form.id}
                        className="quick-form"
                        onClick={() => handleFormSelect(form)}
                      >
                        <div className="form-icon">{form.icon}</div>
                        <div className="form-name">{form.name}</div>
                        <div className="form-usage">{form.usageCount} uses</div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {/* Recent Activity */}
            <div className="insa-card">
              <h3>Recent Requests</h3>
              {filteredRequests.length > 0 ? (
                <div className="recent-requests">
                  {filteredRequests.slice(0, 5).map(request => (
                    <div 
                      key={request._id}
                      className="request-item"
                      onClick={() => handleRequestClick(request)}
                    >
                      <div className="request-info">
                        <div className="request-title">{renderFieldValue(request.title)}</div>
                        <div className="request-meta">
                          <span className="request-id">#{request.requestId}</span>
                          <span className="request-category">{renderFieldValue(request.category)}</span>
                          {getStatusBadge(request.status)}
                        </div>
                      </div>
                      <div className="request-date">
                        {formatDate(request.submittedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No recent requests</p>
              )}
            </div>
          </div>
        );
      
      case 'create-request':
        return (
          <div className="dashboard-content">
            <div className="category-groups-header">
              <h2>Select Form Category</h2>
            </div>
            
            <div className="insa-card">
              {/* Temporary Notification Banner */}
              {showNotification && (
                <div className={`notification-banner ${notificationMessage.type || 'info'}`}>
                  <div className="notification-content">
                    <span className="notification-text">{notificationMessage.text}</span>
                    <button 
                      className="notification-close"
                      onClick={() => setShowNotification(false)}
                      aria-label="Close notification"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* If no category selected, show category selector */}
              {selectedCategoryGroup === null ? (
                <div className="category-groups-container">
                  <div className="category-groups-grid">
                    {categoryGroups.map((group) => (
                      <div 
                        key={group.id}
                        className="category-group-card"
                        onClick={() => setSelectedCategoryGroup(group.id)}
                      >
                        <div className="category-group-icon">{group.icon}</div>
                        <div className="category-group-content">
                          <h4>{group.name}</h4>
                          <p className="category-group-description">{group.description}</p>
                        </div>
                        <div className="category-group-arrow">→</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Show forms for selected category
                <div className="category-forms-container">
                  <div className="category-header">
                    <button 
                      className="back-to-categories-btn"
                      onClick={() => setSelectedCategoryGroup(null)}
                    >
                      ← 
                    </button>
                    <h3>{categoryGroups.find(g => g.id === selectedCategoryGroup)?.name}</h3>
                    <div className="category-stats">
                      <span className="available-count">
                        {availableForms.filter(f => f.categoryGroup === selectedCategoryGroup && !f.comingSoon).length} Available
                      </span>
                      <span className="coming-soon-count">
                        {availableForms.filter(f => f.categoryGroup === selectedCategoryGroup && f.comingSoon).length} Coming Soon
                      </span>
                    </div>
                  </div>
                  
                  {/* Show Coming Soon banner for non-general categories except HR and Security */}
                  {selectedCategoryGroup !== 'general' && selectedCategoryGroup !== 'hr' && selectedCategoryGroup !== 'security' && (
                    <div className="coming-soon-banner">
                      <div className="coming-soon-icon">🚧</div>
                      <div className="coming-soon-content">
                        <h4>Coming Soon!</h4>
                        <p>{categoryGroups.find(g => g.id === selectedCategoryGroup)?.name} are currently under development. Check back soon for updates!</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Form Controls (only show for General, HR, and Security Forms) */}
                  {(selectedCategoryGroup === 'general' || selectedCategoryGroup === 'hr' || selectedCategoryGroup === 'security') && (
                    <div className="form-controls">
                      <div className="search-filter">
                        <input
                          type="text"
                          placeholder={`Search ${categoryGroups.find(g => g.id === selectedCategoryGroup)?.name} forms...`}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="search-input"
                          aria-label="Search forms"
                        />
                        <div className="view-toggle">
                          <button 
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                            aria-label="Grid view"
                          >
                            ⏹️
                          </button>
                          <button 
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                            aria-label="List view"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Forms Grid/List */}
                  {sortedForms.length === 0 ? (
                    <div className="empty-forms-state">
                      <div className="empty-icon">📄</div>
                      <h4>No forms found</h4>
                      <p>Try adjusting your search or check back later for new forms</p>
                    </div>
                  ) : (
                    <div className={`category-forms-${viewMode}`}>
                      {sortedForms.map(form => (
                        <div 
                          key={form.id}
                          className={`form-card ${form.comingSoon ? 'coming-soon' : 'available'}`}
                          onClick={() => handleFormSelect(form)}
                        >
                          <div className="form-header">
                            <div className="form-icon">{form.icon}</div>
                            <div className={`form-badge ${form.comingSoon ? 'coming-soon-badge' : 'available-badge'}`}>
                              {form.comingSoon ? 'Coming Soon' : 'Available Now'}
                            </div>
                           
                          </div>
                          <div className="form-content">
                            <h3 className="form-name">{form.name}</h3>
                        </div>
                          <div className="form-actions">
                            {form.comingSoon ? (
                              <button className="btn-secondary" disabled>Coming Soon</button>
                            ) : (
                              <button className="btn-primary">Start </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      
      case 'my-requests':
        return (
          <div className="dashboard-content">
            <h2>📋 My Requests ({requests.length})</h2>
            
            {/* Temporary Notification Banner */}
            {showNotification && (
              <div className={`notification-banner ${notificationMessage.type || 'info'}`}>
                <div className="notification-content">
                  <span className="notification-text">{notificationMessage.text}</span>
                  <button 
                    className="notification-close"
                    onClick={() => setShowNotification(false)}
                    aria-label="Close notification"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Request Details Modal */}
            {showRequestModal && renderRequestModal()}

            <div className="insa-card">
              <div className="controls-row">
                <div className="search-filter">
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={requestSearchTerm}
                    onChange={(e) => setRequestSearchTerm(e.target.value)}
                    className="search-input"
                    aria-label="Search requests"
                  />
                  <button 
                    className={`filter-toggle ${showFilters ? 'active' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>
                  <button 
                    onClick={loadRequestsFromBackend}
                    className="insa-btn primary refresh-btn"
                    disabled={loading}
                    aria-label="Refresh requests"
                  >
                    {loading ? '🔄 Refreshing...' : '↻ Refresh'}
                  </button>
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="filters-panel">
                  <div className="filter-group">
                    <label htmlFor="status-filter">Status:</label>
                    <select 
                      id="status-filter"
                      value={requestFilters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="needs_correction">Needs Correction</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label htmlFor="category-filter">Category:</label>
                    <select 
                      id="category-filter"
                      value={requestFilters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      {categories.filter(cat => cat !== 'all').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setRequestFilters({
                        status: 'all',
                        category: 'all',
                        priority: 'all',
                        dateRange: 'all'
                      });
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {error ? (
                <div className="error-state">
                  <div className="error-icon">⚠️</div>
                  <h3>Error Loading Data</h3>
                  <p>{error}</p>
                  <button onClick={loadRequestsFromBackend} className="insa-btn primary">
                    Retry
                  </button>
                </div>
              ) : loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading your requests...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📨</div>
                  <h3>No requests found</h3>
                  <p>Try adjusting your filters or submit a new request</p>
                </div>
              ) : (
                <div className="requests-table-container">
                  <table className="requests-table">
                    <thead>
                      <tr>
                        <th onClick={() => handleSortChange('requestId')}>
                          Request ID {sortBy === 'requestId' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSortChange('formName')}>
                          Form Name {sortBy === 'formName' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSortChange('title')}>
                          Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th onClick={() => handleSortChange('status')}>
                          Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSortChange('submittedAt')}>
                          Submitted Date {sortBy === 'submittedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map(request => (
                        <tr 
                          key={request._id || request.requestId} 
                          className={`status-${request.status} clickable-row`}
                          onClick={() => handleRequestClick(request)}
                        >
                          <td className="request-id-cell">
                            <strong>#{request.requestId}</strong>
                          </td>
                          <td>{renderFieldValue(request.formName)}</td>
                          <td className="request-title">{renderFieldValue(request.title)}</td>
                          <td>
                            <span className="category-badge">{renderFieldValue(request.category)}</span>
                          </td>
                          <td>{getPriorityBadge(request.priority)}</td>
                          <td>{getStatusBadge(request.status)}</td>
                          <td>{formatDate(request.submittedAt)}</td>
                          <td className="action-cell">
                            <button 
                              className="btn-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRequestClick(request);
                              }}
                              aria-label="View details"
                            >
                              👁️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="dashboard-content">
            <h2>Welcome to Requester Portal</h2>
            <div className="insa-card">
              <p>Select an option from the sidebar to get started.</p>
            </div>
          </div>
        );
    }
  };

  // Main Render
  return (
    <div className="requester-dashboard">
      {renderContent()}
    </div>
  );
};

export default RequesterDashboard;