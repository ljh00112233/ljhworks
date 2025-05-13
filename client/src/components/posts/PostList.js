import React from 'react';
import { Link } from 'react-router-dom';

export default function PostList({ posts = [] }) {
  return (
    <ul className="list-unstyled">
      {posts.map(post => (
        <li key={post.id} className="mb-3">
          <Link to={`/posts/${post.id}`} className="text-decoration-none">
            <div className="d-flex align-items-center">
              {post.thumbnailUrl && (
                <img
                  src={post.thumbnailUrl}
                  alt=""
                  className="me-3"
                  style={{ width: 64, height: 64, objectFit: 'cover' }}
                />
              )}
              <div>
                <h5 className="mb-1">{post.title}</h5>
                <small className="text-muted">{post.views} views</small>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
