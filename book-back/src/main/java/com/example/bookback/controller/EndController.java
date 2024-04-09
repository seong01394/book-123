package com.example.bookback.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookback.entity.EndSearchEntity;
import com.example.bookback.service.EndService;

@RestController
@RequestMapping("/api")
public class EndController {
    
    @Autowired
    private EndService endService;

    @GetMapping("/search")
    public ResponseEntity<List<EndSearchEntity>> searchByName(@RequestParam String name) {
        List<EndSearchEntity> results = endService.searchByName(name);
        return new ResponseEntity<>(results, HttpStatus.OK);
    }
}
