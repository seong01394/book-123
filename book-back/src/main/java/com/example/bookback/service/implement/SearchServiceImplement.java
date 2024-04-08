package com.example.bookback.service.implement;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.bookback.dto.response.ResponseDto;
import com.example.bookback.dto.response.search.GetPopularListResponseDto;
import com.example.bookback.repository.SearchLogRepository;
import com.example.bookback.repository.resultSet.GetPopularListResultSet;
import com.example.bookback.service.SearchService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SearchServiceImplement implements SearchService{


    private final SearchLogRepository searchLogRepository;

    public ResponseEntity<? super GetPopularListResponseDto> getPopularList() {
        List<GetPopularListResultSet> resultSets = new ArrayList<>();

        try {

            resultSets = searchLogRepository.getPopularList();

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetPopularListResponseDto.success(resultSets);
    }
    
}
