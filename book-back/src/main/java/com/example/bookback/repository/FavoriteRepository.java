package com.example.bookback.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.bookback.entity.FavoriteEntity;
import com.example.bookback.entity.primaryKey.FavoritePK;

@Repository
public interface FavoriteRepository extends JpaRepository<FavoriteEntity, FavoritePK>{
    
}

