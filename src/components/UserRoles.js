// User roles and permissions
export const UserRoles = {
    REQUESTER: 'requester',
    APPROVER: 'approver', 
    ADMIN: 'admin'
  };
  
  // Mock user data - in real app, this comes from backend
  export const mockUsers = {
    'user123': { id: 'user123', name: 'John Doe', role: UserRoles.REQUESTER, department: 'Sales' },
    'manager456': { id: 'manager456', name: 'Jane Smith', role: UserRoles.APPROVER, department: 'Sales' },
    'admin789': { id: 'admin789', name: 'Admin User', role: UserRoles.ADMIN, department: 'IT' }
  };
  
  // Permissions for each role
  export const Permissions = {
    [UserRoles.REQUESTER]: [
      'view_my_requests',
      'create_requests',
      'view_request_status'
    ],
    [UserRoles.APPROVER]: [
      'view_my_requests',
      'create_requests', 
      'view_request_status',
      'approve_requests',
      'view_pending_approvals',
      'view_team_requests'
    ],
    [UserRoles.ADMIN]: [
      'view_my_requests',
      'create_requests',
      'view_request_status',
      'approve_requests', 
      'view_pending_approvals',
      'view_team_requests',
      'view_all_requests',
      'manage_users',
      'view_analytics',
      'system_config'
    ]
  };