import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://ljhworks.onrender.com/auth/login', {
        username,
        password
      });

      if (res.status === 200) {
        setMessage('✅ 로그인 성공!');
        // 예: 로그인 성공 후 토큰 저장 또는 이동
        // localStorage.setItem('token', res.data.token);
        // navigate('/admin'); 
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
    <div style={styles.container}>
      <h2>관리자 로그인</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>로그인</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '320px',
    margin: '40px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  input: {
    padding: '10px',
    fontSize: '16px'
  },
  button: {
    padding: '10px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer'
  },
  message: {
    marginTop: '16px',
    fontWeight: 'bold'
  }
};

export default LoginForm;
