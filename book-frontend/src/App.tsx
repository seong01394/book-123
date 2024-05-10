import { getSignInUserRequest } from 'apis';
import { ResponseDto } from 'apis/response';
import { GetSignInUserResponseDto } from 'apis/response/user';
import {
  AUTH_PATH,
  BOARD_DETAILPATH,
  BOARD_END_PATH,
  BOARD_GPT_PATH,
  BOARD_PATH,
  BOARD_UPDATE_PATH,
  BOARD_WRITE_PATH,
  MAIN_PATH,
  SEARCHPAGE_ONEPATH,
  SEARCHPAGE_PATH,
  SEARCHPAGE_THREEPATH,
  SEARCHPAGE_TWOPATH,
  SEARCH_PATH,
  USER_PATH,
} from 'constant';
import Container from 'layouts/Container';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Route, Routes } from 'react-router-dom';
import { useLoginUserStore } from 'stores';
import { User } from 'types/interface';
import Authentication from 'views/Authentication';
import Detail from 'views/Board/Detail';
import End from 'views/Board/End';
import Gpt from 'views/Board/Gpt';
import Update from 'views/Board/Update';
import Write from 'views/Board/Write';
import Main from 'views/Main';
import Search from 'views/Search';
import OneS from 'views/SearchPage/OneS';
import ThreeS from 'views/SearchPage/ThreeS';
import TwoS from 'views/SearchPage/TwoS';
import UserP from 'views/User';
import './App.css';

//                component(app)                    //
function App() {
  // state: 로그인 유저 전역 상태   //
  const { setLoginUser, resetLoginUser } = useLoginUserStore();
  //      state: cookie 상태      //
  const [cookies, setCookie] = useCookies();
  //      function: get sign in user response 처리 함수     //
  const getSignInUserResponse = (
    responseBody: GetSignInUserResponseDto | ResponseDto | null,
  ) => {
    if (!responseBody) return;
    const { code } = responseBody;
    if (code === 'AF' || code === 'NU' || code === 'DBE') {
      resetLoginUser();
      return;
    }
    const loginUser: User = { ...(responseBody as GetSignInUserResponseDto) };
    setLoginUser(loginUser);
  };
  // effect: accessToken cookie 값이 변경될 때 마다 실행할 함수     //
  useEffect(() => {
    if (!cookies.accessToken) {
      resetLoginUser();
      return;
    }
    getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
  }, [cookies.accessToken]);
  //                render(app)             //
  //              description: 메인화면 : '/' - Main //
  //              description: 로그인 + 회원가입 : '/auth' - Authentication   //
  //              description: 검색화면: '/search/:word' - Search //
  //              description: 유저 페이지 : '/user/:userEmail' -User //
  //              description: 게시물 상세보기 : 'board/detail/:boardNumber' - Boarddetail //
  //              description: 게시물 작성하기 : 'board/write' - Boardwrite //
  //              description: 게시물 수정하기 : 'board/update/:boardNumber' - Boardupdate  //
  //              description: gpt : 'board/gpt' - Boardgpt //
  return (
    <Routes>
      <Route element={<Container />}>
        <Route path={MAIN_PATH()} element={<Main />} />
        <Route path={AUTH_PATH()} element={<Authentication />} />
        <Route path={SEARCH_PATH(':searchWord')} element={<Search />} />
        <Route path={SEARCHPAGE_PATH()}>
          <Route path={SEARCHPAGE_ONEPATH(':id')} element={<OneS />} />
          <Route path={SEARCHPAGE_TWOPATH()} element={<TwoS />} />
          <Route path={SEARCHPAGE_THREEPATH()} element={<ThreeS />}></Route>
        </Route>
        <Route path={USER_PATH(':userEmail')} element={<UserP />} />
        <Route path={BOARD_PATH()}>
          <Route path={BOARD_DETAILPATH(':boardNumber')} element={<Detail />} />
          <Route path={BOARD_END_PATH()} element={<End />} />
          <Route path={BOARD_GPT_PATH()} element={<Gpt />} />
          <Route path={BOARD_WRITE_PATH()} element={<Write />} />
          <Route
            path={BOARD_UPDATE_PATH(':boardNumber')}
            element={<Update />}
          />
        </Route>
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
