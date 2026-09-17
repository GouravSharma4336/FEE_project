/**
 * QuizMaster - Client API Service (fp4/src/api.js)
 * Interacts with the shared server endpoints for multi-device sync,
 * with graceful fallback to localStorage if server is offline.
 */

// Use current hostname on port 5000 (works on both localhost and phone/LAN IP!)
const SERVER_URL = window.location.port === '5000'
  ? window.location.origin
  : `http://${window.location.hostname || 'localhost'}:5000`;

export async function fetchAccounts() {
  try {
    const res = await fetch(`${SERVER_URL}/api/accounts`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Server offline, using default accounts list:', e);
  }
  return [
    { id: 'aarav', name: 'Aarav Patel', email: 'aarav@campus.edu' },
    { id: 'diya', name: 'Diya Sengupta', email: 'diya@campus.edu' },
    { id: 'rohan', name: 'Rohan Verma', email: 'rohan@campus.edu' },
    { id: 'ananya', name: 'Ananya Iyer', email: 'ananya@campus.edu' }
  ];
}

export async function loginUser(email, password, name) {
  try {
    const res = await fetch(`${SERVER_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        localStorage.setItem('quizmaster_user', JSON.stringify(data.user));
        return data.user;
      }
    }
  } catch (e) {
    console.warn('Server offline, logging in locally:', e);
  }

  // Fallback local login
  const fallbackName = name || email.split('@')[0].replace('.', ' ') || 'Student';
  const capName = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);
  const user = {
    id: capName.toLowerCase().replace(/\s+/g, '_'),
    name: capName,
    email: email.includes('@') ? email : `${email}@campus.edu`
  };
  localStorage.setItem('quizmaster_user', JSON.stringify(user));
  return user;
}

export async function saveScore(attempt) {
  try {
    const res = await fetch(`${SERVER_URL}/api/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attempt)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Server offline, saving score locally:', e);
  }

  // Fallback localStorage
  try {
    const history = JSON.parse(localStorage.getItem('quizmaster_history') || '[]');
    history.unshift({
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      subject: attempt.subject,
      difficulty: attempt.difficulty,
      score: attempt.score,
      total: attempt.total,
      percentage: attempt.percentage,
      user: attempt.userName || 'Student'
    });
    localStorage.setItem('quizmaster_history', JSON.stringify(history));
  } catch (err) {
    console.error(err);
  }
}

export async function fetchUserHistory(userId) {
  try {
    const res = await fetch(`${SERVER_URL}/api/history?userId=${encodeURIComponent(userId)}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Server offline, loading local history:', e);
  }
  return JSON.parse(localStorage.getItem('quizmaster_history') || '[]');
}

export async function fetchLeaderboard() {
  try {
    const res = await fetch(`${SERVER_URL}/api/leaderboard`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Server offline, generating local leaderboard:', e);
  }

  // Fallback baseline top 10
  return [
    { rank: 1, name: 'Diya Sengupta', subject: 'Open Trivia (HTML)', score: 10, total: 10, percentage: 100 },
    { rank: 2, name: 'Aarav Patel', subject: 'Open Trivia (JAVASCRIPT)', score: 39, total: 40, percentage: 98 },
    { rank: 3, name: 'Diya Sengupta', subject: 'Open Trivia (REACT)', score: 38, total: 40, percentage: 95 },
    { rank: 4, name: 'Rohan Verma', subject: 'Open Trivia (LOGIC REASONING)', score: 37, total: 40, percentage: 93 },
    { rank: 5, name: 'Aarav Patel', subject: 'Open Trivia (COMPUTERS)', score: 37, total: 40, percentage: 93 },
    { rank: 6, name: 'Ananya Iyer', subject: 'Open Trivia (CSS)', score: 36, total: 40, percentage: 90 },
    { rank: 7, name: 'Vikram Malhotra', subject: 'Open Trivia (OOPS)', score: 35, total: 40, percentage: 88 },
    { rank: 8, name: 'Neha Joshi', subject: 'Open Trivia (JAVASCRIPT)', score: 34, total: 40, percentage: 85 },
    { rank: 9, name: 'Karan Mehra', subject: 'Open Trivia (LOGIC REASONING)', score: 33, total: 40, percentage: 83 },
    { rank: 10, name: 'Sneha Roy', subject: 'Open Trivia (REACT)', score: 32, total: 40, percentage: 80 }
  ];
}
