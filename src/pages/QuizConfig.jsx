import React, { useState } from 'react';
// Core React imports: useState for managing form selections

import { useSearchParams, useNavigate } from 'react-router-dom';
// useSearchParams reads initial query params; useNavigate navigates to Arena with settings

import { FaClipboardList } from 'react-icons/fa';
import { IoFlash } from 'react-icons/io5';
// Icons for summary card and setup header

export default function QuizConfig() {
  const [searchParams] = useSearchParams(), navigate = useNavigate();

  // Selected subject track (reads from URL if provided, defaults to 'mixed')
  const [subject, setSubject] = useState(() => searchParams.get('subject') || 'mixed');
  
  // Selected difficulty and number of questions
  const [difficulty, setDifficulty] = useState('mixed'), [questionCount, setQuestionCount] = useState('40');
  
  // Timer configuration: mode ('per_question' or 'total_test'), seconds per question, or total minutes
  const [timerMode, setTimerMode] = useState('per_question'), [perQTime, setPerQTime] = useState('60'), [totalTestTime, setTotalTestTime] = useState('25');

  // Human-readable labels for each subject key
  const subjectMap = {
    mixed: 'Mixed Knowledge & Tech', html: 'HTML5 & Web Semantics', css: 'CSS3 & Responsive Layouts',
    javascript: 'Modern JavaScript (ES6+)', react: 'React & Components', oops: 'OOPs & Architecture',
    logic_reasoning: 'Mathematics & Logic', gadgets: 'Gadgets & Tech', general: 'General Knowledge'
  };

  // Packages user selections into URL search parameters and redirects to the Arena test page
  const handleLaunch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({ 
      subject, 
      difficulty, 
      question_count: questionCount, 
      timer_mode: timerMode, 
      per_q_time: perQTime, 
      total_test_time: totalTestTime 
    }).toString();
    navigate(`/arena?${query}`);
  };

  return (
    <main className="container">
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="badge" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}><IoFlash /> Test Engine Setup</div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>Configure Your Assessment</h1>
        <p style={{ color: 'var(--text-muted)' }}>Customize your subject track, difficulty level, question volume, pacing timer, and launch.</p>
      </div>

      <form onSubmit={handleLaunch} className="config-grid">
        {/* Left Column: Form Configuration Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* 1. Subject Selection */}
          <fieldset className="card" style={{ border: '1px solid var(--border)' }}>
            <legend style={{ fontSize: '1.1rem', fontWeight: 700, padding: '0 0.5rem' }}>1. Select Subject Track</legend>
            <div className="choice-pills">
              {Object.entries(subjectMap).map(([key, label]) => (
                <label key={key} className="choice-pill">
                  <input type="radio" name="subject" value={key} checked={subject === key} onChange={() => setSubject(key)} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* 2. Difficulty Level */}
          <fieldset className="card" style={{ border: '1px solid var(--border)' }}>
            <legend style={{ fontSize: '1.1rem', fontWeight: 700, padding: '0 0.5rem' }}>2. Difficulty Level</legend>
            <div className="choice-pills">
              {[{ val: 'mixed', label: 'Mixed Standard' }, { val: 'easy', label: 'Easy (Foundational)' }, { val: 'medium', label: 'Medium (Interview)' }, { val: 'hard', label: 'Hard (Advanced)' }].map(d => (
                <label key={d.val} className="choice-pill">
                  <input type="radio" name="difficulty" value={d.val} checked={difficulty === d.val} onChange={() => setDifficulty(d.val)} />
                  <span>{d.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* 3. Question Volume */}
          <fieldset className="card" style={{ border: '1px solid var(--border)' }}>
            <legend style={{ fontSize: '1.1rem', fontWeight: 700, padding: '0 0.5rem' }}>3. Question Volume</legend>
            <div className="choice-pills">
              {['10', '20', '30', '40'].map(c => (
                <label key={c} className="choice-pill">
                  <input type="radio" name="question_count" value={c} checked={questionCount === c} onChange={() => setQuestionCount(c)} />
                  <span>{c} Questions</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* 4. Timer Model & Duration */}
          <fieldset className="card" style={{ border: '1px solid var(--border)' }}>
            <legend style={{ fontSize: '1.1rem', fontWeight: 700, padding: '0 0.5rem' }}>4. Pacing &amp; Timer Model</legend>
            <div style={{ display: 'flex', gap: '1.2rem', margin: '0.6rem 0 0.8rem', fontSize: '0.9rem', fontWeight: 600 }}>
              <label style={{ cursor: 'pointer' }}><input type="radio" name="timer_mode" value="per_question" checked={timerMode === 'per_question'} onChange={() => setTimerMode('per_question')} /> Per-Question Countdown</label>
              <label style={{ cursor: 'pointer' }}><input type="radio" name="timer_mode" value="total_test" checked={timerMode === 'total_test'} onChange={() => setTimerMode('total_test')} /> Total Test Clock</label>
            </div>
            {timerMode === 'per_question' ? (
              <div className="choice-pills">
                {[{ val: '30', label: '30s / Question' }, { val: '60', label: '60s / Question' }, { val: '90', label: '90s / Question' }, { val: '0', label: 'Untimed Practice' }].map(p => (
                  <label key={p.val} className="choice-pill">
                    <input type="radio" name="per_q_time" value={p.val} checked={perQTime === p.val} onChange={() => setPerQTime(p.val)} />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="choice-pills">
                {['15', '25', '40'].map(t => (
                  <label key={t} className="choice-pill">
                    <input type="radio" name="total_test_time" value={t} checked={totalTestTime === t} onChange={() => setTotalTestTime(t)} />
                    <span>{t} Minutes</span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>
        </div>

        {/* Right Column: Live Selection Summary Card */}
        <aside className="summary-card">
          <h3 style={{ marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}><FaClipboardList /> Assessment Summary</h3>
          <div className="summary-item"><span>Question Engine:</span><span style={{ color: 'var(--primary)', fontWeight: 700 }}>Hybrid (Live API + Manual Bank)</span></div>
          <div className="summary-item"><span>Track:</span><span>{subjectMap[subject] || subject}</span></div>
          <div className="summary-item"><span>Difficulty:</span><span>{difficulty.toUpperCase()}</span></div>
          <div className="summary-item"><span>Questions:</span><span>{questionCount} Questions</span></div>
          <div className="summary-item"><span>Pacing:</span><span>{timerMode === 'per_question' ? (perQTime === '0' ? 'Untimed Practice' : `${perQTime}s / question`) : `${totalTestTime} Mins total`}</span></div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1.5rem' }}>Launch Assessment →</button>
        </aside>
      </form>
    </main>
  );
}
