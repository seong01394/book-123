import styled from '@emotion/styled';
import { FaStar } from 'react-icons/fa';

export const TopDiv = styled.div`
  padding-top: 20px; // 상단 패딩을 줄여 컴포넌트를 상단으로 이동
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const Wrapper = styled.section`
  min-height: calc(100vh - 200px); // 헤더와 footer의 높이를 고려하여 조정
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const H1 = styled.h1`
  font-weight: 700;
  font-size: 40px;
  line-height: 56px;
  text-align: center;
  letter-spacing: -0.05em;

  @media (min-width: 360px) and (max-width: 1023px) {
    font-size: 28px;
    line-height: 36px;
  }
`;

export const Content = styled.p`
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: -0.05em;
  padding: 20px 0 48px 0;
`;

export const SearchWrapper = styled.div`
  width: 800px;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (min-width: 360px) and (max-width: 1023px) {
    width: 320px;
  }
`;

export const Dropdown = styled.div`
  width: 100%;
  height: auto;
  max-height: 172px;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.05em;
  color: #000;
  background: #fff;
  border: 1px solid #000;
  border-radius: 0px 0px 15px 15px;
  padding: 16px 4px;
  position: absolute;
  top: 16px;
  box-sizing: border-box;
  display: none;
`;

export const Word = styled.div`
  padding: 8px 24px;
  background-color: #fff;
  cursor: pointer;
  :hover {
    background-color: #eee;
  }
`;

interface IPropsKeyword {
  isMatched: boolean;
}

export const Keyword = styled.span`
  width: 100%;
  background-color: ${(props: IPropsKeyword) =>
    props.isMatched ? 'rgb(68, 152, 242, 0.5)' : 'none'};
`;

export const FilterDiv = styled.div`
  width: 560px;
  display: flex;
  flex-direction: column;

  @media (min-width: 360px) and (max-width: 1023px) {
    width: 320px;
  }
`;

export const FilterTop = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #000;
  margin-bottom: 24px;
`;

export const Total = styled.div`
  width: 110px;
  height: 32px;
  background-color: black;
  border-radius: 10px 10px 0 0;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.05em;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const FilterIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

export const FilterItem = styled.div`
  width: 100%;
  height: 94px;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #000;
  border-radius: 10px;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const Profile = styled.img`
  width: 60px;
  height: 60px;
  padding: 0 20px 0 24px;
`;

export const ProfileContent = styled.div`
  width: 100%;
  height: 100%;
  font-weight: 700;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: -0.05em;
  color: #000;
  padding: 23px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ContentTop = styled.div`
  width: 85%;
  font-weight: 700;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: -0.05em;
  color: #000;
  align-items: center;
`;

export const Count = styled.span`
  color: #4498f2;
  font-size: 14px;
  line-height: 20px;
  padding-bottom: 8px;
  margin-right: 40px;
`;
export const Favor = styled.span`
  display: flex;
  align-items: center;
  color: #74745d;
  padding-bottom: 8px;
  font-size: 14px;
  line-height: 20px;
`;
export const ContentBottom = styled.div`
  width: 100%;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: -0.05em;
  color: #999;
  display: flex;
`;

export const CircleWrapper = styled.div`
  display: flex;
  align-items: flex-start; /* Circle을 위로 올림 */
  margin-right: 4px; /* 여백 추가 */
`;

export const Circle = styled.div`
  width: 16px;
  height: 16px;
  border: 0.1px solid #000;
  border-radius: 20px;
  font-weight: 700;
  font-size: 8px;
  line-height: 10px;
  text-align: center;
  letter-spacing: -0.05sem;
  color: #000;
  margin-right: 4px; /* 여백 추가 */
  margin-top: 2px; /* Circle을 위로 올림 */
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SearchResultWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 16px;
`;

export const SearchResult = styled.div`
  background-color: #f2f2f2;
  color: #333;
  padding: 8px 16px;
  margin: 4px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #e2e2e2;
  }
`;

export const StarIcon = styled(FaStar)`
  color: ${(props: { isFilled: boolean }) =>
    props.isFilled ? 'yellow' : '#ccc'};
  margin-right: 2px;
`;

export const StarRatingWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const StarRating = styled.div`
  display: flex;
  align-items: center;
`;

export const Rating = styled.span`
  color: #000;
  font-size: 14px;
  line-height: 20px;
  padding-bottom: 8px;
  margin-left: 4px; /* 별점과 평점 사이 여백 */
`;

export const ManitoButton = styled.button`
  width: 80px; // 버튼 너비 조정
  height: 40px; // 버튼 높이 동일하게 설정
  background-color: #f44336; // 배경색
  border: 1px solid #f44336; // 테두리 색
  color: white; // 글자색
  border-radius: 20px; // 전체 둥근 모서리
  cursor: pointer; // 마우스 오버 시 커서 변경
  margin-left: 8px; // 검색 버튼과의 간격

  &:hover {
    background-color: #e31e10;
  }
`;

export const SearchBtn = styled.button`
  width: 100px; // 버튼 너비
  height: 40px; // 버튼 높이
  background-color: #4caf50; // 배경색
  border: 1px solid #4caf50; // 테두리 색
  color: white; // 글자색
  border-radius: 0 20px 20px 0; // 오른쪽 끝에 둥근 모서리
  cursor: pointer; // 마우스 오버 시 커서 변경

  &:hover {
    background-color: #45a049;
  }
`;

export const SearchForm = styled.div`
  width: 100%;
  display: flex;
  align-items: center; // 버튼과 입력창을 수평 정렬
  justify-content: space-between;
`;

export const SearchInput = styled.input`
  flex: 1; // 나머지 공간을 모두 차지하도록 설정
  height: 40px; // 입력창 높이 설정
  padding: 0 12px;
  border: 1px solid #ccc;
  border-right: none; // 오른쪽 테두리 제거
  border-radius: 20px 0 0 20px; // 왼쪽 끝에 둥근 모서리
`;
