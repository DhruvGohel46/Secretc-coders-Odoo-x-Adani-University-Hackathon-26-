import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Layout Components
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';

// Page Components
import Dashboard from './components/Dashboard/Dashboard';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import EquipmentList from './components/Equipment/EquipmentList';
import TeamList from './components/Team/TeamList';
import MaintenanceCalendar from './components/Calendar/MaintenanceCalendar';
import LightRays from './LightRays';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      toast.success('Dark mode enabled', {
        position: 'bottom-right',
        autoClose: 2000,
      });
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      toast.success('Light mode enabled', {
        position: 'bottom-right',
        autoClose: 2000,
      });
    }
  };

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className={`app ${darkMode ? 'dark' : ''}`}>
        {/* Full-page background with LightRays */}
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          background: darkMode ? '#1a1a1a' : '#ffffff'
        }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#00d4ff"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.08}
            distortion={0.05}
            className="app-background-rays"
          />
        </div>

        {/* All website content wrapped with z-index above background */}
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', width: '100%' }}>
        {/* Navigation Bar */}
        <Navbar 
          toggleSidebar={toggleSidebar} 
          toggleTheme={toggleTheme}
          darkMode={darkMode}
        />
        
        {/* Main Container */}
        <div className="app-container">
          {/* Sidebar with Animation */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30 
                }}
              >
                <Sidebar />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Area */}
          <motion.main 
            className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
            layout
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
          >
            <Routes>
              {/* Default Route */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Dashboard Route */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Kanban Board Route */}
              <Route path="/kanban" element={<KanbanBoard />} />
              
              {/* Equipment Management Route */}
              <Route path="/equipment" element={<EquipmentList />} />
              
              {/* Team Management Route */}
              <Route path="/teams" element={<TeamList />} />
              
              {/* Calendar Route */}
              <Route path="/calendar" element={<MaintenanceCalendar />} />
              
              {/* 404 Not Found Route */}
              <Route 
                path="*" 
                element={
                  <motion.div 
                    className="not-found"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                  </motion.div>
                } 
              />
            </Routes>
          </motion.main>
        </div>

        {/* Toast Notifications Container */}
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
          limit={3}
        />
        </div>
      </div>
    </Router>
  );
}

export default App;
