// --- React and Router Imports ---
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// --- Component & Style Imports ---
import Home from './views/Home';
import LeagueView from './views/LeagueView';
import './App.css'; 

// --- Main App Component ---
function App() {
  // State for managing the application's theme (light/dark)
  // Safely access localStorage with fallback for private browsing mode
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch (error) {
      console.warn('localStorage not available, using default theme:', error);
      return 'dark';
    }
  });
  const location = useLocation();

  // Effect to apply the current theme to the body and save it to localStorage
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [theme]);

  // Effect to apply special styling attributes based on the current route
  useEffect(() => {
    const routeType = location.pathname === '/' ? 'home' : 'app';
    document.body.setAttribute('data-route', routeType);
  }, [location]);

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="App">
      {/* The header has been completely removed from the application */}

      {/* --- Main Application Routing --- */}
      <Routes>
        <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/league/:leagueCode/:view" element={<LeagueView />} />
        {/* Redirect any unknown paths to the home page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;

