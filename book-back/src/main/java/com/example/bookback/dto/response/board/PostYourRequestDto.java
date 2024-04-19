package com.example.bookback.dto.response.board;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PostYourRequestDto {
    
    @NotBlank
    private String name;
    private String address;
}
