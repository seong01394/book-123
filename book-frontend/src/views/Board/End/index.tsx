
import { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import './style.css';

export default function End() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]); // 가정: 검색 결과를 문자열 배열로 받음

  const handleSearch = () => {
    // 검색 로직을 추가: query를 서버에 보내고 검색 결과를 받아와 setSearchResults로 설정
    // 예시: fetch 또는 axios를 사용하여 서버에 GET 요청을 보내고, 받은 데이터를 setSearchResults로 설정
  };

  return (
    <div className="container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="검색어를 입력하세요..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} className='icon'> <AiOutlineSearch/> </button>
      </div>
      <div className="search-results">
        {searchResults.map((result, index) => (
          <div key={index} className="result-item">
            {result}
          </div>
        ))}
      </div>
    </div>
  );
}

