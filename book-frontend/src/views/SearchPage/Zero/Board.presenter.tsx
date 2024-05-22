import {
  BOARD_GPT_PATH,
  BOARD_PATH,
  SEARCHPAGE_PATH,
  SEARCHPAGE_THREEPATH,
  SEARCHPAGE_TWOPATH,
} from 'constant';
import React from 'react';
import { FaStar } from 'react-icons/fa'; // react-icons/fa에서 FaStar 아이콘을 가져옵니다.
import { useNavigate } from 'react-router-dom';
import ProFileImage from '../../../assets/free-icon-jp-9346261.png';
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
  const navigate = useNavigate();

  const goToGptPage = () => {
    navigate(`${BOARD_PATH()}/${BOARD_GPT_PATH()}`);
  };

  const renderItems = () => {
    const items = props.isSearch ? props.search : props.data;
    if (items.length === 0) {
      return <div>{props.error || ''}</div>; // 에러 메시지 표시
    }
    return items.map((item: any) => (
      <div
        key={item[3]}
        onClick={() =>
          navigate(`${SEARCHPAGE_PATH()}/${SEARCHPAGE_THREEPATH()}`, {
            state: { searchKey: item[3] },
          })
        }
      >
        <S.FilterItem>
          <S.Profile src={ProFileImage} />
          <S.ProfileContent>
            <S.ContentTop>
              <span>{item[3]}</span>
              <S.CircleWrapper>
                <S.Circle>{item.building_count}</S.Circle>
                <S.Count>조회수</S.Count>
                <S.Favor>
                  평점
                  <S.StarRatingWrapper>
                    <StarRating rating={item.rating} />{' '}
                    <S.Rating>{item.rating}</S.Rating>
                  </S.StarRatingWrapper>
                </S.Favor>
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
            <S.SearchBtn type="button" onClick={props.onSearch}>
              Search
            </S.SearchBtn>
            <S.ManitoButton type="button" onClick={goToGptPage}>
              마니또
            </S.ManitoButton>
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

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  return (
    <S.StarRatingWrapper>
      {[...Array(5)].map((_, index) => (
        <FaStar key={index} color={index < fullStars ? 'yellow' : 'gray'} />
      ))}
    </S.StarRatingWrapper>
  );
};

export default BoardPresenter;
