import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
});

// 토큰 자동 첨부, 401 리프레시 처리 등 인터셉터 설정이 필요하다면 여기에 추가하세요

export default api;
