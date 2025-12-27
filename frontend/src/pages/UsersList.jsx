import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllUsers } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './ListPages.css';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isPrivileged } = useAuth();

  useEffect(() => {
    if (isPrivileged()) {
      loadUsers();
    }
  }, [isPrivileged]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isPrivileged()) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h2>Access Denied</h2>
          <p>You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'badge-admin';
      case 'MANAGER':
        return 'badge-manager';
      case 'TECHNICIAN':
        return 'badge-technician';
      default:
        return 'badge-user';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Users Management</h1>
        <p>Manage system users and their roles</p>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    <div className="user-info">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="avatar" />
                      ) : (
                        <div className="avatar-placeholder">{user.name.charAt(0)}</div>
                      )}
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email || 'N/A'}</td>
                  <td>
                    <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;

