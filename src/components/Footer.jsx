import React from 'react';
// Core React library import

import { Link } from 'react-router-dom';
// Link: Client-side routing links without reloading the page

import { FaBullseye } from 'react-icons/fa';
// FontAwesome bullseye logo icon

// Footer Component: Renders the site-wide footer with branding, quick links, and copyright
export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        {/* Brand logo & name */}
        <div className="logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <FaBullseye style={{ color: 'var(--primary)' }} /> QuizMaster
        </div>

        {/* Quick navigation links */}
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/prepare">Study Notes</Link>
          <Link to="/quiz">Start Quiz</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/history">History</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>

      {/* Dynamic copyright year and project tag */}
      <div style={{ marginTop: '1rem' }}>
        &copy; {new Date().getFullYear()} QuizMaster. Frontend Engineering (FEE) React SPA.
      </div>
    </footer>
  );
}
