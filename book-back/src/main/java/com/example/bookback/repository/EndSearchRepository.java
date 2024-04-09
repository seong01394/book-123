package com.example.bookback.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.bookback.entity.EndSearchEntity;

@Repository
public interface EndSearchRepository extends JpaRepository<EndSearchEntity, Integer>{

    List<EndSearchEntity> findByNameContaining(String name);

    
} 
