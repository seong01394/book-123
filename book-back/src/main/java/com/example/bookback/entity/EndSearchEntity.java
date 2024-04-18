package com.example.bookback.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@AllArgsConstructor
@Table(name = "end")
@Entity(name = "end")
public class EndSearchEntity {

    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private String name;
}
