package com.example.bookback.service.implement;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.bookback.dto.response.ResponseDto;
import com.example.bookback.dto.response.board.GetYourListResponseDto;
import com.example.bookback.dto.response.board.PostYourResponseDto;
import com.example.bookback.entity.YourEntity;
import com.example.bookback.repository.YourRepository;
import com.example.bookback.repository.resultSet.GetYourListResultSet;
import com.example.bookback.service.YourService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class YourServiceImplement implements YourService {
    private final YourRepository yourRepository;
    
	@Override
	public ResponseEntity<? super GetYourListResponseDto> getYourList(String name, String address) {

        List<GetYourListResultSet> resultSets = new ArrayList<>();
		try {

            resultSets = yourRepository.getYourList(name, address);

        } catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetYourListResponseDto.success(resultSets);
   
}

	@Override
	public ResponseEntity<? super PostYourResponseDto> postYour(PostYourResponseDto requestBody, String name, String address) {
		try {
            YourEntity yourEntity = yourRepository.findByNameAndAddress(name, address);
            if (yourEntity == null) return PostYourResponseDto.noExistName();

            
            } catch (Exception exception) {
                exception.printStackTrace();
                return ResponseDto.databaseError();
            }
            return PostYourResponseDto.success();
	}
}
