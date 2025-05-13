const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../config/db');

/**
 * 세션 기반 로그인/로그아웃 라우터
 * - JWT 미사용
 * - express-session 미들웨어 필요 (app.js에서 설정)
 */

// 로그인
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // 사용자 조회 (id, username, password 해시, isAdmin)
    const [rows] = await db.query(
      'SELECT id, username, password AS passwordHash, isAdmin FROM users WHERE username = ?',
      [username]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const userRow = rows[0];
    const match = await bcrypt.compare(password, userRow.passwordHash);
    if (!match) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // 세션에 유저 정보 저장
    req.session.user = {
      id: userRow.id,
      username: userRow.username,
      isAdmin: !!userRow.isAdmin
    };

    // 클라이언트에 유저 정보만 반환
    res.json({
      id:   userRow.id,
      username: userRow.username,
      isAdmin: userRow.isAdmin
    });
  } catch (err) {
    console.error('Auth login error:', err);
    res.status(500).json({ message: '서버 내부 오류' });
  }
});

// 로그아웃
router.post('/logout', (req, res) => {
  // 세션 삭제
  req.session.destroy(err => {
    if (err) {
      console.error('Session destroy error:', err);
      return res.status(500).json({ message: '로그아웃 실패' });
    }
    res.clearCookie('connect.sid'); // 기본 세션 쿠키 이름
    res.json({ message: '로그아웃 되었습니다.' });
  });
});

// 현 로그인 사용자 정보 조회
router.get('/me', (req, res) => {
  if (req.session.user) {
    return res.json(req.session.user);
  }
  res.status(401).json({ message: '로그인이 필요합니다.' });
});

module.exports = router;