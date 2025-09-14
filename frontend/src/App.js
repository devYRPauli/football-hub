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
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const location = useLocation();

  // Effect to apply the current theme to the body and save it to localStorage
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
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

