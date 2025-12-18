import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './ApproverDashboard.css';

const ApproverDashboard = ({ user, activeTab }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    priority: 'all',
    dateRange: 'all',
    searchTerm: ''
  });
  const [approvalComment, setApprovalComment] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  const API_BASE_URL = 'http://localhost:5001/api';

  // Show temporary notification
  const showTempNotification = useCallback((message, type = 'info') => {
    setNotificationMessage({ text: message, type });
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage('');
    }, 5000);
  }, []);

  // Fetch requests from backend
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/requests`);
      const result = await response.json();
      
      if (result.success) {
        console.log('Fetched requests:', result.data);
        setRequests(result.data || []);
      } else {
        console.error('Error fetching requests:', result.message);
        showTempNotification('Failed to load requests', 'error');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      showTempNotification('Network error loading requests', 'error');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, showTempNotification]);

  // Load requests when active tab changes
  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'pending' || 
        activeTab === 'approved' || activeTab === 'rejected' || 
        activeTab === 'all-requests') {
      fetchRequests();
    }
  }, [activeTab, fetchRequests]);

  // Helper functions
  const getStatusBadge = useCallback((status) => {
    const statusConfig = {
      pending: { class: 'status-pending', label: 'Pending', emoji: '⏳' },
      approved: { class: 'status-approved', label: 'Approved', emoji: '✅' },
      rejected: { class: 'status-rejected', label: 'Rejected', emoji: '❌' },
      'in-progress': { class: 'status-in-progress', label: 'In Progress', emoji: '🔄' },
      completed: { class: 'status-completed', label: 'Completed', emoji: '✅' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.class}`}>
        {config.emoji} {config.label}
      </span>
    );
  }, []);

  const getPriorityBadge = useCallback((priority) => {
    const priorityConfig = {
      urgent: { class: 'priority-urgent', label: 'Urgent', emoji: '🔴' },
      high: { class: 'priority-high', label: 'High', emoji: '🟠' },
      medium: { class: 'priority-medium', label: 'Medium', emoji: '🟡' },
      low: { class: 'priority-low', label: 'Low', emoji: '🟢' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    return (
      <span className={`priority-badge ${config.class}`}>
        {config.emoji} {config.label}
      </span>
    );
  }, []);

  const formatDate = useCallback((date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  }, []);

  // Update request status
  const updateRequestStatus = useCallback(async (requestId, status, comment = '') => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: status,
          ...(comment && { approvalComment: comment }),
          updatedAt: new Date().toISOString()
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        showTempNotification(`Request ${status} successfully`, 'success');
        await fetchRequests();
      } else {
        console.error('Error updating request:', result.message);
        showTempNotification('Failed to update request', 'error');
      }
    } catch (error) {
      console.error('Error updating request:', error);
      showTempNotification('Network error updating request', 'error');
    } finally {
      setLoading(false);
      setShowDetailsModal(false);
      setApprovalComment('');
    }
  }, [API_BASE_URL, showTempNotification, fetchRequests]);

  // Get request title from form data
  const getRequestTitle = useCallback((request) => {
    if (!request) return 'No Title';
    
    // Check formData for different form types
    if (request.formData) {
      if (request.formData.docTitle1) return request.formData.docTitle1;
      if (request.formData.trainingTitle) return request.formData.trainingTitle;
      if (request.formData.requesterName) return `Request from ${request.formData.requesterName}`;
    }
    
    return request.formName || 'No Title';
  }, []);

  // Get form icon based on form type
  const getFormIcon = useCallback((formType) => {
    const iconMap = {
      'creation': '📋',
      'approval': '✓',
      'training': '📚',
      'form-01': '📋',
      'form-02': '✓',
      'form-04': '📚'
    };
    return iconMap[formType] || '📋';
  }, []);

  // Filter and sort requests
  const sortedRequests = useMemo(() => {
    if (!requests || !Array.isArray(requests)) {
      return [];
    }

    const searchLower = (filters.searchTerm || '').toLowerCase();
    
    const filteredRequests = requests.filter(request => {
      if (!request) return false;
      
      // Filter by active tab
      const matchesTab = 
        activeTab === 'pending' ? request.status === 'pending' :
        activeTab === 'approved' ? request.status === 'approved' :
        activeTab === 'rejected' ? request.status === 'rejected' :
        activeTab === 'all-requests' ? true :
        activeTab === 'dashboard' ? true : true;
      
      // Filter by category (using formType or formId)
      const requestCategory = request.formType || request.formId || '';
      const matchesCategory = filters.category === 'all' || 
                            requestCategory.toLowerCase().includes(filters.category.toLowerCase());
      
      // Filter by priority
      const matchesPriority = filters.priority === 'all' || 
                            (request.priority && request.priority === filters.priority);
      
      // Filter by search term
      const requestTitle = getRequestTitle(request);
      const matchesSearch = 
        (requestTitle || '').toLowerCase().includes(searchLower) ||
        (request.submitterName || '').toLowerCase().includes(searchLower) ||
        (request.department || '').toLowerCase().includes(searchLower) ||
        (request.formName || '').toLowerCase().includes(searchLower) ||
        (request.formId || '').toLowerCase().includes(searchLower);

      return matchesTab && matchesCategory && matchesPriority && matchesSearch;
    });

    // Sort by priority and submission date
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    
    return [...filteredRequests].sort((a, b) => {
      const aPriority = priorityOrder[a.priority] || 2;
      const bPriority = priorityOrder[b.priority] || 2;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // Sort by date (newest first)
      const aDate = new Date(a.createdAt || a.submittedAt || 0);
      const bDate = new Date(b.createdAt || b.submittedAt || 0);
      return bDate - aDate;
    });
  }, [requests, activeTab, filters, getRequestTitle]);

  // Dashboard metrics
  const metrics = useMemo(() => ({
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    urgent: requests.filter(r => r.priority === 'urgent' && r.status === 'pending').length,
    total: requests.length
  }), [requests]);

  // Debug: Log first request
  useEffect(() => {
    if (requests.length > 0) {
      console.log('First request sample:', requests[0]);
    }
  }, [requests]);

  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'notifications':
        return (
          <div className="dashboard-content">
            <h2>🔔 Notifications</h2>
            <div className="insa-card">
              <p>Notifications will appear here when requests are updated.</p>
              <div className="placeholder-content">
                <p>No new notifications at the moment.</p>
              </div>
            </div>
          </div>
        );
      
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <h2>📊 Approver Dashboard</h2>
            
            {/* Stats Overview */}
            <div className="stats-grid">
              <div className="insa-card stat-card">
                <h3>Pending Requests</h3>
                <p className="stat-number">{metrics.pending}</p>
                <div className="stat-detail">
                  {metrics.urgent > 0 && <span className="urgent-count">{metrics.urgent} urgent</span>}
                </div>
              </div>
              <div className="insa-card stat-card">
                <h3>Approved</h3>
                <p className="stat-number">{metrics.approved}</p>
              </div>
              <div className="insa-card stat-card">
                <h3>Rejected</h3>
                <p className="stat-number">{metrics.rejected}</p>
              </div>
              <div className="insa-card stat-card">
                <h3>Total Requests</h3>
                <p className="stat-number">{metrics.total}</p>
              </div>
            </div>
            
            {/* Recent Requests */}
            <div className="insa-card">
              <h3>Recent Activity</h3>
              {sortedRequests.length > 0 ? (
                <div className="recent-requests">
                  {sortedRequests.slice(0, 5).map(request => (
                    <div 
                      key={request._id}
                      className="request-item"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowDetailsModal(true);
                      }}
                    >
                      <div className="request-info">
                        <div className="request-title">{getRequestTitle(request)}</div>
                        <div className="request-meta">
                          <span className="request-id">#{request._id?.substr(-6) || 'N/A'}</span>
                          <span className="request-category">{request.formType || 'General'}</span>
                          {getPriorityBadge(request.priority)}
                        </div>
                      </div>
                      <div className="request-details">
                        {getStatusBadge(request.status)}
                        <div className="request-date">
                          {formatDate(request.createdAt)}
                        </div>
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
      
      case 'all-requests':
      case 'pending':
      case 'approved':
      case 'rejected':
        return (
          <div className="dashboard-content">
            <h2>
              {activeTab === 'pending' && '⏳ Pending Requests'}
              {activeTab === 'approved' && '✅ Approved Requests'}
              {activeTab === 'rejected' && '❌ Rejected Requests'}
              {activeTab === 'all-requests' && '📄 All Requests'}
            </h2>
            
            {/* Temporary Notification Banner */}
            {showNotification && (
              <div className={`notification-banner ${notificationMessage.type || 'info'}`}>
                <div className="notification-content">
                  <span className="notification-text">{notificationMessage.text}</span>
                  <button 
                    className="notification-close"
                    onClick={() => setShowNotification(false)}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            
            {/* Filters */}
            <div className="insa-card">
              <div className="filters-section">
                <input
                  type="text"
                  placeholder="Search by title, requester, or department..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="search-input"
                  style={{ marginBottom: '15px', width: '100%' }}
                />
                
                <div className="filter-row">
                  <select 
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="filter-select"
                  >
                    <option value="all">All Categories</option>
                    <option value="creation">Document Creation</option>
                    <option value="approval">Approval Requests</option>
                    <option value="training">Training</option>
                  </select>
                  
                  <select 
                    value={filters.priority}
                    onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                    className="filter-select"
                  >
                    <option value="all">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  
                  <button 
                    onClick={fetchRequests}
                    className="insa-btn primary refresh-btn"
                    disabled={loading}
                  >
                    {loading ? '🔄 Refreshing...' : '↻ Refresh'}
                  </button>
                </div>
              </div>
              
              {/* Requests Table */}
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading requests...</p>
                </div>
              ) : sortedRequests.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No requests found</h3>
                  <p>Try adjusting your filters</p>
                </div>
              ) : (
                <div className="requests-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Form</th>
                        <th>Title</th>
                        <th>Requester</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Submitted</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedRequests.map(request => (
                        <tr key={request._id}>
                          <td>#{request._id?.substr(-6) || 'N/A'}</td>
                          <td>
                            <div className="form-info">
                              <span className="form-icon-small">{getFormIcon(request.formType || request.formId)}</span>
                              <span>{request.formName || 'Unknown Form'}</span>
                            </div>
                          </td>
                          <td>{getRequestTitle(request)}</td>
                          <td>
                            <div className="requester-info">
                              <strong>{request.submitterName || 'Unknown'}</strong>
                              <div className="requester-dept">{request.department || 'General'}</div>
                            </div>
                          </td>
                          <td>{getPriorityBadge(request.priority)}</td>
                          <td>{getStatusBadge(request.status)}</td>
                          <td>{formatDate(request.createdAt)}</td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-view"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowDetailsModal(true);
                                }}
                              >
                                View
                              </button>
                              
                              {activeTab === 'pending' && request.status === 'pending' && (
                                <>
                                  <button 
                                    className="btn-approve-sm"
                                    onClick={() => updateRequestStatus(request._id, 'approved', approvalComment)}
                                    disabled={loading}
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    className="btn-reject-sm"
                                    onClick={() => updateRequestStatus(request._id, 'rejected', approvalComment)}
                                    disabled={loading}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                            </div>
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
            <h2>Welcome to Approver Portal</h2>
            <div className="insa-card">
              <p>Select an option from the sidebar to get started.</p>
              <div className="quick-stats">
                <div className="quick-stat">
                  <div className="stat-number">{metrics.pending}</div>
                  <div className="stat-label">Pending Requests</div>
                </div>
                <div className="quick-stat">
                  <div className="stat-number">{metrics.approved}</div>
                  <div className="stat-label">Approved Today</div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  // Request Details Modal
  const renderRequestModal = () => {
    if (!selectedRequest) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Request Details #{selectedRequest._id?.substr(-6) || 'N/A'}</h2>
            <button 
              className="modal-close"
              onClick={() => setShowDetailsModal(false)}
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
                  <span className="detail-value">{selectedRequest.formName || 'Unknown Form'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Title:</span>
                  <span className="detail-value">{getRequestTitle(selectedRequest)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Requester:</span>
                  <span className="detail-value">{selectedRequest.submitterName || 'Unknown'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Department:</span>
                  <span className="detail-value">{selectedRequest.department || 'General'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">
                    <span className="category-badge">{selectedRequest.formType || 'General'}</span>
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
                <div className="detail-row">
                  <span className="detail-label">Form ID:</span>
                  <span className="detail-value">{selectedRequest.formId || 'N/A'}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Timeline</h3>
                <div className="detail-row">
                  <span className="detail-label">Submitted:</span>
                  <span className="detail-value">{formatDate(selectedRequest.createdAt)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Last Updated:</span>
                  <span className="detail-value">{formatDate(selectedRequest.updatedAt)}</span>
                </div>
              </div>

              {selectedRequest.formData && Object.keys(selectedRequest.formData).length > 0 && (
                <div className="detail-section full-width">
                  <h3>Submitted Data</h3>
                  <div className="form-data-grid">
                    {Object.entries(selectedRequest.formData).map(([key, value]) => {
                      // Skip complex objects for display
                      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        return null;
                      }
                      
                      return (
                        <div key={key} className="data-row">
                          <span className="data-label">{key}:</span>
                          <span className="data-value">
                            {Array.isArray(value) ? 
                              JSON.stringify(value) : 
                              (value?.toString() || 'N/A')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Approval Actions for pending requests */}
            {selectedRequest.status === 'pending' && (
              <div className="approval-actions">
                <h3>Decision</h3>
                <textarea
                  placeholder="Add comments for your decision..."
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  className="comment-textarea"
                  rows="3"
                />
                <div className="modal-actions">
                  <button 
                    className="insa-btn secondary"
                    onClick={() => updateRequestStatus(selectedRequest._id, 'rejected', approvalComment)}
                    disabled={loading}
                  >
                    ❌ Reject
                  </button>
                  <button 
                    className="insa-btn primary"
                    onClick={() => updateRequestStatus(selectedRequest._id, 'approved', approvalComment)}
                    disabled={loading}
                  >
                    ✅ Approve
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="approver-dashboard">
      {/* Request Details Modal */}
      {showDetailsModal && renderRequestModal()}
      
      {/* Main Content */}
      {renderContent()}
    </div>
  );
};

export default ApproverDashboard;