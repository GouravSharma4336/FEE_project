import React from 'react';
import { Link } from 'react-router-dom';
import { FaBullseye } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <FaBullseye style={{ color: 'var(--primary)' }} /> QuizMaster
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/prepare">Study Notes</Link>
          <Link to="/quiz">Start Quiz</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/history">History</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>
      <div style={{ marginTop: '1rem' }}>
        &copy; {new Date().getFullYear()} QuizMaster. Frontend Engineering (FEE) React SPA.
      </div>
    </footer>
  );
}
