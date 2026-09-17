import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaGlobe, FaPalette, FaReact, FaCubes, FaCalculator, FaStar, FaBookOpen } from 'react-icons/fa';
import { IoFlash } from 'react-icons/io5';

export default function Home() {
  const [user] = useState(() => JSON.parse(localStorage.getItem('quizmaster_user') || 'null'));
  const [isReturning] = useState(() => {
    const visited = localStorage.getItem('quizmaster_visited');
    const history = JSON.parse(localStorage.getItem('quizmaster_history') || '[]');
    const storedUser = JSON.parse(localStorage.getItem('quizmaster_user') || 'null');
    return Boolean(visited || history.length > 0 || (storedUser && storedUser.name));
  });

  useEffect(() => {
    localStorage.setItem('quizmaster_visited', 'true');
  }, []);

  const tracks = [
    { id: 'html', icon: <FaGlobe style={{ color: '#38bdf8' }} />, badge: 'Web Basics', title: 'HTML5 & Semantic Web', desc: 'Semantic structuring, form validation, accessible ARIA tags, and web standards.', tags: ['Semantics', 'Forms', 'ARIA'] },
    { id: 'css', icon: <FaPalette style={{ color: '#8b5cf6' }} />, badge: 'Layouts', title: 'CSS3 & Responsive Layouts', desc: 'Flexbox, CSS Grid layouts, box model, media queries, and styling cascade.', tags: ['Flexbox', 'Grid', 'Responsive'] },
    { id: 'javascript', icon: <IoFlash style={{ color: '#f59e0b' }} />, badge: 'Core JS', title: 'Modern JavaScript (ES6+)', desc: 'Closures, Event Loop, Promises, async/await, scope chains, and arrays.', tags: ['Closures', 'Event Loop', 'Promises'] },
    { id: 'react', icon: <FaReact style={{ color: '#06b6d4' }} />, badge: 'Frontend', title: 'React & Components', desc: 'Component lifecycle, modern hooks (useState, useEffect), and virtual DOM diffing.', tags: ['Hooks', 'Virtual DOM', 'State'] },
    { id: 'oops', icon: <FaCubes style={{ color: '#10b981' }} />, badge: 'Architecture', title: 'OOPs & Software Design', desc: 'The 4 pillars of OOP, encapsulation, inheritance, polymorphism, and SOLID principles.', tags: ['Encapsulation', 'Polymorphism', 'SOLID'] },
    { id: 'logic_reasoning', icon: <FaCalculator style={{ color: '#ec4899' }} />, badge: 'Quantitative', title: 'Quantitative Aptitude & Logic', desc: 'Speed-distance-time, profit & loss, percentages, ratios, and logical problem solving.', tags: ['Speed & Time', 'Percentages', 'Logic'] }
  ];

  return (
    <main className="container">
      {/* Hero Section */}
      <section className="hero-wrapper">
        <div className="hero-content">
          {isReturning && (
            <div className="badge" style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <FaStar style={{ color: '#f59e0b' }} /> Welcome back, {user?.name || 'Learner'}! Progress remembered.
            </div>
          )}
          <div className="badge"><span className="badge-dot" /> Campus Placement Practice</div>
          <h1>Master Tech Skills &amp; <br /><span className="gradient-text">Aptitude Tests</span></h1>
          <p className="hero-desc">
            Practice essential technical concepts and quantitative reasoning for campus placements and software engineering tests with timed practice drills.
          </p>
          <div className="hero-actions">
            <Link to="/quiz" className="btn btn-primary btn-lg" id="heroStartBtn">
              {isReturning ? 'Continue Quiz →' : 'Start Quiz Now →'}
            </Link>
            <Link to="/prepare" className="btn btn-outline btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <FaBookOpen /> Study Notes
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="showcase-card">
            <div className="showcase-window-header">
              <span className="window-dot dot-red" />
              <span className="window-dot dot-yellow" />
              <span className="window-dot dot-green" />
              <span style={{ marginLeft: '0.5rem' }}>online-assessment.jpg</span>
            </div>
            <div className="showcase-img-wrap">
              <img src="/online_self_assessment.jpg" alt="QuizMaster Online Assessment" />
            </div>
            <div className="floating-stat-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span className="badge-dot" />
              <IoFlash style={{ color: 'var(--primary)' }} />
              <span>Timed Assessment Arena</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-strip">
        <div><span className="stat-num">60+</span><span className="stat-label">Practice Questions</span></div>
        <div><span className="stat-num">06</span><span className="stat-label">Subject Tracks</span></div>
        <div><span className="stat-num">Live</span><span className="stat-label">Countdown Timers</span></div>
        <div><span className="stat-num" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><FaTrophy style={{ color: '#f59e0b' }} /></span><span className="stat-label">Campus Leaderboard</span></div>
      </section>

      {/* Practice Tracks */}
      <section>
        <div className="section-header">
          <div className="badge" style={{ marginBottom: '0.5rem' }}>Practice Subjects</div>
          <h2>Available Practice Tracks</h2>
          <p>Select any subject below to configure your practice drill, or choose mixed mode to test all topics.</p>
        </div>

        <div className="grid">
          {tracks.map(t => (
            <article key={t.id} className="card">
              <div className="card-top">
                <span style={{ fontSize: '1.3rem' }}>{t.icon}</span>
                <span className="badge">{t.badge}</span>
              </div>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
              <div className="card-tags">
                {t.tags.map(tag => <span key={tag}>{tag}</span>)}
              </div>
              <Link to={`/quiz?subject=${t.id}`} className="btn btn-outline" style={{ width: '100%' }}>
                Practice {t.badge} →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
