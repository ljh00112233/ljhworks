import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
// import PostsPage from './pages/PostsPage';
// import PostDetailPage from './pages/PostDetailPage';
// import PostEditorPage from './pages/PostEditorPage';
// import PortfolioPage from './pages/PortfolioPage';
// import PortfolioEditorPage from './pages/PortfolioEditorPage';
import LoginPage from './components/auth/LoginPage';
// import ProtectedRoute from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* 로그인은 레이아웃 없이 순수 폼만 */}
      <Route path="/login" element={<LoginPage />} />

      {/* 이 내부에 있는 경로들은 전부 Layout(헤더/사이드/푸터) 적용 */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} /> */}

        {/* 관리자 전용 (작성/수정/삭제 등) */}
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/posts/new" element={<PostEditorPage />} />
          <Route path="/posts/:id/edit" element={<PostEditorPage />} />
          <Route path="/portfolio/new" element={<PortfolioEditorPage />} />
        </Route>

        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/:id" element={<PortfolioPage />} /> */}
      </Route>
    </Routes>
  );
}
