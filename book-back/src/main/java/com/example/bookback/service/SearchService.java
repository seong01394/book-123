package com.example.bookback.service;

import org.springframework.http.ResponseEntity;

import com.example.bookback.dto.response.search.GetPopularListResponseDto;

public interface SearchService {

    ResponseEntity<? super GetPopularListResponseDto> getPopularList();
    
} 
