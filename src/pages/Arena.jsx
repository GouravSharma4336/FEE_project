import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaAward, FaThumbsUp, FaBookOpen, FaHistory, FaTrophy, FaCheck } from 'react-icons/fa';
import { saveScore } from '../api';
import { getManualQuestions } from '../quizquestions';

export default function Arena() {
  const [searchParams] = useSearchParams();
  const subject = searchParams.get('subject') || 'mixed', difficulty = searchParams.get('difficulty') || 'mixed';
  const count = parseInt(searchParams.get('question_count'), 10) || 40, timerMode = searchParams.get('timer_mode') || 'per_question';
  const perQTime = parseInt(searchParams.get('per_q_time'), 10) || 60, totalMins = parseInt(searchParams.get('total_test_time'), 10) || 25;

  const [questions, setQuestions] = useState([]), [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]), [loading, setLoading] = useState(true), [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => (timerMode === 'per_question' ? perQTime : totalMins * 60));
  const timerRef = useRef(null);

  const decode = (str) => { const txt = document.createElement('textarea'); txt.innerHTML = str || ''; return txt.value; };
  const shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  useEffect(() => {
    let isMounted = true;
    async function loadQuestions() {
      const apiTarget = Math.max(1, Math.floor(count / 2));
      let apiQuestions = [];
      const catMap = { computers: 18, html: 18, css: 18, javascript: 18, react: 18, oops: 18, logic_reasoning: 19, gadgets: 30, general: 9 };
      let url = `https://opentdb.com/api.php?amount=${apiTarget}${catMap[subject] ? `&category=${catMap[subject]}` : ''}${difficulty !== 'mixed' ? `&difficulty=${difficulty.toLowerCase()}` : ''}`;

      try {
        let res = await fetch(url), data = await res.json();
        if (data?.response_code === 5) {
          await new Promise(r => setTimeout(r, 1200));
          data = await (await fetch(url)).json();
        }
        if (!data?.results?.length && url.includes('&')) {
          data = await (await fetch(`https://opentdb.com/api.php?amount=${apiTarget}`)).json();
        }
        if (data?.results?.length) {
          apiQuestions = data.results.map(q => {
            const correct = decode(q.correct_answer);
            const opts = q.type === 'boolean' ? ['True', 'False'] : shuffle([correct, ...q.incorrect_answers.map(decode)]);
            return {
              question: decode(q.question), options: opts, answer: opts.indexOf(correct),
              category: decode(q.category || 'General Knowledge'), difficulty: (q.difficulty || 'medium').toUpperCase(),
              explanation: `Correct: ${correct} (${q.category || 'General'})`
            };
          });
        }
      } catch (e) {
        console.warn('API error, using manual bank:', e);
      }

      const manualNeeded = count - apiQuestions.length;
      const combined = shuffle([...getManualQuestions({ subject, difficulty, count: manualNeeded }), ...apiQuestions]);
      if (isMounted) {
        setQuestions(combined);
        setUserAnswers(new Array(combined.length).fill(null));
        setLoading(false);
      }
    }
    loadQuestions();
    return () => { isMounted = false; };
  }, [subject, difficulty, count]);

  const goToQuestion = (idx) => { setCurrentIndex(idx); if (timerMode === 'per_question' && perQTime > 0) setTimeLeft(perQTime); };
  const selectOption = (optIdx) => setUserAnswers(prev => { const next = [...prev]; next[currentIndex] = optIdx; return next; });

  const finishQuiz = () => {
    clearInterval(timerRef.current);
    setIsFinished(true);
    const calculatedScore = questions.reduce((acc, q, i) => (userAnswers[i] === q.answer ? acc + 1 : acc), 0);
    const totalCount = questions.length, calculatedPct = totalCount ? Math.round((calculatedScore / totalCount) * 100) : 0;
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

  useEffect(() => {
    if (loading || isFinished || (timerMode === 'per_question' && perQTime <= 0)) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerMode === 'per_question' && currentIndex < questions.length - 1) {
            setCurrentIndex(c => c + 1);
            return perQTime;
          }
          clearInterval(timerRef.current);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  });

  const score = questions.reduce((acc, q, i) => (userAnswers[i] === q.answer ? acc + 1 : acc), 0);
  const total = questions.length, pct = total ? Math.round((score / total) * 100) : 0;
  const currentQ = questions[currentIndex], progressPct = total ? ((currentIndex + 1) / total) * 100 : 0;
  const formatTime = () => {
    if (timerMode === 'per_question' && perQTime <= 0) return 'Untimed';
    const m = String(Math.floor(Math.max(timeLeft, 0) / 60)).padStart(2, '0'), s = String(Math.max(timeLeft, 0) % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
      <main className="container">
        {loading ? (
          <div className="loading-spinner" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div className="spinner-dot" style={{ width: '36px', height: '36px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
            <h3 style={{ marginBottom: '0.4rem' }}>Preparing Assessment...</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading questions from Open Trivia DB and manual technical bank.</p>
          </div>
        ) : (
          <div className="arena-layout">
            <article className="card" style={{ padding: '2rem' }}>
              <div className="arena-header">
                <div>
                  <span className="badge" style={{ marginBottom: '0.3rem' }}>{currentQ?.category} • {currentQ?.difficulty}</span>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Question {currentIndex + 1} of {total}</div>
                </div>
                <div className={`timer-pill ${timeLeft <= 10 && perQTime > 0 ? 'timer-danger' : ''}`}>{formatTime()}</div>
              </div>

              <h2 className="question-title">{currentQ?.question}</h2>

              <div className="options-list" role="radiogroup">
                {currentQ?.options.map((opt, idx) => (
                  <button key={idx} type="button" className={`option-btn ${userAnswers[currentIndex] === idx ? 'selected' : ''}`} onClick={() => selectOption(idx)}>
                    {['A', 'B', 'C', 'D'][idx] || idx + 1}. {opt}
                  </button>
                ))}
              </div>

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

            <aside className="palette-card">
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Question Palette</h4>
              <div className="palette-grid">
                {questions.map((_, idx) => (
                  <button key={idx} type="button" className={`palette-btn ${idx === currentIndex ? 'active' : ''} ${userAnswers[idx] !== null ? 'answered' : ''}`} onClick={() => goToQuestion(idx)}>
                    {idx + 1}
                  </button>
                ))}
              </div>
            </aside>
          </div>
        )}
      </main>

      {isFinished && (
        <div className="modal-overlay open" role="dialog" aria-modal="true">
          <div className="modal-content">
            <div style={{ fontSize: '3rem', marginBottom: '0.4rem', display: 'flex', justifyContent: 'center' }}>
              {pct >= 80 ? <FaAward style={{ color: '#fbbf24', fontSize: '3.2rem' }} /> : pct >= 50 ? <FaThumbsUp style={{ color: 'var(--primary)', fontSize: '3.2rem' }} /> : <FaBookOpen style={{ color: 'var(--text-muted)', fontSize: '3.2rem' }} />}
            </div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>{pct >= 80 ? 'Outstanding Performance!' : pct >= 50 ? 'Assessment Complete!' : 'Keep Practicing!'}</h2>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', margin: '0.4rem 0' }}>{score} / {total} ({pct}%)</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              {pct >= 80 ? 'Outstanding performance! You demonstrated strong technical mastery.' : 'Your assessment attempt has been logged successfully.'}
            </p>
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
