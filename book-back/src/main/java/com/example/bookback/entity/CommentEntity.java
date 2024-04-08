package com.example.bookback.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name="comment")
@Table(name="comment")
public class CommentEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int commentNumber;
    private String content;
    private String writeDatetime;
    private String userEmail;
    private int boardNumber;
    
}
