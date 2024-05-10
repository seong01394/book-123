import React, { ChangeEvent, useEffect, useState } from 'react';
import BoardPresenter from './Board.presenter';
import jsonData from '../../../assets/projdb_comp.json'; // Import the JSON file

const BoardContainer: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState<any[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    
  }, []);

  const lists = jsonData.rows.filter((jsonData) => {
    // null 체크 및 문자열 여부 확인
    const name = typeof jsonData[3] === 'string' ? jsonData[3] : '';
    const product = typeof jsonData[4] === 'string' ? jsonData[4] : '';
    return name.includes(keyword) || product.includes(keyword);
  });

  const handleInputChange = async () => {
    try {
      const response = jsonData.rows.filter((jsonData) => {
        // null 체크 및 문자열 여부 확인
        const name = typeof jsonData[3] === 'string' ? jsonData[3] : '';
        const product = typeof jsonData[4] === 'string' ? jsonData[4] : '';
        return name.includes(keyword) || product.includes(keyword);
      });
      setSearch(response);
      setIsSearch(true);
      setError('');
    } catch (error) {
      console.error('Error searching data:', error);
      setError('Failed to search data. Please try again later.');
    }
  };

  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  return (
    <BoardPresenter
      data={data}
      search={search}
      onChangeKeyword={handleChangeKeyword}
      onSearch={handleInputChange}
      keyword={keyword}
      isSearch={isSearch}
      error={error}
    />
  );
};

export default BoardContainer;
