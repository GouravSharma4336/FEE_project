import React, { useState, useEffect } from 'react';
// Core React imports: useState for state, useEffect for side-effects and event listeners

import { Link, NavLink } from 'react-router-dom';
// Link for logo; NavLink automatically applies active styling to current navigation item

import { FaBullseye, FaSun, FaMoon, FaUser } from 'react-icons/fa';
// FontAwesome icons for logo, theme toggle, and user avatar

export default function Navbar() {
  // Theme state: reads saved theme ('dark' or 'light') from localStorage, defaults to 'dark'
  const [theme, setTheme] = useState(() => localStorage.getItem('quizmaster_theme') || 'dark');
  
  // User state: reads logged-in user details from localStorage
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('quizmaster_user') || 'null'));

  // Applies data-theme attribute to <html> element whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('quizmaster_theme', theme);
  }, [theme]);

  // Listens for localStorage changes to keep login state synchronized
  useEffect(() => {
    const handleStorage = () => {
      setUser(JSON.parse(localStorage.getItem('quizmaster_user') || 'null'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Toggles between dark and light theme
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Logs out user by clearing storage and resetting state
  const handleLogout = () => {
    localStorage.removeItem('quizmaster_user');
    setUser(null);
  };

  return (
    <header>
      <nav className="navbar">
        {/* Brand logo that links to home */}
        <Link to="/" className="logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <FaBullseye style={{ color: 'var(--primary)' }} /> Quiz<span>Master</span>
        </Link>

        {/* Navigation links with active route indicator */}
        <ul className="nav-links">
          <li><NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink></li>
          <li><NavLink to="/prepare" className={({ isActive }) => (isActive ? 'active' : '')}>Study Notes</NavLink></li>
          <li><NavLink to="/quiz" className={({ isActive }) => (isActive ? 'active' : '')}>Start Quiz</NavLink></li>
          <li><NavLink to="/leaderboard" className={({ isActive }) => (isActive ? 'active' : '')}>Leaderboard</NavLink></li>
          <li><NavLink to="/history" className={({ isActive }) => (isActive ? 'active' : '')}>History</NavLink></li>
        </ul>

        {/* Right side actions: theme switcher and student login status */}
        <div className="nav-actions">
          {/* Theme toggle button */}
          <button type="button" className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {theme === 'dark' ? <FaSun style={{ color: '#f59e0b' }} /> : <FaMoon style={{ color: '#8b5cf6' }} />}
          </button>

          {/* User profile / Login button container */}
          <div id="authNavContainer">
            {user && user.name ? (
              // Displayed when user is logged in
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <FaUser /> {user.name}
                </span>
                <button type="button" onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
              </div>
            ) : (
              // Displayed when user is not logged in
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
