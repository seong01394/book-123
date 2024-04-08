/* package com.example.bookback.dto.response.board;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.bookback.common.ResponseCode;
import com.example.bookback.common.ResponseMessage;
import com.example.bookback.dto.object.BoardListItem;
import com.example.bookback.dto.response.ResponseDto;
import com.example.bookback.entity.BoardListViewEntity;

public class GetSearchBoardListResponseDto extends ResponseDto{
    private List<BoardListItem> //searchList;

    private GetSearchBoardListResponseDto(List<BoardListViewEntity> boardListViewEntities) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.searchList = BoardListItem.getList(boardListViewEntities);
    }
    
    public ResponseEntity<GetSearchBoardListResponseDto> success(List<BoardListViewEntity> boardListViewEntities) {
        GetSearchBoardListResponseDto result = new GetSearchBoardListResponseDto(boardListViewEntities);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
} */
