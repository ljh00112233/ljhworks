import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>홈페이지</h1>
      <button onClick={() => navigate('/login')}>로그인 하러 가기</button>
    </div>
  );
};

export default Home;
