import { ChangeEvent, KeyboardEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import FilterPage from "../filter/Filter.container";
import PaginationPage from "../pagination/Pagination.container";
import * as S from "./Board.styles";

export interface Word {
  word: string;
  address: string;
  name: string;
}

interface IPropsBoardPresenter {
  data?: any;
  allData?: any;
  setAllData: any;
  getData: () => void;
  onChangeKeyword: (event: ChangeEvent<HTMLInputElement>) => void;
  keyword: string;
  onClickFilterIcon: () => void;
  isFilter: boolean;
  onKeyUp: (event: KeyboardEvent<HTMLInputElement>) => void;
  isSearch: boolean;
  getFilterData: (filterCount: number) => void;
  word?: Word[] | undefined;
  
  onClickWord: (event: any) => void;
  setData: any;
  getAllData: () => void;
  getPage: (page: number) => void;
  total: number;
  updateData: any;
  inputRef: any;
}
export default function BoardPresenter(props: IPropsBoardPresenter) {
  return (
    <S.Wrapper>
      <S.TopDiv>
        <S.Content>
          봉담 식당 정보. <br />
          같이 즐겨요!{" "}
        </S.Content>
        <S.SearchWrapper>
          <S.SearchForm
          // onSubmit={props.onClickSearch}
          // method="POST"
          // autoComplete="off"
          >
            <S.SearchInput
              placeholder="검색"
              type="text"
              onChange={props.onChangeKeyword}
              onKeyUp={props.onKeyUp}
              value={props.keyword || ""}
              ref={props.inputRef}
            />
            <S.SearchBtn
              type="button"
              // FiSearch
              // style={{ fontSize: 14, cursor: "pointer" }}
            >
              Search
            </S.SearchBtn>
          </S.SearchForm>
          {props.isSearch && props.keyword && (
            <S.Dropdown>
              {Array.isArray(props.word) && props.word.map((el, idx) => (
                <div key={uuidv4()}>
                  <S.Word
                    onClick={props.onClickWord}
                    id={el.word}
                    tabIndex={idx + 1}
                  >
                    {el.word}
                  </S.Word>
                </div>
              ))}
            </S.Dropdown>
          )}
        </S.SearchWrapper>
      </S.TopDiv>
      <S.FilterDiv>
        <S.FilterTop>
          <S.Total>
            식당 정보
            <span style={{ color: "#4498F2" }}>{props.total}</span>
          </S.Total>
          <S.FilterIcon
            src={
              props.isFilter ? "images/filter-active.png" : "/images/filter.svg"
            }
            onClick={props.onClickFilterIcon}
          />
        </S.FilterTop>
        {props.isFilter && (
          <FilterPage
            getFilterData={props.getFilterData}
            getPage={props.getPage}
          />
        )}

      {Array.isArray(props.data) && props.data.map((el: any) => (
          <S.FilterItem
            key={uuidv4()}
            style={{ height: el.nickname.length >= 8 ? "118px" : "94px" }}
          >
            <S.Profile src="/images/profile.png" />
            <S.ProfileContent>
              <S.ContentTop>
                <span
                  style={{
                    paddingRight: el.nickname.length >= 8 ? 0 : "12px",
                    display: el.nickname.length >= 8 ? "block" : "inline",
                  }}
                >
                  {el.nickname
                    .replaceAll(props.keyword, `#$%${props.keyword}#$%`)
                    .split("#$%")
                    .map((search: string) => (
                      <S.Keyword
                        key={uuidv4()}
                        isMatched={props.keyword === search}
                      >
                        {search}
                      </S.Keyword>
                    ))}
                </span>

                <S.BuildingCount>
                  조회수{el.building_count}
                </S.BuildingCount>
              </S.ContentTop>
              <S.ContentBottom>
                <S.CircleWrapper style={{ marginRight: 12 }}>
                  <S.Circle style={{ background: "#FFDC3C" }}>종류</S.Circle>
                  <span>{el.nickname}</span>
                </S.CircleWrapper>

                <S.CircleWrapper>
                  <S.Circle style={{ background: "#4498F2" }}>주소</S.Circle>
                  <span>{el.oname}</span>
                </S.CircleWrapper>
              </S.ContentBottom>
            </S.ProfileContent>
          </S.FilterItem>
        ))}
      </S.FilterDiv>

      <PaginationPage
        setData={props.setData}
        data={props.data}
        allData={props.allData}
        getAllData={props.getAllData}
        getPage={props.getPage}
        getFilterData={props.getFilterData}
      />
    </S.Wrapper>
  );
}
