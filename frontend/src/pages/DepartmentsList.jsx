import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllDepartments, createDepartment } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Common/Modal';
import './ListPages.css';

const DepartmentsList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [submitting, setSubmitting] = useState(false);
  const { isPrivileged } = useAuth();

  useEffect(() => {
    if (isPrivileged()) {
      loadDepartments();
    }
  }, [isPrivileged]);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const response = await getAllDepartments();
      setDepartments(response.data);
    } catch (error) {
      toast.error('Failed to load departments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Department name is required');
      return;
    }

    try {
      setSubmitting(true);
      await createDepartment({ name: formData.name.trim() });
      toast.success('Department created successfully');
      setShowModal(false);
      setFormData({ name: '' });
      loadDepartments();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create department');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Departments</h1>
          <p>Manage organizational departments</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Department
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-state">
                  No departments found. Create one to get started.
                </td>
              </tr>
            ) : (
              departments.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.id}</td>
                  <td>
                    <strong>{dept.name}</strong>
                  </td>
                  <td>{new Date(dept.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setFormData({ name: '' });
        }}
        title="Create Department"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Department Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder="Enter department name"
              required
              autoFocus
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setShowModal(false);
                setFormData({ name: '' });
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentsList;

