/**
 * QuizMaster - Client API Service (src/api.js)
 * Connects frontend to the Node.js backend server on port 5000.
 * If the server is offline, it automatically falls back to localStorage.
 */

// Dynamically detects the server URL using current hostname on port 5000 (supports localhost & phone IP)
const SERVER_URL = window.location.port === '5000'
  ? window.location.origin
  : `http://${window.location.hostname || 'localhost'}:5000`;

// --- 1. FETCH ACCOUNTS ---
// Retrieves student accounts from backend; returns default list if server is offline
export async function fetchAccounts() {
  try {
    const res = await fetch(`${SERVER_URL}/api/accounts`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Server offline, using default accounts list:', e);
  }
  // Offline fallback student accounts
  return [
    { id: 'aarav', name: 'Aarav Patel', email: 'aarav@campus.edu' },
    { id: 'diya', name: 'Diya Sengupta', email: 'diya@campus.edu' },
    { id: 'rohan', name: 'Rohan Verma', email: 'rohan@campus.edu' },
    { id: 'ananya', name: 'Ananya Iyer', email: 'ananya@campus.edu' }
  ];
}

// --- 2. LOGIN OR REGISTER USER ---
// Sends login/signup request to server; falls back to local storage authentication if offline
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
        // Save logged-in user profile to localStorage
        localStorage.setItem('quizmaster_user', JSON.stringify(data.user));
        return data.user;
      }
    }
  } catch (e) {
    console.warn('Server offline, logging in locally:', e);
  }

  // Fallback: create and store user locally in browser
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

// --- 3. SAVE QUIZ SCORE ---
// Sends completed quiz attempt to the server to update history and leaderboard
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

  // Fallback: append attempt to local storage history array
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

// --- 4. FETCH USER HISTORY ---
// Loads past test records for the current user from backend or localStorage
export async function fetchUserHistory(userId) {
  try {
    const res = await fetch(`${SERVER_URL}/api/history?userId=${encodeURIComponent(userId)}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Server offline, loading local history:', e);
  }
  // Fallback: read records directly from browser localStorage
  return JSON.parse(localStorage.getItem('quizmaster_history') || '[]');
}

// --- 5. FETCH LEADERBOARD ---
// Fetches the top 5 highest-scoring attempts across all students
export async function fetchLeaderboard() {
  try {
    const res = await fetch(`${SERVER_URL}/api/leaderboard`);
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data.slice(0, 5) : [];
    }
  } catch (e) {
    console.warn('Server offline, generating local leaderboard:', e);
  }

  // Fallback sample top 5 leaderboard entries
  return [
    { rank: 1, name: 'Diya Sengupta', subject: 'Open Trivia (HTML)', score: 10, total: 10, percentage: 100 },
    { rank: 2, name: 'Aarav Patel', subject: 'Open Trivia (JAVASCRIPT)', score: 39, total: 40, percentage: 98 },
    { rank: 3, name: 'Diya Sengupta', subject: 'Open Trivia (REACT)', score: 38, total: 40, percentage: 95 },
    { rank: 4, name: 'Rohan Verma', subject: 'Open Trivia (LOGIC REASONING)', score: 37, total: 40, percentage: 93 },
    { rank: 5, name: 'Aarav Patel', subject: 'Open Trivia (COMPUTERS)', score: 37, total: 40, percentage: 93 }
  ];
}

