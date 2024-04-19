package com.example.bookback.dto.response.board;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.bookback.common.ResponseCode;
import com.example.bookback.common.ResponseMessage;
import com.example.bookback.dto.object.YourListItem;
import com.example.bookback.dto.response.ResponseDto;
import com.example.bookback.repository.resultSet.GetYourListResultSet;

import lombok.Getter;


@Getter
public class GetYourListResponseDto extends ResponseDto{

    private List<YourListItem> yourList;

    private GetYourListResponseDto(List<GetYourListResponseDto> resultSets) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.yourList = YourListItem.copyList(resultSets);

    }

    public static ResponseEntity<GetYourListResponseDto> success(List<GetYourListResultSet> resultSets) {
        GetYourListResponseDto result = new GetYourListResponseDto(resultSets);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> noExistName() {
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_BOARD, ResponseMessage.NOT_EXISTED_BOARD);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    public static ResponseEntity<? super GetYourListResponseDto> success(List<GetYourListResultSet> resultSets) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'success'");
    }
}
