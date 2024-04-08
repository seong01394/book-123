package com.example.bookback.entity;

import com.example.bookback.entity.primaryKey.FavoritePK;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name="favorite")
@Table(name="favorite")
@IdClass(FavoritePK.class)
public class FavoriteEntity {
    @Id 
    private String userEmail;
    @Id
    private int boardNumber;
    
}
