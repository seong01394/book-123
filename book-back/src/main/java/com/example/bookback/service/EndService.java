package com.example.bookback.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.bookback.entity.EndSearchEntity;
import com.example.bookback.repository.EndSearchRepository;

@Service
public class EndService {

    @Autowired
    private EndSearchRepository endSearchRepository;

    public List<EndSearchEntity> searchByName(String name) {
        return endSearchRepository.findByNameContaining(name);
    }
}
