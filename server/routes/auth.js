const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query(
      'SELECT id, username, password AS passwordHash, isAdmin FROM users WHERE username = ?',
      [username]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: '사용자를 찾을 수 없음' });
    }

    const userRow = rows[0];
    const match = await bcrypt.compare(password, userRow.passwordHash);
    if (!match) {
      return res.status(401).json({ message: '비밀번호 불일치' });
    }

    const payload = {
      id: userRow.id,
      username: userRow.username,
      isAdmin: !!userRow.isAdmin
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      user: payload,
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
