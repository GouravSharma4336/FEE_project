import React, { useState, useEffect, useRef } from 'react';
// Core React imports: useState (reactive state), useEffect (lifecycle/APIs), useRef (timer reference)

import { useSearchParams, Link } from 'react-router-dom';
// React Router: useSearchParams reads URL query params (e.g. ?subject=js), Link enables page navigation

import { FaAward, FaThumbsUp, FaBookOpen, FaHistory, FaTrophy, FaCheck } from 'react-icons/fa';
// Icons: UI visual icons for score badges, action buttons, and quiz submission

import { saveScore } from '../api';
// API: Function to save the completed quiz score to history and leaderboard

import { getManualQuestions } from '../quizquestions';
// Local Questions: Fallback question bank used when API is slow, offline, or needs extra questions

export default function Arena() {
  // --- 1. READ CONFIGURATION FROM URL ---
  const [searchParams] = useSearchParams();
  // Reads subject & difficulty from URL, defaults to 'mixed' if not specified
  const subject = searchParams.get('subject') || 'mixed', difficulty = searchParams.get('difficulty') || 'mixed';
  // Reads total question count (default 40) and timer mode ('per_question' or total test)
  const count = parseInt(searchParams.get('question_count'), 10) || 40, timerMode = searchParams.get('timer_mode') || 'per_question';
  // Timer durations: seconds per question (default 60s) or total test minutes (default 25m)
  const perQTime = parseInt(searchParams.get('per_q_time'), 10) || 60, totalMins = parseInt(searchParams.get('total_test_time'), 10) || 25;

  // --- 2. COMPONENT STATE ---
  // questions: all quiz questions; currentIndex: index of the active question (0, 1, 2...)
  const [questions, setQuestions] = useState([]), [currentIndex, setCurrentIndex] = useState(0);
  // userAnswers: selected option per question; loading: fetch status; isFinished: show results popup
  const [userAnswers, setUserAnswers] = useState([]), [loading, setLoading] = useState(true), [isFinished, setIsFinished] = useState(false);
  // timeLeft: remaining seconds, initialized based on timer mode
  const [timeLeft, setTimeLeft] = useState(() => (timerMode === 'per_question' ? perQTime : totalMins * 60));
  // timerRef: holds the setInterval timer ID so we can stop it anytime without re-rendering
  const timerRef = useRef(null);

  // --- 3. HELPER UTILITIES ---
  // decode: Converts HTML entities (e.g. &quot; &#039;) into normal plain text
  const decode = (str) => { const txt = document.createElement('textarea'); txt.innerHTML = str || ''; return txt.value; };
  
  // shuffle: Randomly shuffles array elements using the Fisher-Yates algorithm
  const shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // --- 4. LOAD QUESTIONS (API + LOCAL HYBRID) ---
  useEffect(() => {
    let isMounted = true; // Prevents updating state if user leaves the page early

    async function loadQuestions() {
      // Fetch half from Open Trivia DB API and remaining half from local question bank
      const apiTarget = Math.max(1, Math.floor(count / 2));
      let apiQuestions = [];
      
      // Maps subjects to Open Trivia DB category IDs (e.g. computers = 18)
      const catMap = { computers: 18, html: 18, css: 18, javascript: 18, react: 18, oops: 18, logic_reasoning: 19, gadgets: 30, general: 9 };
      let url = `https://opentdb.com/api.php?amount=${apiTarget}${catMap[subject] ? `&category=${catMap[subject]}` : ''}${difficulty !== 'mixed' ? `&difficulty=${difficulty.toLowerCase()}` : ''}`;

      try {
        // Fetch questions from Open Trivia DB
        let res = await fetch(url), data = await res.json();
        
        // If API is rate-limited (code 5), wait 1.2s and retry once
        if (data?.response_code === 5) {
          await new Promise(r => setTimeout(r, 1200));
          data = await (await fetch(url)).json();
        }
        
        // If no questions found for specific category, fallback to generic questions
        if (!data?.results?.length && url.includes('&')) {
          data = await (await fetch(`https://opentdb.com/api.php?amount=${apiTarget}`)).json();
        }
        
        // Format API questions into our app structure
        if (data?.results?.length) {
          apiQuestions = data.results.map(q => {
            const correct = decode(q.correct_answer);
            const opts = q.type === 'boolean' ? ['True', 'False'] : shuffle([correct, ...q.incorrect_answers.map(decode)]);
            return {
              question: decode(q.question), 
              options: opts, 
              answer: opts.indexOf(correct),
              category: decode(q.category || 'General Knowledge'), 
              difficulty: (q.difficulty || 'medium').toUpperCase(),
              explanation: `Correct: ${correct} (${q.category || 'General'})`
            };
          });
        }
      } catch (e) {
        // If API fails, log warning and use local questions instead
        console.warn('API error, using manual bank:', e);
      }

      // Calculate how many local questions are needed to reach the full count
      const manualNeeded = count - apiQuestions.length;
      // Merge local manual questions with API questions and shuffle their order
      const combined = shuffle([...getManualQuestions({ subject, difficulty, count: manualNeeded }), ...apiQuestions]);
      
      // Update state if component is still on screen
      if (isMounted) {
        setQuestions(combined);
        setUserAnswers(new Array(combined.length).fill(null)); // Start with all answers unanswered (null)
        setLoading(false); // Hide loading spinner
      }
    }

    loadQuestions();
    return () => { isMounted = false; }; // Cleanup on unmount
  }, [subject, difficulty, count]);

  // --- 5. USER ACTIONS ---
  // Jump to a specific question (and reset timer if in per-question mode)
  const goToQuestion = (idx) => { 
    setCurrentIndex(idx); 
    if (timerMode === 'per_question' && perQTime > 0) setTimeLeft(perQTime); 
  };

  // Record the selected option index for the current question
  const selectOption = (optIdx) => setUserAnswers(prev => { 
    const next = [...prev]; 
    next[currentIndex] = optIdx; 
    return next; 
  });

  // --- 6. SUBMIT & SCORE QUIZ ---
  const finishQuiz = () => {
    clearInterval(timerRef.current); // Stop timer
    setIsFinished(true); // Open completion modal

    // Count correct answers
    const calculatedScore = questions.reduce((acc, q, i) => (userAnswers[i] === q.answer ? acc + 1 : acc), 0);
    const totalCount = questions.length;
    const calculatedPct = totalCount ? Math.round((calculatedScore / totalCount) * 100) : 0;
    
    // Read logged-in user from localStorage and save score to history
    const u = JSON.parse(localStorage.getItem('quizmaster_user') || 'null');
    saveScore({
      userId: u?.id || (u?.name ? u.name.toLowerCase().replace(/\s+/g, '_') : 'guest'),
      userName: u?.name || 'Student',
      subject: `Hybrid Drill (${subject.replace('_', ' ').toUpperCase()})`,
      difficulty: difficulty.toUpperCase(),
      score: calculatedScore,
      total: totalCount,
      percentage: calculatedPct
    });
  };

  // --- 7. COUNTDOWN TIMER INTERVAL ---
  useEffect(() => {
    // Don't run timer while loading, if quiz is finished, or if test is untimed
    if (loading || isFinished || (timerMode === 'per_question' && perQTime <= 0)) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        // When timer hits 0
        if (prev <= 1) {
          // If per-question timer and not last question, move to next question
          if (timerMode === 'per_question' && currentIndex < questions.length - 1) {
            setCurrentIndex(c => c + 1);
            return perQTime;
          }
          // Otherwise time is up for the entire quiz -> submit automatically
          clearInterval(timerRef.current);
          finishQuiz();
          return 0;
        }
        return prev - 1; // Decrease timer by 1 second
      });
    }, 1000);

    return () => clearInterval(timerRef.current); // Clear interval when re-rendering or unmounting
  });

  // --- 8. DERIVED VALUES FOR DISPLAY ---
  const score = questions.reduce((acc, q, i) => (userAnswers[i] === q.answer ? acc + 1 : acc), 0);
  const total = questions.length;
  const pct = total ? Math.round((score / total) * 100) : 0; // Score percentage (0-100%)
  const currentQ = questions[currentIndex]; // Currently displayed question object
  const progressPct = total ? ((currentIndex + 1) / total) * 100 : 0; // Progress bar width percentage

  // formatTime: Formats raw seconds into digital clock format (e.g. 65s -> "01:05")
  const formatTime = () => {
    if (timerMode === 'per_question' && perQTime <= 0) return 'Untimed';
    const m = String(Math.floor(Math.max(timeLeft, 0) / 60)).padStart(2, '0');
    const s = String(Math.max(timeLeft, 0) % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // --- 9. RENDER UI ---
  return (
    <div>
      {/* Top progress bar indicating how far along the user is */}
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
      
      <main className="container">
        {/* Shows spinner while questions are being loaded */}
        {loading ? (
          <div className="loading-spinner" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div className="spinner-dot" style={{ width: '36px', height: '36px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
            <h3 style={{ marginBottom: '0.4rem' }}>Preparing Assessment...</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading questions from Open Trivia DB and manual technical bank.</p>
          </div>
        ) : (
          /* Main quiz layout: Question Card on left, Question Palette on right */
          <div className="arena-layout">
            <article className="card" style={{ padding: '2rem' }}>
              <div className="arena-header">
                <div>
                  {/* Category and difficulty badges */}
                  <span className="badge" style={{ marginBottom: '0.3rem' }}>{currentQ?.category} • {currentQ?.difficulty}</span>
                  {/* Question counter (e.g. Question 1 of 20) */}
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Question {currentIndex + 1} of {total}</div>
                </div>
                {/* Timer pill: turns red (timer-danger) when 10 seconds or less remain */}
                <div className={`timer-pill ${timeLeft <= 10 && perQTime > 0 ? 'timer-danger' : ''}`}>{formatTime()}</div>
              </div>

              {/* Question text */}
              <h2 className="question-title">{currentQ?.question}</h2>

              {/* Multiple choice options */}
              <div className="options-list" role="radiogroup">
                {currentQ?.options.map((opt, idx) => (
                  <button 
                    key={idx} 
                    type="button" 
                    className={`option-btn ${userAnswers[currentIndex] === idx ? 'selected' : ''}`} 
                    onClick={() => selectOption(idx)}
                  >
                    {['A', 'B', 'C', 'D'][idx] || idx + 1}. {opt}
                  </button>
                ))}
              </div>

              {/* Previous and Next / Submit buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" disabled={currentIndex === 0} onClick={() => goToQuestion(currentIndex - 1)}>← Previous</button>
                {currentIndex < total - 1 ? (
                  <button type="button" className="btn btn-primary" onClick={() => goToQuestion(currentIndex + 1)}>Next Question →</button>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={finishQuiz} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Submit Assessment <FaCheck />
                  </button>
                )}
              </div>
            </article>

            {/* Sidebar question palette for direct question jumping */}
            <aside className="palette-card">
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Question Palette</h4>
              <div className="palette-grid">
                {questions.map((_, idx) => (
                  <button 
                    key={idx} 
                    type="button" 
                    className={`palette-btn ${idx === currentIndex ? 'active' : ''} ${userAnswers[idx] !== null ? 'answered' : ''}`} 
                    onClick={() => goToQuestion(idx)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* Results modal dialog displayed when quiz is finished */}
      {isFinished && (
        <div className="modal-overlay open" role="dialog" aria-modal="true">
          <div className="modal-content">
            {/* Achievement icon based on percentage */}
            <div style={{ fontSize: '3rem', marginBottom: '0.4rem', display: 'flex', justifyContent: 'center' }}>
              {pct >= 80 ? <FaAward style={{ color: '#fbbf24', fontSize: '3.2rem' }} /> : pct >= 50 ? <FaThumbsUp style={{ color: 'var(--primary)', fontSize: '3.2rem' }} /> : <FaBookOpen style={{ color: 'var(--text-muted)', fontSize: '3.2rem' }} />}
            </div>
            
            {/* Title and score display */}
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>
              {pct >= 80 ? 'Outstanding Performance!' : pct >= 50 ? 'Assessment Complete!' : 'Keep Practicing!'}
            </h2>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', margin: '0.4rem 0' }}>
              {score} / {total} ({pct}%)
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              {pct >= 80 ? 'Outstanding performance! You demonstrated strong technical mastery.' : 'Your assessment attempt has been logged successfully.'}
            </p>
            
            {/* Navigation links after finishing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/history" className="btn btn-primary" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><FaHistory /> View History</Link>
                <Link to="/leaderboard" className="btn btn-outline" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><FaTrophy /> Leaderboard</Link>
              </div>
              <Link to="/" className="btn btn-outline">Return Home</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
