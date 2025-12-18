import React, { useState, useEffect, createContext, useContext } from 'react';
import logo from './assets/logo.png';
import RequesterDashboard from './components/RequesterDashboard';
import ApproverDashboard from './components/ApproverDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';


// Create User Context
export const UserContext = createContext();

// API Base URL
const API_BASE = 'http://localhost:5001/api';

// Route Protection Helper
export const requireAuth = (user, requiredRole, Component) => {
  if (!user) {
    return (
      <div className="access-denied insa-card">
        <h2>🔒 Access Denied</h2>
        <p>Please login to access this page.</p>
      </div>
    );
  }
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="access-denied insa-card">
        <h2>🚫 Insufficient Permissions</h2>
        <p>Your role ({user.role}) does not have access to this page.</p>
        <p>Required role: {requiredRole}</p>
      </div>
    );
  }
  return <Component user={user} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserContext.Provider');
  }
  return context;
};

// Function to get sidebar items based on role
const getSidebarItems = (role) => {
  if (role === 'requester') {
    return [
      { id: 'notifications', label: 'Notifications', icon: '🔔' },
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'create-request', label: 'Create Request', icon: '➕' },
      { id: 'my-requests', label: 'My Requests', icon: '📋' }
    ];
  } else if (role === 'approver') {
    return [
      { id: 'notifications', label: 'Notifications', icon: '🔔' },
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'all-requests', label: 'All Requests', icon: '📄' },
      { id: 'approved', label: 'Approved Requests', icon: '✅' },
      { id: 'rejected', label: 'Rejected Requests', icon: '❌' },
      { id: 'pending', label: 'Pending Requests', icon: '⏳' }
    ];
  } else if (role === 'admin') {
    return [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'users', label: 'User Management', icon: '👥' },
      { id: 'all-requests', label: 'All Requests', icon: '📄' },
      { id: 'department', label: 'Department', icon: '🏢' },
      { id: 'settings', label: 'System Settings', icon: '⚙️' },
      { id: 'analytics', label: 'Analytics', icon: '📈' }
    ];
  }
  return [];
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [loginError, setLoginError] = useState('');
  const [activeSidebarItem, setActiveSidebarItem] = useState('dashboard');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Check backend health on app start
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${API_BASE}/health`);
        if (response.ok) {
          setBackendStatus('connected');
          console.log('✅ Backend connected successfully');
        } else {
          setBackendStatus('disconnected');
          console.log('❌ Backend connection failed');
        }
      } catch (error) {
        console.log('❌ Backend connection failed:', error.message);
        setBackendStatus('disconnected');
      }
    };

    checkBackend();
  }, []);

  // Real login function
  const loginUser = async (email, password) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      console.log('🔄 Attempting login for:', email);
      
      // For demo purposes - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo user data based on email
      const demoUsers = {
        'employee@insa.gov.et': {
          id: 1,
          name: 'Hannah',
          employeeId: 'EMP001',
          email: 'employee@insa.gov.et',
          department: 'IT Department',
          role: 'requester'
        },
        'manager@insa.gov.et': {
          id: 2,
          name: 'Selam',
          employeeId: 'EMP002',
          email: 'manager@insa.gov.et',
          department: 'Finance Department',
          role: 'approver'
        },
        'admin@insa.gov.et': {
          id: 3,
          name: 'Nahom',
          employeeId: 'EMP003',
          email: 'admin@insa.gov.et',
          department: 'HR Department',
          role: 'admin'
        }
      };

      // Check if user exists in demo data
      if (demoUsers[email] && password === 'password123') {
        const userData = demoUsers[email];
        console.log('✅ Login successful, user data:', userData);
        setCurrentUser(userData);
        localStorage.setItem('insa_user', JSON.stringify(userData));
        setActiveSidebarItem('dashboard');
        return { success: true, message: 'Login successful' };
      } else {
        console.log('❌ Login failed: Invalid credentials');
        setLoginError('Invalid email or password');
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setLoginError('Cannot connect to server. Please check if backend is running.');
      return { success: false, message: 'Connection failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // If you have a real logout endpoint, call it here
      // await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
      setShowUserDropdown(false);
      localStorage.removeItem('insa_user');
      setActiveSidebarItem('dashboard');
    }
  };

  // Demo login helper
  const demoLogin = async (role) => {
    const demoCredentials = {
      'requester': { email: 'employee@insa.gov.et', password: 'password123' },
      'approver': { email: 'manager@insa.gov.et', password: 'password123' },
      'admin': { email: 'admin@insa.gov.et', password: 'password123' }
    };

    const credentials = demoCredentials[role];
    if (credentials) {
      const result = await loginUser(credentials.email, credentials.password);
      return result;
    }
  };

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('insa_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setCurrentUser(userData);
        console.log('🔄 Restored user session:', userData);
      } catch (error) {
        console.error('Error restoring user session:', error);
        localStorage.removeItem('insa_user');
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown-container')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, logout, isLoading }}>
      <div className="App insa-theme">
        {/* Show development mode banner only in development */}
        
        

        {/* INSA Header with Logo & Dropdown */}
        <header className="insa-header">
          <div className="header-top-row">
            <div className="insa-logo-section">
              <div className="insa-logo">
                <img 
                  src={logo} 
                  alt="INSA Logo" 
                  className="insa-logo-image"
                />
              </div>
              <div className="insa-titles">
                <h1>Information Network Security Agency</h1>
                <p>Federal Democratic Republic of Ethiopia</p>
              </div>
              
              {/* User Dropdown in top-right */}
              {currentUser && (
                <div className="user-dropdown-container">
                  <button 
                    className="user-dropdown-trigger"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    
                    <span className="user-name">☰</span>
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  
                  {showUserDropdown && (
                    <div className="user-dropdown-menu">
                      <div className="dropdown-user-info">
                        <div className="dropdown-avatar">
                          {currentUser.name.charAt(0)}
                        </div>
                        <div className="dropdown-user-details">
                          <h4>{currentUser.name}</h4>
                          <p className="dropdown-user-role">{currentUser.role.toUpperCase()}</p>
                          <p className="dropdown-user-dept">{currentUser.department}</p>
                          <p className="dropdown-user-email">{currentUser.email}</p>
                        </div>
                      </div>
                      
                      <div className="dropdown-divider"></div>
                      
                      <button className="dropdown-logout" onClick={logout}>
                        <span className="logout-icon">🚪</span>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="insa-main">
          {isLoading ? (
            <div className="loading insa-card">
              <h2>🔐 Authenticating...</h2>
              <p>Please wait while we secure your connection</p>
              <div className="loading-spinner"></div>
              <p style={{marginTop: '1rem', fontSize: '0.9rem', color: '#666'}}>
                Connecting to INSA Secure Server...
              </p>
            </div>
          ) : !currentUser ? (
            <div className="user-selector insa-card">
              <h2>Approval System Access</h2>
              <p>Select your role to continue:</p>
              
              {/* Login Error Display */}
              {loginError && (
                <div className="error-message">
                  ❌ {loginError}
                </div>
              )}
              
              <div className="user-buttons">
                <button 
                  onClick={() => demoLogin('requester')} 
                  className="insa-btn primary"
                  disabled={isLoading}
                >
                  {isLoading ? '🔄 Connecting...' : '👤 Employee Access'}
                  <div className="btn-subtext">Submit requests and track status</div>
                </button>
                <button 
                  onClick={() => demoLogin('approver')} 
                  className="insa-btn secondary"
                  disabled={isLoading}
                >
                  {isLoading ? '🔄 Connecting...' : '👔 Manager Access'}
                  <div className="btn-subtext">Review and approve requests</div>
                </button>
                <button 
                  onClick={() => demoLogin('admin')} 
                  className="insa-btn admin"
                  disabled={isLoading}
                >
                  {isLoading ? '🔄 Connecting...' : '👑 Admin Access'}
                  <div className="btn-subtext">System administration and reports</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="dashboard-layout">
              {/* Sidebar - Clean version without user info */}
              <div className="insa-sidebar">
                {/* Sidebar navigation items */}
                <div className="sidebar-nav">
                  {getSidebarItems(currentUser.role).map(item => (
                    <button
                      key={item.id}
                      className={`sidebar-item ${activeSidebarItem === item.id ? 'active' : ''}`}
                      onClick={() => setActiveSidebarItem(item.id)}
                    >
                      <span className="sidebar-icon">{item.icon}</span>
                      <span className="sidebar-label">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Main content area */}
              <div className="dashboard-main-content">
                {currentUser.role === 'requester' ? (
                  <RequesterDashboard 
                    user={currentUser}
                    activeTab={activeSidebarItem}
                    sidebarItems={getSidebarItems('requester')}
                    onLogout={logout}
                  />
                ) : currentUser.role === 'approver' ? (
                  <ApproverDashboard
                    user={currentUser}
                    activeTab={activeSidebarItem}
                    sidebarItems={getSidebarItems('approver')}
                    onLogout={logout}
                  />
                ) : currentUser.role === 'admin' ? (
                  <AdminDashboard
                    user={currentUser}
                    activeTab={activeSidebarItem}
                    sidebarItems={getSidebarItems('admin')}
                    onLogout={logout}
                  />
                ) : (
                  <div className="insa-card">
                    <h2>Unknown User Role</h2>
                    <p>Your role ({currentUser.role}) is not recognized.</p>
                    <button onClick={logout} className="insa-btn primary">
                      Switch User
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </UserContext.Provider>
  );
}

export default App;