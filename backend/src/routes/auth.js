const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

const USERS_FILE = path.join(__dirname, '../../data/users.json');

function loadUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return new Map(Object.entries(JSON.parse(raw)));
  } catch {
    return new Map();
  }
}

function saveUsers(map) {
  const dir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(Object.fromEntries(map), null, 2), 'utf8');
}

const users = loadUsers();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { email, password, companyName } = req.body;

  if (!email || !password || !companyName) {
    return res.status(400).json({ success: false, error: 'Email, password, and company name are required' });
  }
  if (password.length < 8) {
    return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
  }
  if (users.has(email.toLowerCase())) {
    return res.status(409).json({ success: false, error: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const installerId = `inst_${Date.now()}`;
  const user = {
    id: installerId,
    email: email.toLowerCase(),
    passwordHash,
    companyName,
    createdAt: new Date().toISOString(),
  };
  users.set(email.toLowerCase(), user);
  saveUsers(users);

  const token = jwt.sign({ id: installerId, email: user.email, companyName }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ success: true, data: { token, installerId, email: user.email, companyName } });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  const user = users.get(email.toLowerCase());
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, companyName: user.companyName },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ success: true, data: { token, installerId: user.id, email: user.email, companyName: user.companyName } });
});

module.exports = router;
