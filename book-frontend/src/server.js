const express = require('express');
const cors = require('cors'); // CORS 미들웨어 추가
const app = express();
const data = require('../public/data/db.json').data;

const PORT = process.env.PORT || 9000;

// 데이터를 미리 소문자로 변환하여 저장
const lowerCaseData = data.map((item) => ({
  ...item,
  nickname: item.nickname.toLowerCase(),
  oname: item.oname.toLowerCase(),
}));

// CORS 미들웨어 사용
app.use(cors());

app.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: '검색어를 입력하세요.' });
  }

  const lowerCaseQ = q.toLowerCase(); // 검색어를 소문자로 변환

  const searchResult = lowerCaseData.filter((item) => {
    // 미리 소문자로 변환된 데이터와 검색어를 비교하여 검색
    return (
      item.nickname.includes(lowerCaseQ) || item.oname.includes(lowerCaseQ)
    );
  });

  if (searchResult.length === 0) {
    return res.status(404).json({ error: '검색 결과를 찾을 수 없습니다.' });
  }

  res.json(searchResult);
});

app.get('/data', (req, res) => {
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.redirect('/data');
});
