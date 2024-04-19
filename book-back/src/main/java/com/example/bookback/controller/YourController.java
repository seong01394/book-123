package com.example.bookback.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookback.entity.YourEntity;
import com.example.bookback.repository.YourRepository;

@RestController

public class YourController {
    @Autowired
    private YourRepository yourRepository; 

    @GetMapping("/search")
    public List<YourEntity> search(@RequestParam String keyword) {
        return yourRepository.findBynameContaining(keyword);
    }
}
