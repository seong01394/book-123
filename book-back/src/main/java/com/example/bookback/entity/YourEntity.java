package com.example.bookback.entity;

import com.example.bookback.dto.response.board.PostYourRequestDto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity(name="end")
@Table(name="end")
public class YourEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String name;
    private String address;

    public YourEntity(PostYourRequestDto dto, String name, String address){
        this.name = dto.getName();
        this.address = dto.getAddress();
    }
    
  
}
