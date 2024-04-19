package com.example.bookback.dto.response.board;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.bookback.common.ResponseCode;
import com.example.bookback.common.ResponseMessage;
import com.example.bookback.dto.response.ResponseDto;

public class PostYourResponseDto extends ResponseDto{
    private PostYourResponseDto() {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
    }

    public static ResponseEntity<PostYourResponseDto> success() {
        PostYourResponseDto result = new PostYourResponseDto();
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> noExistName() {
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_WORD, ResponseMessage.NOT_EXISTED_WORD);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    public static ResponseEntity<ResponseDto> noExistAddress() {
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_WORD, ResponseMessage.NOT_EXISTED_WORD);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
    }
}
