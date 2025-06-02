import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Sidebar Component (Bootstrap)
 * - 좌측 고정 사이드바
 * - 프로필/소개글
 * - 동적 카테고리 목록 + 생성 기능
 */
export default function Sidebar() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('카테고리 조회 실패', err);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const name = newCategory.trim();
    if (!name) return;
    try {
      const res = await api.post('/categories', { name });
      setCategories(prev => [...prev, res.data]);
      setNewCategory('');
    } catch (err) {
      console.error('카테고리 생성 실패', err);
    }
  };

  return (
    <aside className="sidebar bg-light vh-100 p-3 border-end">
      {/* 프로필/소개 영역 */}
      <div className="sidebar-profile text-center mb-4">
        <img
          src="/path/to/profile.jpg"
          alt="Profile"
          className="rounded-circle mb-2"
          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
        />
        <h5>진혁 이</h5>
        <p className="text-muted">Full-stack Developer</p>
      </div>

      {/* 카테고리 네비게이션 + 생성 폼 */}
      <nav>
        <h6 className="sidebar-heading px-3 mb-2 text-muted">Categories</h6>
        {user?.isAdmin && (
          <form className="d-flex mb-3" onSubmit={handleAddCategory}>
            <input
              type="text"
              className="form-control me-2"
              placeholder="Add category"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
            />
            <button className="btn btn-primary mt-3" onClick={handleAddCategory}>
              + 카테고리 추가
            </button>
          </form>
        )}
        <ul className="nav flex-column">
          {categories.map(cat => (
            <li key={cat.id} className="nav-item mb-1">
              <NavLink
                to={`/posts?category=${cat.key}`}
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                {cat.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
