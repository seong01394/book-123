package com.example.bookback.service.implement;




import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.bookback.dto.request.board.PostBoardRequestDto;
import com.example.bookback.dto.response.ResponseDto;
import com.example.bookback.dto.response.board.GetBoradResponseDto;
import com.example.bookback.dto.response.board.PostBoardResponseDto;
import com.example.bookback.entity.BoardEntity;
import com.example.bookback.entity.ImageEntity;
import com.example.bookback.repository.BoardRepository;
import com.example.bookback.repository.ImageRepository;
import com.example.bookback.repository.UserRepository;
import com.example.bookback.repository.resultSet.GetBoardResultSet;
import com.example.bookback.service.BoardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardServiceImplement implements BoardService{
    
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final ImageRepository imageRepository;


    @Override
    public ResponseEntity<? super GetBoradResponseDto> getBoard(Integer boardNumber) {
        
        GetBoardResultSet resultSet = null;
        List<ImageEntity> imageEntities = new ArrayList<>();
        try {


            resultSet = boardRepository.getBoard(boardNumber);
            if (resultSet == null) return GetBoradResponseDto.notExistBoard();

            imageEntities = imageRepository.findByBoardNumber(boardNumber);

            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            boardEntity.increaseViewCount();
            boardRepository.save(boardEntity);

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetBoradResponseDto.success(resultSet, imageEntities);
    }

    @Override
    public ResponseEntity<? super PostBoardResponseDto> postBoard(PostBoardRequestDto dto, String email) {
        
        try {

            boolean existedEmail = userRepository.existsByEmail(email);
            if (!existedEmail) return PostBoardResponseDto.notExistUser();

            BoardEntity boardEntity = new BoardEntity(dto, email);
            boardRepository.save(boardEntity);

            int boardNumber = boardEntity.getBoardNumber();

            List<String> boardImageList = dto.getBoardImageList();
            List<ImageEntity> imageEntities = new ArrayList<>();

            for (String image: boardImageList) {
                ImageEntity imageEntity = new ImageEntity(boardNumber, image);
                imageEntities.add(imageEntity);
            }

            imageRepository.saveAll(imageEntities);
        
        } catch (Exception exception) {
            exception.printStackTrace();

            return ResponseDto.databaseError();
        }

        return PostBoardResponseDto.success();
    }

    
    
    
}
