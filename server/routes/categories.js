const express = require('express');
const router = express.Router();
const db = require('../config/db'); // DB 연결 모듈

// 카테고리 생성 API
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO categories (name) VALUES (?)',
      [name]
    );
    const newCategory = { id: result.insertId, name };
    res.status(201).json(newCategory);
  } catch (err) {
    console.error('카테고리 생성 실패:', err);
    res.status(500).json({ error: '카테고리 생성 실패' });
  }
});

module.exports = router;
