import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBullseye, FaSun, FaMoon, FaUser } from 'react-icons/fa';

export default function Navbar() {
  const [theme, setTheme] = useState(() => localStorage.getItem('quizmaster_theme') || 'dark');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('quizmaster_user') || 'null'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('quizmaster_theme', theme);
  }, [theme]);

  // Keep user updated if localStorage changes
  useEffect(() => {
    const handleStorage = () => {
      setUser(JSON.parse(localStorage.getItem('quizmaster_user') || 'null'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    localStorage.removeItem('quizmaster_user');
    setUser(null);
  };

  return (
    <header>
      <nav className="navbar">
        <Link to="/" className="logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <FaBullseye style={{ color: 'var(--primary)' }} /> Quiz<span>Master</span>
        </Link>
        <ul className="nav-links">
          <li><NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink></li>
          <li><NavLink to="/prepare" className={({ isActive }) => (isActive ? 'active' : '')}>Study Notes</NavLink></li>
          <li><NavLink to="/quiz" className={({ isActive }) => (isActive ? 'active' : '')}>Start Quiz</NavLink></li>
          <li><NavLink to="/leaderboard" className={({ isActive }) => (isActive ? 'active' : '')}>Leaderboard</NavLink></li>
          <li><NavLink to="/history" className={({ isActive }) => (isActive ? 'active' : '')}>History</NavLink></li>
        </ul>
        <div className="nav-actions">
          <button type="button" className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {theme === 'dark' ? <FaSun style={{ color: '#f59e0b' }} /> : <FaMoon style={{ color: '#8b5cf6' }} />}
          </button>
          <div id="authNavContainer">
            {user && user.name ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <FaUser /> {user.name}
                </span>
                <button type="button" onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
