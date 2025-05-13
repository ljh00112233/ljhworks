import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * Layout Component
 * - Header, Sidebar, Footer 조합
 * - Bootstrap flexbox 활용한 기본 페이지 구조
 */
export default function Layout({ children }) {
  return (
    <div className="d-flex flex-column vh-100">
      {/* 헤더 */}
      <Header />

      {/* 본문: 사이드바 + 메인 */}
      <div className="d-flex flex-grow-1 overflow-hidden">
        <aside className="col-3 bg-light border-end p-3 overflow-auto">
          <Sidebar />
        </aside>

        <main className="col p-4 overflow-auto">
          {/* HomePage 컨텐츠 */}
        </main>
      </div>

      {/* 푸터 */}
      <Footer />
    </div>
  );
}