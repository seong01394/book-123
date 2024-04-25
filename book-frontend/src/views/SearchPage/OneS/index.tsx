import jsonData from '../../../assets/projdb_comp.json'; // Import the JSON file

function Card({ keyData }: { keyData: (string | number | null)[] }) {
  return (
    <div className="cardContainer">
      <h2>상호명 {keyData[3]}</h2>
      <h2>품목 {keyData[4]}</h2>
      <h2>전화번호 {keyData[0]}</h2>
      <h2>네이버 url {keyData[7]}</h2>
    </div>
  );
}

function SearchedList() {
  const keyword = '고기'; // 검색 키워드
  const lists = jsonData.rows.filter((jsonData) => {
    // null 체크 및 문자열 여부 확인
    const name = typeof jsonData[3] === 'string' ? jsonData[3] : '';
    const product = typeof jsonData[4] === 'string' ? jsonData[4] : '';
    return name.includes(keyword) || product.includes(keyword);
  });

  return (
    <>
      <h1>검색 예시</h1>
      {lists.map((jsonData, index) => (
        <Card key={index} keyData={jsonData} />
      ))}
    </>
  );
}

export default SearchedList;
