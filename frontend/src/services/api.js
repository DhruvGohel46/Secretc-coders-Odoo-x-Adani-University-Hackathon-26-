import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

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

// ==================== AUTHENTICATION APIs ====================

// Register a new user
export const registerUser = (userData) => 
  api.post('/auth/register', userData);

// Login user
export const loginUser = (credentials) => 
  api.post('/auth/login', credentials);

// Get current user info
export const getCurrentUser = () => 
  api.get('/auth/me');

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
  api.patch(`/requests/${id}/status`, { status: stage });

// Assign technician to request
export const assignTechnician = (requestId, technicianId) => 
  api.patch(`/requests/${requestId}/assign`, { technicianId });

// Update request duration/hours spent
export const updateRequestDuration = (id, durationHours) => 
  api.patch(`/requests/${id}/status`, { durationHours });

// Get requests grouped by stage for Kanban board
export const getRequestsByStage = () => {
  // Since backend doesn't have a dedicated kanban endpoint, fetch all and process in component
  return api.get('/requests');
};

// Get overdue requests
export const getOverdueRequests = () => 
  api.get('/requests', { params: { overdue: '1' } });

// ==================== CALENDAR APIs ====================

// Get preventive maintenance requests for calendar view
export const getPreventiveRequests = (startDate, endDate) => 
  api.get('/requests', { params: { calendar: '1' } });

// Schedule new preventive maintenance
export const schedulePreventiveMaintenance = (scheduleData) => 
  api.patch(`/requests/${scheduleData.id}/schedule`, { scheduledDate: scheduleData.scheduledDate });

// ==================== DASHBOARD & REPORTS APIs ====================

// Get dashboard statistics - calculated from requests and teams
export const getDashboardStats = async () => {
  const [requestsRes, teamsRes] = await Promise.all([
    api.get('/requests'),
    api.get('/teams')
  ]);
  
  const requests = requestsRes.data;
  const stats = {
    totalRequests: requests.length,
    inProgress: requests.filter(r => r.status === 'IN_PROGRESS').length,
    completed: requests.filter(r => r.status === 'REPAIRED').length,
    overdue: requests.filter(r => r.isOverdue).length
  };
  
  return { data: stats };
};

// Get requests count by team
export const getRequestsByTeam = async () => {
  const res = await api.get('/requests');
  const requests = res.data;
  
  const teamMap = {};
  requests.forEach(req => {
    if (req.team) {
      teamMap[req.team.id] = (teamMap[req.team.id] || 0) + 1;
    }
  });
  
  const result = Object.entries(teamMap).map(([teamId, count]) => ({
    teamId: parseInt(teamId),
    count
  }));
  
  return { data: result };
};

// Get requests count by equipment category
export const getRequestsByCategory = async () => {
  const res = await api.get('/requests');
  const requests = res.data;
  
  const categoryMap = {};
  requests.forEach(req => {
    const category = req.equipmentCategory || 'Unknown';
    categoryMap[category] = (categoryMap[category] || 0) + 1;
  });
  
  const result = Object.entries(categoryMap).map(([category, count]) => ({
    category,
    count
  }));
  
  return { data: result };
};

// Get maintenance history
export const getMaintenanceHistory = (filters = {}) => 
  api.get('/requests', { params: filters });

// ==================== USER/TECHNICIAN APIs ====================

// Get all technicians - using users endpoint
export const getAllTechnicians = async () => {
  const res = await api.get('/users');
  // Filter for technicians only if role field exists
  return { data: res.data };
};

// Get technician by ID
export const getTechnicianById = (id) => 
  api.get(`/users/${id}`);

// Get technician's assigned requests
export const getTechnicianRequests = (technicianId) => 
  api.get('/requests', { params: { technicianId } });

// ==================== SEARCH & FILTER APIs ====================

// Search equipment by name or serial number
export const searchEquipment = async (query) => {
  const res = await api.get('/equipment');
  const allEquipment = res.data;
  
  const filtered = allEquipment.filter(eq => 
    eq.name?.toLowerCase().includes(query.toLowerCase()) ||
    eq.serialNumber?.toLowerCase().includes(query.toLowerCase())
  );
  
  return { data: filtered };
};

// Search requests by subject or equipment
export const searchRequests = async (query) => {
  const res = await api.get('/requests');
  const allRequests = res.data;
  
  const filtered = allRequests.filter(req =>
    req.subject?.toLowerCase().includes(query.toLowerCase()) ||
    req.equipment?.name?.toLowerCase().includes(query.toLowerCase())
  );
  
  return { data: filtered };
};

// Filter equipment by department
export const getEquipmentByDepartment = (departmentId) => 
  api.get('/equipment', { params: { departmentId } });

// Filter equipment by employee
export const getEquipmentByEmployee = (employeeId) => 
  api.get('/equipment', { params: { employeeId } });

export default api;
