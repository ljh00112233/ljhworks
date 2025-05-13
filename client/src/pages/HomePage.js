import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import PostList from '../components/posts/PostList';
import { Link } from 'react-router-dom';

/**
 * HomePage
 * - 전체 최신 글 5개 표시
 * - 각 카테고리별 최신 글 5개씩 표시
 */
export default function HomePage() {
  const [latestPosts, setLatestPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryPosts, setCategoryPosts] = useState({});

  useEffect(() => {
    // 1) 전체 최신 글 5개
    api.get('/posts?limit=5&sort=latest')
      .then(res => setLatestPosts(res.data.items))
      .catch(err => console.error(err));

    // 2) 카테고리 목록 조회
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    // 각 카테고리별 최신 글 5개
    categories.forEach(cat => {
      api.get(`/posts?category=${cat.key}&limit=5&sort=latest`)
        .then(res => {
          setCategoryPosts(prev => ({
            ...prev,
            [cat.key]: res.data.items
          }));
        })
        .catch(err => console.error(err));
    });
  }, [categories]);

  return (
    <div>
      {/* 전체 최신 글 */}
      <section className="mb-5">
        <h2>Latest Posts</h2>
        <PostList posts={latestPosts} />
        <div className="text-end">
          <Link to="/posts" className="btn btn-link">
            더보기 →
          </Link>
        </div>
      </section>

      {/* 카테고리별 최신 글 */}
      {categories.map(cat => (
        <section key={cat.key} className="mb-5">
          <h3>{cat.name}</h3>
          <PostList posts={categoryPosts[cat.key] || []} />
          <div className="text-end">
            <Link to={`/posts?category=${cat.key}`} className="btn btn-sm btn-outline-primary">
              더보기
            </Link>
          </div>
        </section>
      ))}
    </div>
  );
}