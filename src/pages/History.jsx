import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHistory, FaTrashAlt, FaFileAlt } from 'react-icons/fa';
import { fetchUserHistory } from '../api';

export default function History() {
  const [logs, setLogs] = useState([]);
  const [user] = useState(() => JSON.parse(localStorage.getItem('quizmaster_user') || 'null'));

  useEffect(() => {
    const userId = user?.id || (user?.name ? user.name.toLowerCase().replace(/\s+/g, '_') : 'aarav');
    fetchUserHistory(userId).then(saved => setLogs(saved));
  }, [user]);

  const clearHistory = () => {
    if (window.confirm('Clear your local assessment history?')) {
      localStorage.removeItem('quizmaster_history');
      setLogs([]);
    }
  };

  const totalAttempts = logs.length;
  const avgAccuracy = totalAttempts
    ? Math.round(logs.reduce((acc, l) => acc + (l.percentage || 0), 0) / totalAttempts)
    : 0;
  const bestScore = logs.reduce((best, l) => (l.percentage > (best.percentage || 0) ? l : best), { percentage: 0, score: 0, total: 0 });

  return (
    <main className="container">
      <div style={{ marginBottom: '2rem' }}>
        <div className="badge" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <FaHistory /> Personal Performance Logs
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>
          {user ? `${user.name}'s Assessment History` : 'My Assessment History'}
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Review your personal test records, accuracy scores, and placement preparation drills.
        </p>
      </div>

      {logs.length > 0 ? (
        <>
          {/* Stats Bar */}
          <div className="stats-strip" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '2rem' }}>
            <div><span className="stat-num">{totalAttempts}</span><span className="stat-label">Tests Completed</span></div>
            <div><span className="stat-num">{avgAccuracy}%</span><span className="stat-label">Average Accuracy</span></div>
            <div><span className="stat-num">{bestScore.score} / {bestScore.total}</span><span className="stat-label">Best Score</span></div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
              Logged assessment drills for {user?.name || 'Student'}:
            </span>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={clearHistory} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <FaTrashAlt /> Clear History
              </button>
              <Link to="/quiz" className="btn btn-primary btn-sm">+ Start New Assessment</Link>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Subject Track</th>
                  <th>Difficulty</th>
                  <th>Score</th>
                  <th>Accuracy</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => {
                  const pillClass = log.percentage >= 75 ? 'pct-high' : log.percentage >= 50 ? 'pct-mid' : 'pct-low';
                  return (
                    <tr key={i}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>#{i + 1}</td>
                      <td>{log.date}</td>
                      <td style={{ fontWeight: 700 }}>{log.subject}</td>
                      <td style={{ textTransform: 'capitalize' }}>{log.difficulty}</td>
                      <td style={{ fontWeight: 700 }}>{log.score} / {log.total}</td>
                      <td><span className={`pct-pill ${pillClass}`}>{log.percentage}%</span></td>
                      <td><Link to="/quiz" className="btn btn-outline btn-sm">Retake ↺</Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="card empty-state">
          <div className="empty-icon">
            <FaFileAlt style={{ fontSize: '3rem', color: 'var(--text-muted)' }} />
          </div>
          <h3 style={{ marginBottom: '0.4rem' }}>No assessment attempts recorded for this account!</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.2rem' }}>
            Complete a quiz assessment in the arena to log your scores under {user?.name || 'this account'}.
          </p>
          <Link to="/quiz" className="btn btn-primary">Take Your First Quiz Now →</Link>
        </div>
      )}
    </main>
  );
}
