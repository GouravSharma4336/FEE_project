import React, { useState, useEffect } from 'react';
// Core React hooks: useState for state management, useEffect for loading leaderboard data

import { Link } from 'react-router-dom';
// Link: Client-side routing without browser refresh

import { FaTrophy, FaCrown, FaMedal } from 'react-icons/fa';
// Icons for leaderboard title, first place crown, and podium medals

import { fetchLeaderboard } from '../api';
// API service function to fetch top scores

export default function Leaderboard() {
  // activeTrack: Currently selected subject filter tab ('all', 'HTML', 'JavaScript', etc.)
  const [activeTrack, setActiveTrack] = useState('all');
  
  // user: Current logged-in student profile from localStorage
  const [user] = useState(() => JSON.parse(localStorage.getItem('quizmaster_user') || 'null'));
  
  // topScores: List of top 5 highest-scoring attempts
  const [topScores, setTopScores] = useState([]);
  
  // loading: Indicates whether leaderboard data is currently being fetched
  const [loading, setLoading] = useState(true);

  // Fetch top 5 scores on page load
  useEffect(() => {
    fetchLeaderboard().then(data => {
      setTopScores(data);
      setLoading(false);
    });
  }, []);

  // Filters top scores based on selected subject track
  const filtered = topScores.filter(item => {
    if (activeTrack === 'all') return true;
    const sub = (item.subject || '').toLowerCase();
    return sub.includes(activeTrack.toLowerCase());
  });

  // Podium references for top 3 candidates
  const first = topScores[0];
  const second = topScores[1];
  const third = topScores[2];

  return (
    <main className="container">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div className="badge" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <FaTrophy style={{ color: '#f59e0b' }} /> Campus Top 5 Leaderboard
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.4rem' }}>Placement Drill Leaderboard</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
          Top 5 highest-scoring test attempts across all campus students, updated live across all connected devices.
        </p>
      </div>

      {/* Top 3 Visual Podium (Rank 2 on left, Rank 1 center, Rank 3 on right) */}
      {topScores.length >= 3 && (
        <div className="podium-wrap">
          {/* 2nd Place Silver */}
          {second && (
            <div className="podium-card podium-2">
              <div className="podium-crown"><FaMedal style={{ color: '#94a3b8', fontSize: '2rem' }} /></div>
              <div className="rank-badge rank-2" style={{ margin: '0 auto 0.4rem' }}>2</div>
              <div className="podium-name">{second.name}</div>
              <div className="podium-score">{second.percentage}%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{second.score} / {second.total} pts</div>
            </div>
          )}

          {/* 1st Place Gold with Crown */}
          {first && (
            <div className="podium-card podium-1">
              <div className="podium-crown"><FaCrown style={{ color: '#f59e0b', fontSize: '2.1rem' }} /></div>
              <div className="rank-badge rank-1" style={{ margin: '0 auto 0.4rem' }}>1</div>
              <div className="podium-name">{first.name}</div>
              <div className="podium-score">{first.percentage}%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{first.score} / {first.total} pts</div>
            </div>
          )}

          {/* 3rd Place Bronze */}
          {third && (
            <div className="podium-card podium-3">
              <div className="podium-crown"><FaMedal style={{ color: '#d97706', fontSize: '2rem' }} /></div>
              <div className="rank-badge rank-3" style={{ margin: '0 auto 0.4rem' }}>3</div>
              <div className="podium-name">{third.name}</div>
              <div className="podium-score">{third.percentage}%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{third.score} / {third.total} pts</div>
            </div>
          )}
        </div>
      )}

      {/* Subject Filter Buttons */}
      <div className="leaderboard-filters" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {['all', 'HTML', 'CSS', 'JavaScript', 'React', 'OOPs', 'Logic Reasoning', 'Computers'].map(t => (
          <button
            key={t}
            type="button"
            className={`filter-btn ${activeTrack === t ? 'active' : ''}`}
            onClick={() => setActiveTrack(t)}
          >
            {t === 'all' ? 'All Subjects' : t}
          </button>
        ))}
      </div>

      {/* Top 5 Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Rank</th>
              <th>Student Candidate</th>
              <th>Subject / Track</th>
              <th>Score</th>
              <th>Accuracy</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading Top 5 scores...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No scores found for this filter.</td></tr>
            ) : (
              filtered.slice(0, 5).map((item, idx) => {
                // Check if the current row belongs to the logged-in student
                const isCurrentUser = user && (user.name === item.name || user.id === item.userId);
                const rankIcon = item.rank === 1 ? (
                  <FaCrown style={{ color: '#000', fontSize: '0.8rem' }} />
                ) : item.rank === 2 ? (
                  <FaMedal style={{ color: '#000', fontSize: '0.8rem' }} />
                ) : item.rank === 3 ? (
                  <FaMedal style={{ color: '#fff', fontSize: '0.8rem' }} />
                ) : (
                  `#${item.rank}`
                );
                const badgeClass = item.rank <= 3 ? `rank-${item.rank}` : 'rank-other';
                const pctClass = item.percentage >= 90 ? 'pct-high' : item.percentage >= 75 ? 'pct-mid' : 'pct-low';
                return (
                  <tr key={`${item.name}-${item.date}-${idx}`} className={isCurrentUser ? 'highlight-user' : ''}>
                    <td><span className={`rank-badge ${badgeClass}`}>{rankIcon}</span></td>
                    <td>
                      <div className="player-cell">
                        <div className="player-avatar">{item.name?.charAt(0) || 'S'}</div>
                        <div>
                          <strong>{item.name}</strong>
                          {/* "YOU" badge if row matches logged-in user */}
                          {isCurrentUser && (
                            <span className="badge" style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem', marginLeft: '0.4rem' }}>
                              YOU
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.subject}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{item.score} / {item.total}</td>
                    <td><span className={`pct-pill ${pctClass}`}>{item.percentage}%</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.date || 'Recent'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Call To Action Banner */}
      <div className="card" style={{ textAlign: 'center', marginTop: '2.5rem', padding: '2rem' }}>
        <h3 style={{ marginBottom: '0.4rem' }}>Want to make the Top 5?</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Complete timed assessments to record your score and compete against campus peers!
        </p>
        <Link to="/quiz" className="btn btn-primary">Take an Assessment Now →</Link>
      </div>
    </main>
  );
}
