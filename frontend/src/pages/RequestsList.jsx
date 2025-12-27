import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllRequests, updateRequestStatus, assignRequest, scheduleRequest, getAllTeams, getAllUsers } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Common/Modal';
import './ListPages.css';

const RequestsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    teamId: searchParams.get('teamId') || '',
    technicianId: searchParams.get('technicianId') || '',
    status: searchParams.get('status') || '',
    type: searchParams.get('type') || '',
    overdue: searchParams.get('overdue') === '1',
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [statusData, setStatusData] = useState({ status: '', durationHours: '' });
  const [scheduleDate, setScheduleDate] = useState('');
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const { user, isPrivileged } = useAuth();

  useEffect(() => {
    loadRequests();
    loadTeams();
    if (isPrivileged()) {
      loadUsers();
    }
  }, [filters, isPrivileged]);

  const loadTeams = async () => {
    try {
      const response = await getAllTeams();
      setTeams(response.data);
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadRequests = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.teamId) params.teamId = filters.teamId;
      if (filters.technicianId) params.technicianId = filters.technicianId;
      if (filters.status) params.status = filters.status;
      if (filters.type) params.type = filters.type;
      if (filters.overdue) params.overdue = '1';

      const response = await getAllRequests(params);
      setRequests(response.data);
    } catch (error) {
      toast.error('Failed to load requests');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await updateRequestStatus(
        selectedRequest.id,
        statusData.status,
        statusData.status === 'REPAIRED' ? parseFloat(statusData.durationHours) : undefined
      );
      toast.success('Request status updated');
      setShowStatusModal(false);
      setSelectedRequest(null);
      setStatusData({ status: '', durationHours: '' });
      loadRequests();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update status');
    }
  };

  const handleAssign = async (technicianId) => {
    try {
      await assignRequest(selectedRequest.id, technicianId);
      toast.success('Technician assigned');
      setShowAssignModal(false);
      setSelectedRequest(null);
      loadRequests();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to assign technician');
    }
  };

  const handleSchedule = async () => {
    if (!scheduleDate) {
      toast.error('Please select a date and time');
      return;
    }
    try {
      await scheduleRequest(selectedRequest.id, scheduleDate);
      toast.success('Request scheduled successfully');
      setShowScheduleModal(false);
      setSelectedRequest(null);
      setScheduleDate('');
      loadRequests();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to schedule request');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'NEW':
        return 'badge-new';
      case 'IN_PROGRESS':
        return 'badge-progress';
      case 'REPAIRED':
        return 'badge-success';
      case 'SCRAP':
        return 'badge-danger';
      default:
        return 'badge-default';
    }
  };

  const getTypeBadgeClass = (type) => {
    return type === 'PREVENTIVE' ? 'badge-info' : 'badge-warning';
  };

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
          <h1>Maintenance Requests</h1>
          <p>View and manage all maintenance requests</p>
        </div>
      </div>

      <div className="filters-container">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          <option value="NEW">New</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="REPAIRED">Repaired</option>
          <option value="SCRAP">Scrap</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="CORRECTIVE">Corrective</option>
          <option value="PREVENTIVE">Preventive</option>
        </select>

        {isPrivileged() && (
          <select
            value={filters.teamId}
            onChange={(e) => setFilters({ ...filters, teamId: e.target.value })}
            className="filter-select"
          >
            <option value="">All Teams</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        )}

        {isPrivileged() && (
          <select
            value={filters.technicianId}
            onChange={(e) => setFilters({ ...filters, technicianId: e.target.value })}
            className="filter-select"
          >
            <option value="">All Technicians</option>
            {users.filter(u => u.role === 'TECHNICIAN' || u.role === 'ADMIN' || u.role === 'MANAGER').map(tech => (
              <option key={tech.id} value={tech.id}>{tech.name}</option>
            ))}
          </select>
        )}

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.overdue}
            onChange={(e) => setFilters({ ...filters, overdue: e.target.checked })}
          />
          Overdue Only
        </label>

        <button className="btn-secondary" onClick={() => setFilters({
          teamId: '',
          technicianId: '',
          status: '',
          type: '',
          overdue: false,
        })}>
          Clear Filters
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Equipment</th>
              <th>Type</th>
              <th>Status</th>
              <th>Team</th>
              <th>Technician</th>
              <th>Scheduled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="9" className="empty-state">
                  No requests found
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id} className={request.isOverdue ? 'row-overdue' : ''}>
                  <td>{request.id}</td>
                  <td>
                    <strong>{request.subject}</strong>
                  </td>
                  <td>{request.equipment?.name || 'N/A'}</td>
                  <td>
                    <span className={`badge ${getTypeBadgeClass(request.type)}`}>
                      {request.type}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>{request.team?.name || 'N/A'}</td>
                  <td>{request.technician?.name || 'Unassigned'}</td>
                  <td>
                    {request.scheduledDate
                      ? new Date(request.scheduledDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-sm btn-primary"
                        onClick={() => {
                          setSelectedRequest(request);
                          setStatusData({ status: request.status, durationHours: '' });
                          setShowStatusModal(true);
                        }}
                      >
                        Status
                      </button>
                      {request.type === 'PREVENTIVE' && (
                        <button
                          className="btn-sm btn-info"
                          onClick={() => {
                            setSelectedRequest(request);
                            setScheduleDate(request.scheduledDate ? new Date(request.scheduledDate).toISOString().slice(0, 16) : '');
                            setShowScheduleModal(true);
                          }}
                        >
                          Schedule
                        </button>
                      )}
                      {isPrivileged() && (
                        <button
                          className="btn-sm btn-secondary"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowAssignModal(true);
                          }}
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedRequest(null);
          setStatusData({ status: '', durationHours: '' });
        }}
        title="Update Request Status"
      >
        {selectedRequest && (
          <div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={statusData.status}
                onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
                className="form-control"
              >
                <option value="NEW">New</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REPAIRED">Repaired</option>
                <option value="SCRAP">Scrap</option>
              </select>
            </div>
            {statusData.status === 'REPAIRED' && (
              <div className="form-group">
                <label>Duration (Hours)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={statusData.durationHours}
                  onChange={(e) => setStatusData({ ...statusData, durationHours: e.target.value })}
                  placeholder="Enter duration in hours"
                  required
                  className="form-control"
                />
              </div>
            )}
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedRequest(null);
                  setStatusData({ status: '', durationHours: '' });
                }}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleStatusUpdate}>
                Update
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Schedule Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setSelectedRequest(null);
          setScheduleDate('');
        }}
        title="Schedule Request"
      >
        {selectedRequest && (
          <div>
            <div className="form-group">
              <label>Scheduled Date & Time *</label>
              <input
                type="datetime-local"
                className="form-control"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                required
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowScheduleModal(false);
                  setSelectedRequest(null);
                  setScheduleDate('');
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSchedule}
              >
                Schedule
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedRequest(null);
          setSelectedTechnician('');
        }}
        title="Assign Technician"
      >
        {selectedRequest && (
          <div>
            <div className="form-group">
              <label>Select Technician *</label>
              <select
                className="form-control"
                value={selectedTechnician}
                onChange={(e) => setSelectedTechnician(e.target.value)}
                required
              >
                <option value="">Select a technician</option>
                {users.filter(u => u.role === 'TECHNICIAN' || u.role === 'ADMIN' || u.role === 'MANAGER').map(tech => (
                  <option key={tech.id} value={tech.id}>{tech.name} ({tech.role})</option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedRequest(null);
                  setSelectedTechnician('');
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  if (selectedTechnician) {
                    handleAssign(parseInt(selectedTechnician));
                  } else {
                    toast.error('Please select a technician');
                  }
                }}
              >
                Assign
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RequestsList;

