package com.example.bookback.service;

import org.springframework.http.ResponseEntity;

import com.example.bookback.dto.request.auth.SignInRequestDto;
import com.example.bookback.dto.request.auth.SignUpRequestDto;
import com.example.bookback.dto.response.auth.SignInResponseDto;
import com.example.bookback.dto.response.auth.SignUpResponseDto;

public interface AuthService {
    
    ResponseEntity<? super SignUpResponseDto> signUp(SignUpRequestDto dto);
    ResponseEntity<? super SignInResponseDto> signIn(SignInRequestDto dto);
}

