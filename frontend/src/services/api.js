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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== 1. HEALTH & SYSTEM APIs ====================

// GET /health
export const checkHealth = () => api.get('/health');

// ==================== 2. AUTHENTICATION & USERS APIs ====================

// POST /auth/register
export const registerUser = (userData) => 
  api.post('/auth/register', userData);

// POST /auth/login
export const loginUser = (credentials) => 
  api.post('/auth/login', credentials);

// GET /auth/me
export const getCurrentUser = () => 
  api.get('/auth/me');

// GET /users (ADMIN / MANAGER only)
export const getAllUsers = () => 
  api.get('/users');

// ==================== 3. DEPARTMENTS APIs ====================

// POST /departments
export const createDepartment = (departmentData) => 
  api.post('/departments', departmentData);

// GET /departments
export const getAllDepartments = () => 
  api.get('/departments');

// ==================== 4. MAINTENANCE TEAMS APIs ====================

// POST /teams
export const createTeam = (teamData) => 
  api.post('/teams', teamData);

// GET /teams
export const getAllTeams = () => 
  api.get('/teams');

// POST /teams/{teamId}/members
export const addTeamMember = (teamId, memberData) => 
  api.post(`/teams/${teamId}/members`, memberData);

// DELETE /teams/{teamId}/members/{userId}
export const removeTeamMember = (teamId, userId) => 
  api.delete(`/teams/${teamId}/members/${userId}`);

// GET /teams/{teamId}/validate/{userId}
export const validateTeamMember = (teamId, userId) => 
  api.get(`/teams/${teamId}/validate/${userId}`);

// ==================== 5. EQUIPMENT MANAGEMENT APIs ====================

// POST /equipment
export const createEquipment = (equipmentData) => 
  api.post('/equipment', equipmentData);

// GET /equipment (filters: teamId, archived)
export const getAllEquipment = (filters = {}) => 
  api.get('/equipment', { params: filters });

// GET /equipment/{equipmentId}
export const getEquipmentById = (id) => 
  api.get(`/equipment/${id}`);

// PATCH /equipment/{equipmentId}
export const updateEquipment = (id, equipmentData) => 
  api.patch(`/equipment/${id}`, equipmentData);

// PATCH /equipment/{equipmentId}/archive
export const archiveEquipment = (id, archived) => 
  api.patch(`/equipment/${id}/archive`, { archived });

// GET /equipment/{equipmentId}/maintenance-count
export const getEquipmentMaintenanceCount = (equipmentId) => 
  api.get(`/equipment/${equipmentId}/maintenance-count`);

// GET /equipment/{equipmentId}/requests
export const getEquipmentRequests = (equipmentId) => 
  api.get(`/equipment/${equipmentId}/requests`);

// ==================== 6. MAINTENANCE REQUESTS APIs ====================

// POST /requests
export const createRequest = (requestData) => 
  api.post('/requests', requestData);

// GET /requests (filters: teamId, technicianId, calendar, overdue)
export const getAllRequests = (filters = {}) => 
  api.get('/requests', { params: filters });

// GET /requests?calendar=1
export const getCalendarRequests = () => 
  api.get('/requests', { params: { calendar: '1' } });

// GET /requests?overdue=1
export const getOverdueRequests = () => 
  api.get('/requests', { params: { overdue: '1' } });

// GET /requests?teamId={id}
// If no teamId provided, returns all requests (for dashboard stats)
export const getRequestsByTeam = (teamId) => {
  const params = teamId ? { teamId } : {};
  return api.get('/requests', { params });
};

// GET /requests?technicianId={id}
export const getRequestsByTechnician = (technicianId) => 
  api.get('/requests', { params: { technicianId } });

// PATCH /requests/{requestId}/assign
export const assignRequest = (requestId, technicianId) => 
  api.patch(`/requests/${requestId}/assign`, { technicianId });

// PATCH /requests/{requestId}/status
export const updateRequestStatus = (requestId, status, durationHours) => 
  api.patch(`/requests/${requestId}/status`, { status, durationHours });

// PATCH /requests/{requestId}/schedule
export const scheduleRequest = (requestId, scheduledDate) => 
  api.patch(`/requests/${requestId}/schedule`, { scheduledDate });

// ==================== HELPER FUNCTIONS ====================

// Get preventive requests (alias for calendar requests)
export const getPreventiveRequests = (startDate, endDate) => 
  getCalendarRequests();

// Get equipment maintenance requests (alias)
export const getEquipmentMaintenanceRequests = (equipmentId) => 
  getEquipmentRequests(equipmentId);

// Get requests by stage (for Kanban board)
export const getRequestsByStage = () => 
  getAllRequests();

// Update request stage (alias for updateRequestStatus)
export const updateRequestStage = (requestId, status) => 
  updateRequestStatus(requestId, status);

// Get all technicians (filter users by role)
export const getAllTechnicians = async () => {
  const res = await getAllUsers();
  const technicians = res.data.filter(user => 
    user.role === 'TECHNICIAN' || user.role === 'ADMIN' || user.role === 'MANAGER'
  );
  return { data: technicians };
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  const [requestsRes, teamsRes] = await Promise.all([
    getAllRequests(),
    getAllTeams()
  ]);
  
  const requests = requestsRes.data;
  const stats = {
    totalRequests: requests.length,
    inProgress: requests.filter(r => r.status === 'IN_PROGRESS').length,
    completed: requests.filter(r => r.status === 'REPAIRED').length,
    overdue: requests.filter(r => r.isOverdue).length,
    totalTeams: teamsRes.data.length
  };
  
  return { data: stats };
};

// Update team (Note: Backend doesn't have PATCH /teams/:id, so this is a placeholder)
// Teams can only be created, not updated via API
export const updateTeam = async (teamId, teamData) => {
  // Since backend doesn't support team updates, we'll just return an error
  throw new Error('Team updates are not supported by the backend API');
};

export default api;
