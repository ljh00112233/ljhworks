const express = require('express');
const router = express.Router();
const db = require('../config/db'); // DB 연결 모듈

// ✅ 카테고리 전체 조회
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('카테고리 조회 실패:', err);
    res.status(500).json({ error: '카테고리 조회 실패' });
  }
});

// ✅ 카테고리 생성 (중복 방지 포함)
router.post('/', async (req, res) => {
  const { name } = req.body;

  try {
    // 중복 확인
    const [existing] = await db.query('SELECT * FROM categories WHERE name = ?', [name]);
    if (existing.length > 0) {
      return res.status(400).json({ error: '이미 존재하는 카테고리입니다.' });
    }

    // 추가
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

// ✅ 카테고리 수정 (중복 이름 방지)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const [existing] = await db.query(
      'SELECT * FROM categories WHERE name = ? AND id != ?',
      [name, id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: '이미 존재하는 카테고리입니다.' });
    }

    const [result] = await db.query(
      'UPDATE categories SET name = ? WHERE id = ?',
      [name, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '카테고리가 존재하지 않습니다.' });
    }

    res.json({ message: '카테고리 수정 완료', id, name });
  } catch (err) {
    console.error('카테고리 수정 실패:', err);
    res.status(500).json({ error: '카테고리 수정 실패' });
  }
});

// ✅ 카테고리 삭제
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '카테고리가 존재하지 않습니다.' });
    }

    res.json({ message: '카테고리 삭제 완료' });
  } catch (err) {
    console.error('카테고리 삭제 실패:', err);
    res.status(500).json({ error: '카테고리 삭제 실패' });
  }
});

module.exports = router;