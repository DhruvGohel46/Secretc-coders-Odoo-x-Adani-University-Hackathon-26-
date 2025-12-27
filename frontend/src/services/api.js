import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== EQUIPMENT APIs ====================

// Get all equipment with optional filters
export const getAllEquipment = (filters = {}) => 
  api.get('/equipment', { params: filters });

// Get single equipment by ID
export const getEquipmentById = (id) => 
  api.get(`/equipment/${id}`);

// Create new equipment
export const createEquipment = (equipmentData) => 
  api.post('/equipment', equipmentData);

// Update existing equipment
export const updateEquipment = (id, equipmentData) => 
  api.put(`/equipment/${id}`, equipmentData);

// Delete equipment
export const deleteEquipment = (id) => 
  api.delete(`/equipment/${id}`);

// Get maintenance requests for specific equipment
export const getEquipmentMaintenanceRequests = (equipmentId) => 
  api.get(`/equipment/${equipmentId}/requests`);

// Mark equipment as scrapped
export const scrapEquipment = (id) => 
  api.patch(`/equipment/${id}/scrap`);

// ==================== MAINTENANCE TEAM APIs ====================

// Get all maintenance teams
export const getAllTeams = () => 
  api.get('/teams');

// Get single team by ID
export const getTeamById = (id) => 
  api.get(`/teams/${id}`);

// Create new maintenance team
export const createTeam = (teamData) => 
  api.post('/teams', teamData);

// Update existing team
export const updateTeam = (id, teamData) => 
  api.put(`/teams/${id}`, teamData);

// Delete team
export const deleteTeam = (id) => 
  api.delete(`/teams/${id}`);

// Add member to team
export const addTeamMember = (teamId, memberData) => 
  api.post(`/teams/${teamId}/members`, memberData);

// Remove member from team
export const removeTeamMember = (teamId, memberId) => 
  api.delete(`/teams/${teamId}/members/${memberId}`);

// ==================== MAINTENANCE REQUEST APIs ====================

// Get all maintenance requests with optional filters
export const getAllRequests = (filters = {}) => 
  api.get('/requests', { params: filters });

// Get single request by ID
export const getRequestById = (id) => 
  api.get(`/requests/${id}`);

// Create new maintenance request
export const createRequest = (requestData) => 
  api.post('/requests', requestData);

// Update existing request
export const updateRequest = (id, requestData) => 
  api.put(`/requests/${id}`, requestData);

// Delete request
export const deleteRequest = (id) => 
  api.delete(`/requests/${id}`);

// Update request stage (New, In Progress, Repaired, Scrap)
export const updateRequestStage = (id, stage) => 
  api.patch(`/requests/${id}/stage`, { stage });

// Assign technician to request
export const assignTechnician = (requestId, technicianId) => 
  api.patch(`/requests/${requestId}/assign`, { technicianId });

// Update request duration/hours spent
export const updateRequestDuration = (id, duration) => 
  api.patch(`/requests/${id}/duration`, { duration });

// Get requests grouped by stage for Kanban board
export const getRequestsByStage = () => 
  api.get('/requests/kanban');

// Get overdue requests
export const getOverdueRequests = () => 
  api.get('/requests/overdue');

// ==================== CALENDAR APIs ====================

// Get preventive maintenance requests for calendar view
export const getPreventiveRequests = (startDate, endDate) => 
  api.get('/requests/calendar', { params: { startDate, endDate, type: 'preventive' } });

// Schedule new preventive maintenance
export const schedulePreventiveMaintenance = (scheduleData) => 
  api.post('/requests/schedule', scheduleData);

// ==================== DASHBOARD & REPORTS APIs ====================

// Get dashboard statistics
export const getDashboardStats = () => 
  api.get('/dashboard/stats');

// Get requests count by team
export const getRequestsByTeam = () => 
  api.get('/reports/by-team');

// Get requests count by equipment category
export const getRequestsByCategory = () => 
  api.get('/reports/by-category');

// Get maintenance history
export const getMaintenanceHistory = (filters = {}) => 
  api.get('/reports/history', { params: filters });

// ==================== USER/TECHNICIAN APIs ====================

// Get all technicians
export const getAllTechnicians = () => 
  api.get('/technicians');

// Get technician by ID
export const getTechnicianById = (id) => 
  api.get(`/technicians/${id}`);

// Get technician's assigned requests
export const getTechnicianRequests = (technicianId) => 
  api.get(`/technicians/${technicianId}/requests`);

// ==================== SEARCH & FILTER APIs ====================

// Search equipment by name or serial number
export const searchEquipment = (query) => 
  api.get('/equipment/search', { params: { q: query } });

// Search requests by subject or equipment
export const searchRequests = (query) => 
  api.get('/requests/search', { params: { q: query } });

// Filter equipment by department
export const getEquipmentByDepartment = (department) => 
  api.get('/equipment/department', { params: { department } });

// Filter equipment by employee
export const getEquipmentByEmployee = (employeeId) => 
  api.get('/equipment/employee', { params: { employeeId } });

export default api;
