package com.example.bookback.service;

import org.springframework.http.ResponseEntity;

import com.example.bookback.dto.response.user.GetSignInUserResponseDto;

public interface UserService {
    
    ResponseEntity<? super GetSignInUserResponseDto> getSignInUser(String email);
}
