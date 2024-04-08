package com.example.bookback.entity.primaryKey;

import java.io.Serializable;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FavoritePK implements Serializable{
    private static final long serialVersionUID = -340410320546422418L;
    @Column(name="user_email")
    private String userEmail;
    @Column(name="board_number")
    private int boardNumber;
    
}
