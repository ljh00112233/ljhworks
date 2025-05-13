import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * LoginPage Component
 * - 관리자 로그인 폼
 * - Bootstrap 스타일 사용
 * - 메시지 알림(setMessage)
 */
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('https://ljhworks.onrender.com/auth/login', { username, password });
      if (res.status === 200) {
        setMessage('✅ 로그인 성공!');
        // 예: 로그인 성공 후 토큰 저장
        const { user, token } = res.data;
        localStorage.setItem('token', token);
        login(user);
        // 로그인 후 원하는 페이지로 이동
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setMessage('❌ 아이디 또는 비밀번호가 틀렸습니다.');
      } else {
        setMessage(`⚠️ 오류 발생: ${err.message}`);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={handleLogin} className="border p-4 rounded" style={{ minWidth: '300px' }}>
        <h3 className="mb-3 text-center">관리자 로그인</h3>
        {message && <div className="alert alert-info">{message}</div>}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">로그인</button>
      </form>
    </div>
  );
}