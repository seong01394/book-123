import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from 'react';
import BoardPresenter from './Board.presenter';

const BoardContainer: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState<any[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await axios.get('http://localhost:9000/data');
        setData(responseData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    try {
      const encodedKeyword = encodeURIComponent(keyword); // 검색어 인코딩
      const response = await axios.get(
        `http://localhost:9000/search?q=${encodedKeyword}`,
      );
      setSearch(response.data);
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
      onSearch={handleSearch}
      keyword={keyword}
      isSearch={isSearch}
      error={error}
    />
  );
};

export default BoardContainer;
