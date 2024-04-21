package com.example.bookback.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookback.dto.response.board.PostYourResponseDto;
import com.example.bookback.service.YourService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/search")
public class YourController {
    private final YourService yourService = null;

    @PostMapping("/placesearch")
    public ResponseEntity<? super PostYourResponseDto> postYour(
        @RequestBody @Valid PostYourResponseDto requestBody,
        @PathVariable("name") String name,
        @AuthenticationPrincipal String address
    ) {
        ResponseEntity<? super PostYourResponseDto> response = yourService.postYour(requestBody, name, address);
        return response;
    }
}
