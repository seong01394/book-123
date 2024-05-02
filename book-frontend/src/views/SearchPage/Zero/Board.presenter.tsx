import {
  SEARCHPAGE_ONEPATH,
  SEARCHPAGE_PATH,
  SEARCHPAGE_TWOPATH,
} from 'constant';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './Board.styles';

interface IPropsBoardPresenter {
  data: any[];
  search: any[];
  onChangeKeyword: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  keyword: string;
  isSearch: boolean;
  error: string;
}

const BoardPresenter: React.FC<IPropsBoardPresenter> = (props) => {
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      await props.onSearch(); // 검색 실행
      setError(''); // 에러 초기화
    } catch (error) {
      setError('Failed to search data. Please try again later.'); // 검색 오류 발생 시 에러 설정
    }
  };

  const renderItems = () => {
    const items = props.isSearch ? props.search : props.data;
    if (items.length === 0) {
      return <div>{props.error || 'No results found.'}</div>; // 에러 메시지 표시
    }
    return items.map((item: any) => (
      <div
        key={item.nickname}
        onClick={() =>
          navigate(`${SEARCHPAGE_PATH()}/${SEARCHPAGE_ONEPATH(item.id)}`)
        }
      >
        <S.FilterItem>
          <S.Profile src="profile.jpg" alt="Profile" />
          <S.ProfileContent>
            <S.ContentTop>
              <span>{item.nickname}</span>
              <S.CircleWrapper>
                <S.Circle>{item.building_count}</S.Circle>
                <S.Count>건물수</S.Count>
              </S.CircleWrapper>
            </S.ContentTop>
            <S.ContentBottom>{item.oname}</S.ContentBottom>
          </S.ProfileContent>
        </S.FilterItem>
      </div>
    ));
  };

  return (
    <S.Wrapper>
      <S.TopDiv>
        <S.H1>
          봉담 식당 정보. <br /> 같이 즐겨요!
        </S.H1>
        <S.Content>봉담 식당 정보를 검색해보세요.</S.Content>
        <S.SearchWrapper>
          <S.SearchForm>
            <S.SearchInput
              placeholder="검색"
              type="text"
              onChange={props.onChangeKeyword}
              value={props.keyword || ''}
            />
            <S.SearchBtn type="button" onClick={handleSearch}>
              Search
            </S.SearchBtn>
          </S.SearchForm>
          <S.Dropdown>
            {props.search.map((tab: any) => (
              <S.Word
                key={tab.id}
                onClick={() =>
                  navigate(`${SEARCHPAGE_PATH()}/${SEARCHPAGE_TWOPATH()}`)
                }
              >
                {tab.word}
              </S.Word>
            ))}
          </S.Dropdown>
        </S.SearchWrapper>
      </S.TopDiv>
      <S.FilterDiv>{renderItems()}</S.FilterDiv>
    </S.Wrapper>
  );
};

export default BoardPresenter;
