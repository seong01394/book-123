import jsonData from '../../../assets/projdb_comp.json'; // Import the JSON file

  //데이터 컴포넌트
  function Card(key=[]) {   
    console.log('key');
    
    return (
      <div className='cardContainer'>
        <h2>상호명   {key[3]}</h2>
        <h2>품목 {key[4]}</h2>
        <h2>전화번호 {key[0]}</h2>
        <h2>네이버 url {key[7]}</h2>
      </div>
    );
  }
  

  function SearchedList() {
    const keyword = "고기"; //검색 키워드
  
    const lists = jsonData.rows.filter((jsonData) => jsonData[3].includes(keyword)||jsonData[4].includes(keyword));//검색 조건
    
    return(
      <>
      <h1>검색 예시</h1>
        {lists.map(jsonData => (
          <Card key={jsonData}{...jsonData} />
        ))}
      </>)
  }

export default SearchedList;
