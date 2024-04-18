package com.example.bookback.service;


import org.springframework.http.ResponseEntity;

import com.example.bookback.dto.request.board.PostBoardRequestDto;
import com.example.bookback.dto.response.board.GetBoradResponseDto;
import com.example.bookback.dto.response.board.GetCommentListResponseDto;
import com.example.bookback.dto.response.board.GetFavoriteListResponseDto;
import com.example.bookback.dto.response.board.GetSearchEndListResponseDto;
import com.example.bookback.dto.response.board.PostBoardResponseDto;
import com.example.bookback.dto.response.board.PostCommentRequestDto;
import com.example.bookback.dto.response.board.PostCommentResponseDto;
import com.example.bookback.dto.response.board.PutFavoriteResponseDto;

public interface BoardService {
    ResponseEntity<? super GetBoradResponseDto> getBoard(Integer boardNumber);
    ResponseEntity<? super GetFavoriteListResponseDto> getFavoriteList(Integer boardNumber);
    ResponseEntity<? super GetCommentListResponseDto> getCommentList(Integer boardNumber);
    ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email );
    ResponseEntity<? super PostCommentResponseDto> postComment(PostCommentRequestDto dto, Integer boardNumber, String email);
    ResponseEntity<? super GetSearchEndListResponseDto> getSearchEndList(String searchWord);
    ResponseEntity<? super PutFavoriteResponseDto> putFavorite(Integer boardNumber, String email);
}
