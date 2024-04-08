import { User } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface GetSignInUserResponseDto extends ResponseDto, User {
    
}
