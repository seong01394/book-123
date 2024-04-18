package com.example.bookback.dto.response.board;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.bookback.common.ResponseCode;
import com.example.bookback.common.ResponseMessage;
import com.example.bookback.dto.object.SearchEndListItem;
import com.example.bookback.dto.response.ResponseDto;
import com.example.bookback.entity.EndSearchEntity;

import lombok.Getter;

@Getter
public class GetSearchEndListResponseDto extends ResponseDto{
    private List<SearchEndListItem> searchList;

    private GetSearchEndListResponseDto(List<EndSearchEntity> endSearchEntities) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);
        this.searchList = SearchEndListItem.getList(endSearchEntities);
    }
    
    public static ResponseEntity<GetSearchEndListResponseDto> success(List<EndSearchEntity> endSearchEntities) {
        GetSearchEndListResponseDto result = new GetSearchEndListResponseDto(endSearchEntities);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
} 
