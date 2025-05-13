import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Footer Component (Bootstrap)
 * - 페이지 하단 고정
 * - 좌측: 저작권 정보
 * - 우측: 관리자 로그인/로그아웃 버튼
 */
export default function Footer() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user?.isAdmin) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <footer className="footer bg-light border-top py-3 mt-auto">
      <div className="container d-flex justify-content-between align-items-center">
        {/* 좌측 저작권 정보 */}
        <small className="text-muted">© {new Date().getFullYear()} LJHworks</small>

        {/* 우측 관리자 로그인/로그아웃 버튼 */}
        <button
          type="button"
          className="btn btn-outline-dark btn-sm"
          onClick={handleAuthAction}
        >
          {user?.isAdmin ? '관리자 로그아웃' : '관리자 로그인'}
        </button>
      </div>
    </footer>
  );
}