package com.example.bookback.service;

import org.springframework.http.ResponseEntity;

import com.example.bookback.dto.request.board.PostBoardRequestDto;
import com.example.bookback.dto.response.board.GetBoradResponseDto;
import com.example.bookback.dto.response.board.PostBoardResponseDto;

public interface BoardService {
    ResponseEntity<? super GetBoradResponseDto> getBoard(Integer boardNumber);
    ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email );   
}
