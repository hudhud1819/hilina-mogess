import React, { useState, useEffect, useCallback } from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ user, activeTab }) => {
  // States for different sections
  const [users, setUsers] = useState([]);
  const [forms, setForms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [systemSettings, setSystemSettings] = useState({
    slaDefaults: {
      urgent: 24,
      high: 48,
      medium: 72,
      low: 120
    },
    notifications: {
      email: true,
      push: false,
      slack: false
    },
    autoArchiveDays: 90,
    maxFileSize: 10,
    systemTimezone: 'UTC'
  });
  
  // Modal states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // New item states
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    employeeId: '',
    department: '',
    role: 'requester',
    status: 'active'
  });
  const [newForm, setNewForm] = useState({
    name: '',
    description: '',
    category: '',
    icon: '📋',
    fields: []
  });
  const [currentField, setCurrentField] = useState({
    label: '',
    type: 'text',
    required: false,
    options: []
  });

  // Analytics
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    totalForms: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    activeForms: 0
  });

  // API base URL
  const API_BASE_URL = 'http://localhost:5001/api';

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role) => {
    const roles = {
      admin: { emoji: '👑', class: 'role-admin' },
      approver: { emoji: '👨‍⚖️', class: 'role-approver' },
      requester: { emoji: '👤', class: 'role-requester' }
    };
    const config = roles[role] || roles.requester;
    return <span className={`role-badge ${config.class}`}>{config.emoji} {role}</span>;
  };

  const getStatusBadge = (status) => {
    const statuses = {
      active: { emoji: '🟢', class: 'status-active' },
      inactive: { emoji: '⚫', class: 'status-inactive' },
      pending: { emoji: '🟡', class: 'status-pending' }
    };
    const config = statuses[status] || statuses.inactive;
    return <span className={`status-badge ${config.class}`}>{config.emoji} {status}</span>;
  };

  // Fetch data functions
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      const result = await response.json();
      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [API_BASE_URL]);

  const fetchForms = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/forms`);
      const result = await response.json();
      if (result.success) {
        setForms(result.data);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  }, [API_BASE_URL]);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments`);
      const result = await response.json();
      if (result.success) {
        setDepartments(result.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  }, [API_BASE_URL]);

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'users' || activeTab === 'dashboard') {
      fetchUsers();
    }
    if (activeTab === 'all-requests' || activeTab === 'dashboard') {
      fetchForms();
    }
    if (activeTab === 'department' || activeTab === 'dashboard') {
      fetchDepartments();
    }
    
    // Update analytics when data changes
    const totalUsers = users.length;
    const totalForms = forms.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const inactiveUsers = users.filter(u => u.status === 'inactive').length;
    const activeForms = forms.filter(f => f.active).length;
    
    setAnalyticsData({
      totalUsers,
      totalForms,
      activeUsers,
      inactiveUsers,
      activeForms
    });
  }, [activeTab, fetchUsers, fetchForms, fetchDepartments, users, forms]);

  // User Management Functions
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.employeeId) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      });
      
      const result = await response.json();
      if (result.success) {
        setShowAddUserModal(false);
        setNewUser({
          name: '',
          email: '',
          employeeId: '',
          department: '',
          role: 'requester',
          status: 'active'
        });
        fetchUsers();
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          method: 'DELETE'
        });
        
        const result = await response.json();
        if (result.success) {
          fetchUsers();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Form Management Functions
  const handleCreateForm = async () => {
    if (!newForm.name || !newForm.category) {
      alert('Form name and category are required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newForm)
      });
      
      const result = await response.json();
      if (result.success) {
        setShowFormBuilder(false);
        setNewForm({
          name: '',
          description: '',
          category: '',
          icon: '📋',
          fields: []
        });
        setCurrentField({
          label: '',
          type: 'text',
          required: false,
          options: []
        });
        fetchForms();
      }
    } catch (error) {
      console.error('Error creating form:', error);
    }
  };

  const handleAddField = () => {
    if (!currentField.label || !currentField.type) {
      alert('Field label and type are required');
      return;
    }

    const fieldToAdd = {
      ...currentField,
      id: `field_${Date.now()}`,
      fieldName: currentField.label.toLowerCase().replace(/\s+/g, '_')
    };

    setNewForm(prev => ({
      ...prev,
      fields: [...prev.fields, fieldToAdd]
    }));

    setCurrentField({
      label: '',
      type: 'text',
      required: false,
      options: []
    });
  };

  const handleRemoveField = (fieldIndex) => {
    setNewForm(prev => ({
      ...prev,
      fields: prev.fields.filter((_, index) => index !== fieldIndex)
    }));
  };

  // Department Management
  const handleAddDepartment = async () => {
    const deptName = prompt('Enter new department name:');
    if (deptName) {
      try {
        const response = await fetch(`${API_BASE_URL}/departments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: deptName })
        });
        
        const result = await response.json();
        if (result.success) {
          fetchDepartments();
        }
      } catch (error) {
        console.error('Error adding department:', error);
      }
    }
  };

  const handleRemoveDepartment = async (deptName) => {
    if (window.confirm(`Remove department "${deptName}"?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/departments/${deptName}`, {
          method: 'DELETE'
        });
        
        const result = await response.json();
        if (result.success) {
          fetchDepartments();
        }
      } catch (error) {
        console.error('Error removing department:', error);
      }
    }
  };

  // System Settings Functions
  const handleSaveSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(systemSettings)
      });
      
      const result = await response.json();
      if (result.success) {
        alert('System settings saved successfully');
        setShowSettingsModal(false);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <h2>📊 Admin Dashboard</h2>
            
            {/* Stats Overview */}
            <div className="stats-grid">
              <div className="insa-card stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{analyticsData.totalUsers}</p>
                <div className="stat-detail">
                  <span className="active-count">{analyticsData.activeUsers} active</span>
                  <span className="inactive-count">{analyticsData.inactiveUsers} inactive</span>
                </div>
              </div>
              <div className="insa-card stat-card">
                <h3>Total Forms</h3>
                <p className="stat-number">{analyticsData.totalForms}</p>
                <div className="stat-detail">
                  <span className="active-count">{analyticsData.activeForms} active</span>
                </div>
              </div>
              <div className="insa-card stat-card">
                <h3>Departments</h3>
                <p className="stat-number">{departments.length}</p>
              </div>
              <div className="insa-card stat-card">
                <h3>System Status</h3>
                <p className="stat-status">🟢 Operational</p>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="insa-card">
              <h3>Quick Actions</h3>
              <div className="quick-actions-grid">
                <button 
                  className="insa-btn primary"
                  onClick={() => setShowAddUserModal(true)}
                >
                  👥 Add User
                </button>
                <button 
                  className="insa-btn secondary"
                  onClick={() => setShowFormBuilder(true)}
                >
                  📋 Create Form
                </button>
                <button 
                  className="insa-btn admin"
                  onClick={handleAddDepartment}
                >
                  🏢 Add Department
                </button>
                <button 
                  className="insa-btn admin"
                  onClick={() => setShowSettingsModal(true)}
                >
                  ⚙️ System Settings
                </button>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="insa-card">
              <h3>Recent Activity</h3>
              <div className="recent-activity">
                <p>System activity will appear here.</p>
              </div>
            </div>
          </div>
        );
      
      case 'users':
        return (
          <div className="dashboard-content">
            <h2>👥 User Management ({users.length} users)</h2>
            
            <div className="insa-card">
              <div className="section-header">
                <button 
                  className="insa-btn primary"
                  onClick={() => setShowAddUserModal(true)}
                >
                  👥 Add New User
                </button>
                <div className="search-filter">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="search-input"
                  />
                </div>
              </div>
              
              {users.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <h3>No users found</h3>
                  <p>Add your first user to get started</p>
                </div>
              ) : (
                <div className="users-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id || user.id}>
                          <td>{user.employeeId}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.department || 'Not assigned'}</td>
                          <td>{getRoleBadge(user.role)}</td>
                          <td>{getStatusBadge(user.status)}</td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-edit"
                                onClick={() => {
                                  setNewUser({...user});
                                  setShowAddUserModal(true);
                                }}
                              >
                                Edit
                              </button>
                              <button 
                                className="btn-danger"
                                onClick={() => handleDeleteUser(user._id || user.id)}
                              >
                                Delete
                              </button>
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
      
      case 'all-requests':
        return (
          <div className="dashboard-content">
            <h2>📄 All Forms ({forms.length} forms)</h2>
            
            <div className="insa-card">
              <div className="section-header">
                <button 
                  className="insa-btn primary"
                  onClick={() => setShowFormBuilder(true)}
                >
                  📋 Create New Form
                </button>
                <div className="search-filter">
                  <input
                    type="text"
                    placeholder="Search forms..."
                    className="search-input"
                  />
                </div>
              </div>
              
              {forms.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No forms found</h3>
                  <p>Create your first form to get started</p>
                </div>
              ) : (
                <div className="forms-grid">
                  {forms.map(form => (
                    <div key={form._id || form.id} className="form-card">
                      <div className="form-header">
                        <div className="form-icon">{form.icon || '📋'}</div>
                        <div className="form-status">
                          <span className={`status-label ${form.active ? 'active' : 'inactive'}`}>
                            {form.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="form-content">
                        <h3>{form.name}</h3>
                        <p className="form-description">{form.description}</p>
                        <div className="form-meta">
                          <span className="form-category">{form.category}</span>
                          <span className="form-fields">{form.fields?.length || 0} fields</span>
                        </div>
                      </div>
                      <div className="form-actions">
                        <button className="insa-btn secondary">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      case 'department':
        return (
          <div className="dashboard-content">
            <h2>🏢 Department Management ({departments.length} departments)</h2>
            
            <div className="insa-card">
              <div className="section-header">
                <button 
                  className="insa-btn primary"
                  onClick={handleAddDepartment}
                >
                  🏢 Add Department
                </button>
              </div>
              
              {departments.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🏢</div>
                  <h3>No departments found</h3>
                  <p>Add your first department to get started</p>
                </div>
              ) : (
                <div className="departments-grid">
                  {departments.map(dept => (
                    <div key={dept._id || dept} className="department-card">
                      <div className="department-header">
                        <div className="department-icon">🏢</div>
                        <div className="department-name">{dept.name || dept}</div>
                      </div>
                      <div className="department-stats">
                        <div className="stat">
                          <div className="stat-number">
                            {users.filter(u => u.department === (dept.name || dept)).length}
                          </div>
                          <div className="stat-label">Users</div>
                        </div>
                      </div>
                      <div className="department-actions">
                        <button 
                          className="insa-btn secondary"
                        >
                          Manage
                        </button>
                        <button 
                          className="insa-btn danger"
                          onClick={() => handleRemoveDepartment(dept._id || dept)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="dashboard-content">
            <h2>⚙️ System Settings</h2>
            
            <div className="insa-card">
              <div className="settings-grid">
                <div className="settings-section">
                  <h3>SLA Configuration</h3>
                  <div className="sla-settings">
                    {Object.entries(systemSettings.slaDefaults).map(([priority, hours]) => (
                      <div key={priority} className="sla-setting">
                        <label>{priority}:</label>
                        <span>{hours} hours</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="settings-section">
                  <h3>System Preferences</h3>
                  <div className="system-settings">
                    <div className="setting">
                      <label>Auto Archive:</label>
                      <span>{systemSettings.autoArchiveDays} days</span>
                    </div>
                    <div className="setting">
                      <label>Max File Size:</label>
                      <span>{systemSettings.maxFileSize} MB</span>
                    </div>
                    <div className="setting">
                      <label>Timezone:</label>
                      <span>{systemSettings.systemTimezone}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="settings-actions">
                <button 
                  className="insa-btn primary"
                  onClick={() => setShowSettingsModal(true)}
                >
                  Edit Settings
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'analytics':
        return (
          <div className="dashboard-content">
            <h2>📈 Analytics</h2>
            
            <div className="insa-card">
              <div className="analytics-summary">
                <div className="stat-row">
                  <div className="stat-item">
                    <div className="stat-number">{analyticsData.totalUsers}</div>
                    <div className="stat-label">Total Users</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{analyticsData.activeUsers}</div>
                    <div className="stat-label">Active Users</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{analyticsData.totalForms}</div>
                    <div className="stat-label">Total Forms</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{departments.length}</div>
                    <div className="stat-label">Departments</div>
                  </div>
                </div>
              </div>
              
              <div className="analytics-charts">
                <p>Analytics charts and detailed reports would appear here.</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="dashboard-content">
            <h2>Welcome to Admin Portal</h2>
            <div className="insa-card">
              <p>Select an option from the sidebar to manage the system.</p>
            </div>
          </div>
        );
    }
  };

  // Modals
  const AddUserModal = () => (
    <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>👥 Add New User</h2>
          <button className="modal-close" onClick={() => setShowAddUserModal(false)}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              placeholder="Enter full name"
            />
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              placeholder="user@company.com"
            />
          </div>
          <div className="form-group">
            <label>Employee ID *</label>
            <input
              type="text"
              value={newUser.employeeId}
              onChange={(e) => setNewUser({...newUser, employeeId: e.target.value})}
              placeholder="EMP001"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Department</label>
              <select
                value={newUser.department}
                onChange={(e) => setNewUser({...newUser, department: e.target.value})}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept._id || dept} value={dept.name || dept}>
                    {dept.name || dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Role *</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <option value="requester">Requester</option>
                <option value="approver">Approver</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="insa-btn secondary"
            onClick={() => setShowAddUserModal(false)}
          >
            Cancel
          </button>
          <button 
            className="insa-btn primary"
            onClick={handleAddUser}
          >
            Create User
          </button>
        </div>
      </div>
    </div>
  );

  const FormBuilderModal = () => (
    <div className="modal-overlay" onClick={() => setShowFormBuilder(false)}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📋 Form Builder</h2>
          <button className="modal-close" onClick={() => setShowFormBuilder(false)}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className="form-builder">
            <div className="form-settings">
              <h3>Form Settings</h3>
              <div className="form-group">
                <label>Form Name *</label>
                <input
                  type="text"
                  value={newForm.name}
                  onChange={(e) => setNewForm({...newForm, name: e.target.value})}
                  placeholder="Enter form name"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newForm.description}
                  onChange={(e) => setNewForm({...newForm, description: e.target.value})}
                  placeholder="Describe what this form is for..."
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={newForm.category}
                    onChange={(e) => setNewForm({...newForm, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option value="Document Control">Document Control</option>
                    <option value="Training">Training</option>
                    <option value="Access Request">Access Request</option>
                    <option value="Purchase Request">Purchase Request</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Icon</label>
                  <select
                    value={newForm.icon}
                    onChange={(e) => setNewForm({...newForm, icon: e.target.value})}
                  >
                    <option value="📋">📋 Form</option>
                    <option value="📄">📄 Document</option>
                    <option value="👥">👥 Access</option>
                    <option value="💰">💰 Purchase</option>
                    <option value="🎓">🎓 Training</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="fields-builder">
              <h3>Form Fields</h3>
              {newForm.fields.length === 0 ? (
                <div className="empty-fields">
                  <p>No fields added yet</p>
                </div>
              ) : (
                <div className="fields-list">
                  {newForm.fields.map((field, index) => (
                    <div key={index} className="field-item">
                      <div className="field-header">
                        <span className="field-label">{field.label} ({field.type})</span>
                        {field.required && <span className="required-badge">Required</span>}
                      </div>
                      <button 
                        className="btn-danger btn-sm"
                        onClick={() => handleRemoveField(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="add-field-section">
                <h4>Add New Field</h4>
                <div className="field-inputs">
                  <input
                    type="text"
                    placeholder="Field label"
                    value={currentField.label}
                    onChange={(e) => setCurrentField({...currentField, label: e.target.value})}
                  />
                  <select
                    value={currentField.type}
                    onChange={(e) => setCurrentField({...currentField, type: e.target.value})}
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Text Area</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="select">Dropdown</option>
                  </select>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={currentField.required}
                      onChange={(e) => setCurrentField({...currentField, required: e.target.checked})}
                    />
                    Required
                  </label>
                  <button 
                    className="insa-btn primary"
                    onClick={handleAddField}
                  >
                    Add Field
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="insa-btn secondary"
            onClick={() => setShowFormBuilder(false)}
          >
            Cancel
          </button>
          <button 
            className="insa-btn primary"
            onClick={handleCreateForm}
          >
            Create Form
          </button>
        </div>
      </div>
    </div>
  );

  const SystemSettingsModal = () => (
    <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚙️ System Settings</h2>
          <button className="modal-close" onClick={() => setShowSettingsModal(false)}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className="settings-tabs">
            <div className="settings-section">
              <h3>SLA Configuration</h3>
              <div className="sla-settings">
                {Object.entries(systemSettings.slaDefaults).map(([priority, hours]) => (
                  <div key={priority} className="sla-setting">
                    <label>{priority}:</label>
                    <input
                      type="number"
                      value={hours}
                      onChange={(e) => setSystemSettings(prev => ({
                        ...prev,
                        slaDefaults: {...prev.slaDefaults, [priority]: parseInt(e.target.value)}
                      }))}
                    />
                    <span>hours</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <h3>System Preferences</h3>
              <div className="preference-settings">
                <div className="preference-setting">
                  <label>Auto Archive After:</label>
                  <input
                    type="number"
                    value={systemSettings.autoArchiveDays}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      autoArchiveDays: parseInt(e.target.value)
                    }))}
                  />
                  <span>days</span>
                </div>
                <div className="preference-setting">
                  <label>Max File Upload Size:</label>
                  <input
                    type="number"
                    value={systemSettings.maxFileSize}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      maxFileSize: parseInt(e.target.value)
                    }))}
                  />
                  <span>MB</span>
                </div>
                <div className="preference-setting">
                  <label>System Timezone:</label>
                  <select
                    value={systemSettings.systemTimezone}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev,
                      systemTimezone: e.target.value
                    }))}
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">EST</option>
                    <option value="PST">PST</option>
                    <option value="CET">CET</option>
                    <option value="IST">IST</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="insa-btn secondary"
            onClick={() => setShowSettingsModal(false)}
          >
            Cancel
          </button>
          <button 
            className="insa-btn primary"
            onClick={handleSaveSettings}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      {/* Modals */}
      {showAddUserModal && <AddUserModal />}
      {showFormBuilder && <FormBuilderModal />}
      {showSettingsModal && <SystemSettingsModal />}
      
      {/* Main Content */}
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;