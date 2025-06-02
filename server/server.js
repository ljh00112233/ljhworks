const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const categoriesRouter = require('./routes/categories');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ 서버 정상 작동 중');
});

app.use('/auth', authRoutes);  // 로그인 관련 API
app.use('/api/categories', categoriesRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
