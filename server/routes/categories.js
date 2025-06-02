const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ 카테고리 전체 조회
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('[카테고리 조회 실패]:', err);
    res.status(500).json({ error: '카테고리를 불러오는 중 오류가 발생했습니다.' });
  }
});

// ✅ 카테고리 생성 (중복 + 공백 방지)
router.post('/', async (req, res) => {
  const name = req.body.name?.trim();

  if (!name) {
    return res.status(400).json({ error: '카테고리 이름을 입력하세요.' });
  }

  try {
    const [existing] = await db.query('SELECT * FROM categories WHERE LOWER(name) = LOWER(?)', [name]);
    if (existing.length > 0) {
      return res.status(400).json({ error: '이미 존재하는 카테고리입니다.' });
    }

    const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    console.error('[카테고리 생성 실패]:', err);
    res.status(500).json({ error: '카테고리를 생성하는 중 오류가 발생했습니다.' });
  }
});

// ✅ 카테고리 수정
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const name = req.body.name?.trim();

  if (!name) {
    return res.status(400).json({ error: '카테고리 이름을 입력하세요.' });
  }

  try {
    const [existing] = await db.query(
      'SELECT * FROM categories WHERE LOWER(name) = LOWER(?) AND id != ?',
      [name, id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: '이미 존재하는 카테고리입니다.' });
    }

    const [result] = await db.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '카테고리를 찾을 수 없습니다.' });
    }

    res.json({ message: '카테고리 수정 완료', id, name });
  } catch (err) {
    console.error('[카테고리 수정 실패]:', err);
    res.status(500).json({ error: '카테고리를 수정하는 중 오류가 발생했습니다.' });
  }
});

// ✅ 카테고리 삭제
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '카테고리를 찾을 수 없습니다.' });
    }

    res.json({ message: '카테고리 삭제 완료' });
  } catch (err) {
    console.error('[카테고리 삭제 실패]:', err);
    res.status(500).json({ error: '카테고리를 삭제하는 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
