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

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      alert('삭제 실패');
    }
  };

  const handleUpdateCategory = async (id, newName) => {
    if (!newName.trim()) return;
    try {
      await api.put(`/categories/${id}`, { name: newName });
      setCategories(prev =>
        prev.map(cat => (cat.id === id ? { ...cat, name: newName } : cat))
      );
    } catch (err) {
      alert(err.response?.data?.error || '수정 실패');
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
        <h5>이진혁</h5>
        <p className="text-muted">Full-stack Developer</p>
      </div>

      {/* 카테고리 생성 폼 (관리자만) */}
      {user?.isAdmin && (
        <form className="d-flex mb-3" onSubmit={handleAddCategory}>
          <input
            type="text"
            className="form-control me-2"
            placeholder="Add category"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
          />
          <button className="btn btn-primary">추가</button>
        </form>
      )}

      {/* 카테고리 리스트 */}
      <nav>
        <h6 className="sidebar-heading px-3 mb-2 text-muted">Categories</h6>
        <ul className="nav flex-column">
          {categories.map(cat => (
            <li key={cat.id} className="nav-item mb-1 d-flex justify-content-between align-items-center">
              <NavLink
                to={`/posts?category=${cat.name}`}
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                {cat.name}
              </NavLink>

              {user?.isAdmin && (
                <div className="btn-group ms-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      const newName = prompt('새 이름을 입력하세요', cat.name);
                      if (newName) handleUpdateCategory(cat.id, newName);
                    }}
                  >
                    수정
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteCategory(cat.id)}
                  >
                    삭제
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
