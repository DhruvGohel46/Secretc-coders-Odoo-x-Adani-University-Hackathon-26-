import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';

// Role-based Dashboards
import DashboardRouter from './components/Dashboard/DashboardRouter';

// Common Pages
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import EquipmentList from './components/Equipment/EquipmentList';
import TeamList from './components/Team/TeamList';
import MaintenanceCalendar from './components/Calendar/MaintenanceCalendar';
import RequestsList from './pages/RequestsList';
import UsersList from './pages/UsersList';
import DepartmentsList from './pages/DepartmentsList';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className={`app ${darkMode ? 'dark' : ''}`}>
                  <Navbar 
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
                    toggleTheme={toggleTheme}
                    darkMode={darkMode}
                  />
                  
                  <div className="app-container">
                    {sidebarOpen && <Sidebar />}

                    <main 
                      className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
                    >
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        
                        {/* Role-based Dashboard Routes */}
                        <Route 
                          path="/dashboard" 
                          element={
                            <ProtectedRoute>
                              <DashboardRouter />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Common Routes */}
                        <Route path="/kanban" element={<KanbanBoard />} />
                        <Route path="/requests" element={<RequestsList />} />
                        <Route path="/equipment" element={<EquipmentList />} />
                        <Route path="/teams" element={<TeamList />} />
                        <Route path="/calendar" element={<MaintenanceCalendar />} />
                        
                        {/* Admin/Manager Only Routes */}
                        <Route 
                          path="/departments" 
                          element={
                            <ProtectedRoute requirePrivileged>
                              <DepartmentsList />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/users" 
                          element={
                            <ProtectedRoute requirePrivileged>
                              <UsersList />
                            </ProtectedRoute>
                          } 
                        />
                      </Routes>
                    </main>
                  </div>

                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme={darkMode ? 'dark' : 'light'}
                  />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

