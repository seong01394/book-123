package com.example.bookback.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookback.dto.request.board.PostBoardRequestDto;
import com.example.bookback.dto.response.board.GetBoradResponseDto;
import com.example.bookback.dto.response.board.GetCommentListResponseDto;
import com.example.bookback.dto.response.board.GetFavoriteListResponseDto;
import com.example.bookback.dto.response.board.GetSearchEndListResponseDto;
import com.example.bookback.dto.response.board.PostBoardResponseDto;
import com.example.bookback.dto.response.board.PostCommentRequestDto;
import com.example.bookback.dto.response.board.PostCommentResponseDto;
import com.example.bookback.dto.response.board.PutFavoriteResponseDto;
import com.example.bookback.service.BoardService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/board")
@RequiredArgsConstructor

public class BoardController {
    
    private final BoardService boardService;
    @GetMapping("/{boardNumber}")
    public ResponseEntity<? super GetBoradResponseDto> getBoard(
        @PathVariable("boardNumber") Integer boardNumber
    ) {
        ResponseEntity<? super GetBoradResponseDto> response = boardService.getBoard(boardNumber);
        return response;
    }

    @GetMapping("/{boardNumber}/favorite-list")
    public ResponseEntity<? super GetFavoriteListResponseDto> getFavoriteList(
        @PathVariable("boardNumber") Integer boardNumber
    ) {
        ResponseEntity<? super GetFavoriteListResponseDto> response = boardService.getFavoriteList(boardNumber);
        return response;
    }

    @GetMapping("/{boardNumber}/comment-list")
    public ResponseEntity<? super GetCommentListResponseDto> getCommentList(
        @PathVariable("boardNumber") Integer boardNumber
    ) {
        ResponseEntity<? super GetCommentListResponseDto> response = boardService.getCommentList(boardNumber);
        return response;
    }

    @PostMapping("/{boardNumber}/comment")
    public ResponseEntity<? super PostCommentResponseDto> postComment(
        @RequestBody @Valid PostCommentRequestDto requestBody,
        @PathVariable("boardNumber") Integer boardNumber,
        @AuthenticationPrincipal String email   
    ) {
        ResponseEntity<? super PostCommentResponseDto> response = boardService.postComment(requestBody, boardNumber, email);
        return response;
    } 

    @PostMapping("")
    public ResponseEntity<? super PostBoardResponseDto> postBoard(
        @RequestBody @Valid PostBoardRequestDto requestBody, 
        @AuthenticationPrincipal String email
    ) {
        ResponseEntity<? super PostBoardResponseDto> response = boardService.postBoard(requestBody, email);
        return response;
    }

    @GetMapping("/search-list/{searchWord}")
    public ResponseEntity<? super GetSearchEndListResponseDto> getSearchEndList(
        @PathVariable("searchWord") String searchWord,
        @PathVariable(value="preSearchWord", required=false) String preSearchWord
    ) {
        ResponseEntity<? super GetSearchEndListResponseDto> response = boardService.getSearchEndList(searchWord);
        return response;
    }

    @PutMapping("/{boardNumber}/favorite")
    public ResponseEntity<? super PutFavoriteResponseDto> putFavorite(
        @PathVariable("boardNumber") Integer boardNumber,
        @AuthenticationPrincipal String email
    ) {
        ResponseEntity<? super PutFavoriteResponseDto> response = boardService.putFavorite(boardNumber, email);
        return response;
    }
}
