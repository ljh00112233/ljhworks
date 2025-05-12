const express = require('express');
const cors = require('cors');
const db = require('./DB'); // 생략 가능

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Server is running');
});

app.get('/test', async (req, res) => {
  res.json({ success: true, message: 'API is alive' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
