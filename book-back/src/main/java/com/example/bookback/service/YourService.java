package com.example.bookback.service;

import org.springframework.http.ResponseEntity;

import com.example.bookback.dto.response.board.GetYourListResponseDto;
import com.example.bookback.dto.response.board.PostYourResponseDto;




public interface YourService {
    ResponseEntity<? super PostYourResponseDto> postYour(PostYourResponseDto requestBody, String name, String address);
    ResponseEntity<? super GetYourListResponseDto> getYourList(String name, String address);
}
