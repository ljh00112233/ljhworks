// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../config/db'); // mysql2/promise pool

/**
 * JWT 기반 인증 라우터
 * - 로그인 시 username/password 검증 후 JWT 발급
 * - 이후 클라이언트는 Authorization 헤더에 Bearer 토큰 포함
 */

// 로그인
router.post('/login', async (req, res) => {
  const { username, password } = req.body;  // 요청 바디에서 username, password 추출
  try {
    // 1) 사용자 조회 (username 기준)
    const [rows] = await db.execute(
      'SELECT id, username, password AS passwordHash, isAdmin FROM users WHERE username = ?',
      [username]
    );
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: '존재하지 않는 사용자입니다.' });
    }

    // 2) 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    // 3) JWT 토큰 발급 (payload에 isAdmin 포함)
    const payload = { id: user.id, username: user.username, isAdmin: !!user.isAdmin };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 4) 클라이언트에 토큰과 유저 정보 반환
    res.json({ message: '로그인 성공', token, user: payload });
  } catch (err) {
    console.error('Auth login error:', err);
    res.status(500).json({ error: '서버 오류: 로그인 실패' });
  }
});

// 토큰 검증 미들웨어
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: '토큰이 필요합니다.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
    req.user = user;
    next();
  });
}

// 보호가 필요한 라우트 예시
router.get('/me', authenticateToken, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username, isAdmin: req.user.isAdmin });
});

module.exports = router;