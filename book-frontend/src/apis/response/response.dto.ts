import { ResponseCode } from 'types/enum';

export default interface ResponseDto {
  code: ResponseCode;
  message: string;
}
