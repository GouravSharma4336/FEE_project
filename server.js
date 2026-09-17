/**
 * QuizMaster - Backend HTTP Server (server.js)
 * Lightweight server built with Node.js built-in modules (http, fs, path, url).
 * Persists accounts in data/accounts.json and quiz history in data/userHistory.json.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve current directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Port configuration (defaults to 5000) and data file paths
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json');
const HISTORY_FILE = path.join(DATA_DIR, 'userHistory.json');

// Ensure data folder and JSON files exist on disk
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ACCOUNTS_FILE)) fs.writeFileSync(ACCOUNTS_FILE, '[]', 'utf8');
if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, '{}', 'utf8');

// Helper to read and parse JSON file safely
function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8') || '[]');
  } catch (e) {
    return Array.isArray(JSON.parse('[]')) ? [] : {};
  }
}

// Helper to write formatted JSON data back to file
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// Helper to enable CORS so the Vite frontend can communicate from other ports or LAN IP
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Create HTTP server handling API routes
const server = http.createServer((req, res) => {
  setCors(res);

  // Pre-flight OPTIONS request handling for CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = reqUrl.pathname;

  // 1. GET /api/accounts - Returns safe student accounts (without passwords)
  if (req.method === 'GET' && pathname === '/api/accounts') {
    const accounts = readJSON(ACCOUNTS_FILE);
    const safe = accounts.map(({ id, name, email }) => ({ id, name, email }));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(safe));
    return;
  }

  // 2. POST /api/login - Authenticates student or automatically registers new account
  if (req.method === 'POST' && pathname === '/api/login') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { email, password, name } = JSON.parse(body || '{}');
        const accounts = readJSON(ACCOUNTS_FILE);
        const identifier = (email || '').toLowerCase().trim();

        // Search for existing account by email, ID, or name
        let account = accounts.find(a =>
          a.email.toLowerCase() === identifier ||
          a.id.toLowerCase() === identifier ||
          a.name.toLowerCase() === identifier
        );

        if (!account) {
          // Auto-register new student account if not found
          const newName = name || identifier.split('@')[0] || 'Student';
          const newId = newName.toLowerCase().replace(/\s+/g, '_');
          account = {
            id: newId,
            name: newName,
            email: identifier.includes('@') ? identifier : `${newId}@campus.edu`,
            password: password || '123'
          };
          accounts.push(account);
          writeJSON(ACCOUNTS_FILE, accounts);

          // Initialize empty history for this new student
          const history = readJSON(HISTORY_FILE);
          if (!history[account.id]) {
            history[account.id] = [];
            writeJSON(HISTORY_FILE, history);
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          user: { id: account.id, name: account.name, email: account.email }
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // 3. POST /api/scores - Saves a completed quiz attempt into student's history
  if (req.method === 'POST' && pathname === '/api/scores') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const attempt = JSON.parse(body || '{}');
        const userId = attempt.userId || 'guest';
        const history = readJSON(HISTORY_FILE);
        if (!history[userId]) history[userId] = [];

        // Build new attempt record
        const newRecord = {
          id: Date.now(),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          subject: attempt.subject || 'Mixed Drill',
          difficulty: attempt.difficulty || 'MEDIUM',
          score: attempt.score || 0,
          total: attempt.total || 0,
          percentage: attempt.percentage || 0
        };

        // Add to front of history list and save to file
        history[userId].unshift(newRecord);
        writeJSON(HISTORY_FILE, history);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, record: newRecord }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to record score' }));
      }
    });
    return;
  }

  // 4. GET /api/history - Returns quiz attempt logs for a specific user
  if (req.method === 'GET' && pathname === '/api/history') {
    const userId = reqUrl.searchParams.get('userId') || '';
    const history = readJSON(HISTORY_FILE);
    const userLogs = history[userId] || [];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(userLogs));
    return;
  }

  // 5. GET /api/leaderboard - Aggregates Top 5 highest-scoring attempts across all students
  if (req.method === 'GET' && pathname === '/api/leaderboard') {
    const accounts = readJSON(ACCOUNTS_FILE);
    const history = readJSON(HISTORY_FILE);

    // Map user IDs to student names
    const accountMap = {};
    accounts.forEach(a => { accountMap[a.id] = a.name; });

    // Collect all attempts into a single flat array
    const allAttempts = [];
    Object.entries(history).forEach(([uId, attempts]) => {
      const studentName = accountMap[uId] || uId;
      attempts.forEach(att => {
        allAttempts.push({
          userId: uId,
          name: studentName,
          date: att.date,
          subject: att.subject,
          difficulty: att.difficulty,
          score: att.score,
          total: att.total,
          percentage: att.percentage
        });
      });
    });

    // Sort descending by percentage accuracy, then by raw score
    allAttempts.sort((a, b) => (b.percentage - a.percentage) || (b.score - a.score));

    // Extract top 5 ranked attempts
    const top5 = allAttempts.slice(0, 5).map((att, idx) => ({
      rank: idx + 1,
      ...att
    }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(top5));
    return;
  }

  // 6. Serve production static files from dist/ (if built)
  const distDir = path.join(__dirname, 'dist');
  if (fs.existsSync(distDir)) {
    let filePath = path.join(distDir, pathname === '/' ? 'index.html' : pathname);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(distDir, 'index.html'); // SPA fallback for direct route loads
    }
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.jpg': 'image/jpeg',
      '.png': 'image/png',
      '.svg': 'image/svg+xml'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
    return;
  }

  // Fallback 404 for unknown endpoints
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

// Start listening on specified port
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 QuizMaster Multi-User Server is LIVE on port ${PORT}!`);
  console.log(`Local Access:   http://localhost:${PORT}`);
  console.log(`API Endpoints:  /api/accounts | /api/leaderboard | /api/history`);
  console.log(`======================================================\n`);
});
