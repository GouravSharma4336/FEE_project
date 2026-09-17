/**
 * QuizMaster - Lightweight Shared Multi-Device Server (fp4/server.js)
 * Zero external dependencies (uses Node.js built-in http, fs, path, url).
 * Keeps accounts in data/accounts.json and user-wise history in data/userHistory.json.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json');
const HISTORY_FILE = path.join(DATA_DIR, 'userHistory.json');

// Ensure data files exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ACCOUNTS_FILE)) fs.writeFileSync(ACCOUNTS_FILE, '[]', 'utf8');
if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, '{}', 'utf8');

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8') || '[]');
  } catch (e) {
    return Array.isArray(JSON.parse('[]')) ? [] : {};
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const server = http.createServer((req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = reqUrl.pathname;

  // 1. GET /api/accounts
  if (req.method === 'GET' && pathname === '/api/accounts') {
    const accounts = readJSON(ACCOUNTS_FILE);
    const safe = accounts.map(({ id, name, email }) => ({ id, name, email }));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(safe));
    return;
  }

  // 2. POST /api/login
  if (req.method === 'POST' && pathname === '/api/login') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { email, password, name } = JSON.parse(body || '{}');
        const accounts = readJSON(ACCOUNTS_FILE);
        const identifier = (email || '').toLowerCase().trim();

        let account = accounts.find(a =>
          a.email.toLowerCase() === identifier ||
          a.id.toLowerCase() === identifier ||
          a.name.toLowerCase() === identifier
        );

        if (!account) {
          // Auto-register new student account
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

          // Initialize history
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

  // 3. POST /api/scores - Save quiz attempt to user-wise history
  if (req.method === 'POST' && pathname === '/api/scores') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const attempt = JSON.parse(body || '{}');
        const userId = attempt.userId || 'guest';
        const history = readJSON(HISTORY_FILE);
        if (!history[userId]) history[userId] = [];

        const newRecord = {
          id: Date.now(),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          subject: attempt.subject || 'Mixed Drill',
          difficulty: attempt.difficulty || 'MEDIUM',
          score: attempt.score || 0,
          total: attempt.total || 0,
          percentage: attempt.percentage || 0
        };

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

  // 4. GET /api/history - User-specific quiz attempts
  if (req.method === 'GET' && pathname === '/api/history') {
    const userId = reqUrl.searchParams.get('userId') || '';
    const history = readJSON(HISTORY_FILE);
    const userLogs = history[userId] || [];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(userLogs));
    return;
  }

  // 5. GET /api/leaderboard - Top 10 scores across ALL student accounts
  if (req.method === 'GET' && pathname === '/api/leaderboard') {
    const accounts = readJSON(ACCOUNTS_FILE);
    const history = readJSON(HISTORY_FILE);

    const accountMap = {};
    accounts.forEach(a => { accountMap[a.id] = a.name; });

    // Flatten all attempts across all accounts
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

    // Sort descending by percentage, then by score
    allAttempts.sort((a, b) => (b.percentage - a.percentage) || (b.score - a.score));

    // Pick Top 10
    const top10 = allAttempts.slice(0, 10).map((att, idx) => ({
      rank: idx + 1,
      ...att
    }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(top10));
    return;
  }

  // 6. Serve built static files from fp4/dist (if available)
  const distDir = path.join(__dirname, 'dist');
  if (fs.existsSync(distDir)) {
    let filePath = path.join(distDir, pathname === '/' ? 'index.html' : pathname);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(distDir, 'index.html'); // SPA fallback
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

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 QuizMaster Multi-User Server is LIVE on port ${PORT}!`);
  console.log(`Local Access:   http://localhost:${PORT}`);
  console.log(`API Endpoints:  /api/accounts | /api/leaderboard | /api/history`);
  console.log(`======================================================\n`);
});
