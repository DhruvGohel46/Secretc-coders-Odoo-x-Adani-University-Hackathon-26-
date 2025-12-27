import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faTools,
  faUser,
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faSave,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { getRequestById, updateRequest } from '../../services/api';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/helpers';
import './RequestDetail.css';

const RequestDetail = ({ requestId, onClose, onUpdate }) => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    durationHours: '',
    technicianId: ''
  });

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await getRequestById(requestId);
      setRequest(response.data);
      setFormData({
        status: response.data.status,
        durationHours: response.data.durationHours || '',
        technicianId: response.data.technicianId || ''
      });
    } catch (error) {
      console.error('Error fetching request:', error);
      toast.error('Failed to load request');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    setFormData(prev => ({ ...prev, status: newStatus }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        status: formData.status
      };

      if (formData.status === 'REPAIRED' && formData.durationHours) {
        payload.durationHours = parseFloat(formData.durationHours);
      }

      await updateRequest(requestId, payload);
      toast.success('Request updated successfully');
      setEditing(false);
      fetchRequest();
      onUpdate?.();
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error(error.response?.data?.error || 'Failed to update request');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'NEW': '#3b82f6',
      'IN_PROGRESS': '#f59e0b',
      'REPAIRED': '#10b981',
      'SCRAP': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'NEW': faTools,
      'IN_PROGRESS': faClock,
      'REPAIRED': faCheckCircle,
      'SCRAP': faExclamationTriangle
    };
    return icons[status] || faTools;
  };

  if (loading) {
    return (
      <motion.div
        className="request-detail-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="loading-spinner" onClick={e => e.stopPropagation()}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <FontAwesomeIcon icon={faTools} size="2x" />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (!request) {
    return null;
  }

  const statusFlow = ['NEW', 'IN_PROGRESS', 'REPAIRED', 'SCRAP'];
  const currentStatusIndex = statusFlow.indexOf(request.status);

  return (
    <motion.div
      className="request-detail-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="request-detail"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="detail-header">
          <div className="header-content">
            <h2>Request #{request.id}</h2>
            <p className="request-subject">{request.subject}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="detail-content">
          {/* Status Flow */}
          <motion.div className="status-section" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3>Status Workflow</h3>
            <div className="status-flow">
              {statusFlow.map((status, index) => (
                <motion.div
                  key={status}
                  className={`status-step ${status === request.status ? 'active' : ''} ${index <= currentStatusIndex ? 'completed' : ''}`}
                  whileHover={{ scale: 1.05 }}
                >
                  <button
                    type="button"
                    onClick={() => !editing && handleStatusChange(status)}
                    disabled={editing && status !== request.status}
                  >
                    <FontAwesomeIcon icon={getStatusIcon(status)} />
                  </button>
                  <span>{status}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Equipment Info */}
          <motion.div className="info-section" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h3>Equipment</h3>
            <div className="info-card">
              <div className="info-row">
                <label>Name</label>
                <div className="info-value">
                  <FontAwesomeIcon icon={faTools} />
                  {request.equipment?.name}
                </div>
              </div>
              {request.equipment?.serialNumber && (
                <div className="info-row">
                  <label>Serial Number</label>
                  <div className="info-value">{request.equipment.serialNumber}</div>
                </div>
              )}
              {request.equipment?.category && (
                <div className="info-row">
                  <label>Category</label>
                  <div className="info-value">{request.equipment.category}</div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Team & Technician Info */}
          <motion.div className="info-section" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3>Team & Technician</h3>
            <div className="info-card">
              <div className="info-row">
                <label>Maintenance Team</label>
                <div className="info-value">{request.team?.name || 'Unassigned'}</div>
              </div>
              <div className="info-row">
                <label>Assigned Technician</label>
                {editing ? (
                  <input
                    type="text"
                    name="technicianId"
                    value={formData.technicianId}
                    onChange={handleInputChange}
                    placeholder="Technician ID"
                    className="edit-input"
                  />
                ) : (
                  <div className="info-value">
                    {request.technician ? (
                      <>
                        <FontAwesomeIcon icon={faUser} />
                        {request.technician.name}
                      </>
                    ) : (
                      <span className="unassigned">Unassigned</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Request Details */}
          <motion.div className="info-section" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3>Request Details</h3>
            <div className="info-card">
              <div className="info-row">
                <label>Type</label>
                <div className="info-value">
                  {request.type === 'PREVENTIVE' ? '📅 Preventive' : '🔧 Corrective'}
                </div>
              </div>
              <div className="info-row">
                <label>Created</label>
                <div className="info-value">
                  <FontAwesomeIcon icon={faClock} />
                  {formatDate(request.createdAt)}
                </div>
              </div>
              {request.scheduledDate && (
                <div className="info-row">
                  <label>Scheduled Date</label>
                  <div className="info-value">
                    <FontAwesomeIcon icon={faClock} />
                    {formatDate(request.scheduledDate)}
                  </div>
                </div>
              )}
              {request.isOverdue && (
                <div className="info-row overdue">
                  <label>⚠️ Status</label>
                  <div className="info-value">Overdue</div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Duration (for Repaired status) */}
          {request.status === 'REPAIRED' || editing && formData.status === 'REPAIRED' ? (
            <motion.div className="info-section" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h3>Duration</h3>
              <div className="info-card">
                {editing ? (
                  <div className="duration-input">
                    <input
                      type="number"
                      name="durationHours"
                      value={formData.durationHours}
                      onChange={handleInputChange}
                      placeholder="Hours"
                      min="0"
                      step="0.5"
                      className="edit-input"
                    />
                    <span>hours</span>
                  </div>
                ) : (
                  <div className="info-value">
                    <FontAwesomeIcon icon={faClock} />
                    {request.durationHours || 0} hours
                  </div>
                )}
              </div>
            </motion.div>
          ) : null}
        </div>

        <motion.div className="detail-actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          {!editing ? (
            <>
              <button className="edit-btn" onClick={() => setEditing(true)}>
                <FontAwesomeIcon icon={faSave} />
                Edit
              </button>
              <button className="close-btn" onClick={onClose}>
                <FontAwesomeIcon icon={faTimes} />
                Close
              </button>
            </>
          ) : (
            <>
              <button className="save-btn" onClick={handleSave}>
                <FontAwesomeIcon icon={faSave} />
                Save Changes
              </button>
              <button className="cancel-btn" onClick={() => setEditing(false)}>
                <FontAwesomeIcon icon={faTimes} />
                Cancel
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default RequestDetail;
