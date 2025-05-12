const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) return res.status(401).json({ message: '사용자를 찾을 수 없음' });

    const match = await bcrypt.compare(password, rows[0].password);
    if (!match) return res.status(401).json({ message: '비밀번호 불일치' });

    res.status(200).json({ message: '로그인 성공' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username FROM users');
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
