import axios from 'axios';
import { SignInRequestDto, SignUpRequestDto } from './request/auth';
import { PostBoardRequestDto } from './request/board';
import { ResponseDto } from './response';
import { SignInResponseDto, SignUpResponseDto } from './response/auth';
import { PostBoardResponseDto } from './response/board';
import { GetSignInUserResponseDto } from './response/user';

const DOMAIN = 'http://localhost:4000';

const API_DOMAIN = `${DOMAIN}/api/v1`;


const authorization = (accessToken: string) => {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;

export const signInRequest = async (requestBody: SignInRequestDto) => {
  const result = await axios
    .post(SIGN_IN_URL(), requestBody)
    .then((response) => {
      const responseBody: SignInResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error.response.data) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};


const POST_BOARD_URL = () => `${API_DOMAIN}/board`;

export const postBoardRequest = async (requestBody: PostBoardRequestDto, accessToken: string) => {
  const result = await axios.post(POST_BOARD_URL(), requestBody, authorization(accessToken))
    .then(response => {
        const responseBody: PostBoardResponseDto = response.data;
        return responseBody;
    })
    .catch(error => {
      if(!error.response) return null;
      const responseBody: ResponseDto =error.response.data;
      return responseBody;
    })
    return result;
}


export const signUpRequest = async (requestBody: SignUpRequestDto) => {
  const result = await axios
    .post(SIGN_UP_URL(), requestBody)
    .then((response) => {
      const responseBody: SignUpResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error.response.data) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};

const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;

export const getSignInUserRequest = async (accessToken: string) => {
  const result = await axios
    .get(GET_SIGN_IN_USER_URL(), authorization(accessToken))
    .then((response) => {
      const responseBody: GetSignInUserResponseDto = response.data;
      return responseBody;
    })
    .catch((error) => {
      if (!error.response) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
    });
  return result;
};

const FILE_DOMAIN = `${DOMAIN}/file`;

const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;

const mutipartFormData = {headers: {'Content-Type': 'multipart/form-data'}};

export const fileUploadRequest = async (data: FormData) => {
    const result = await axios.post(FILE_UPLOAD_URL(), data, mutipartFormData)
      .then(response => {
        const responseBody: string= response.data;
        return responseBody;
      })
      .catch(error => {
          return null;
      })
      return result;
}

const SEARCH_URL = () => `${API_DOMAIN}/board/End`;

export const handleSearch = async (query: string) => {
  try {
    const response = await axios.post(SEARCH_URL(), { query });
    const data = response.data; // 검색 결과 데이터

    // 검색 결과를 반환하거나 다른 작업을 수행할 수 있습니다.
    return data;
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    return null; // 오류 발생 시 null을 반환합니다.
  }
};