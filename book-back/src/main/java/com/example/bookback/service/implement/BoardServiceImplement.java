package com.example.bookback.service.implement;




import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.bookback.dto.request.board.PostBoardRequestDto;
import com.example.bookback.dto.response.ResponseDto;
import com.example.bookback.dto.response.board.GetBoradResponseDto;
import com.example.bookback.dto.response.board.GetCommentListResponseDto;
import com.example.bookback.dto.response.board.GetFavoriteListResponseDto;
import com.example.bookback.dto.response.board.GetSearchEndListResponseDto;
import com.example.bookback.dto.response.board.PostBoardResponseDto;
import com.example.bookback.dto.response.board.PostCommentRequestDto;
import com.example.bookback.dto.response.board.PostCommentResponseDto;
import com.example.bookback.dto.response.board.PutFavoriteResponseDto;
import com.example.bookback.entity.BoardEntity;
import com.example.bookback.entity.CommentEntity;
import com.example.bookback.entity.EndSearchEntity;
import com.example.bookback.entity.FavoriteEntity;
import com.example.bookback.entity.ImageEntity;
import com.example.bookback.entity.SearchLogEntity;
import com.example.bookback.repository.BoardRepository;
import com.example.bookback.repository.CommentRepository;
import com.example.bookback.repository.EndSearchRepository;
import com.example.bookback.repository.FavoriteRepository;
import com.example.bookback.repository.ImageRepository;
import com.example.bookback.repository.SearchLogRepository;
import com.example.bookback.repository.UserRepository;
import com.example.bookback.repository.resultSet.GetBoardResultSet;
import com.example.bookback.repository.resultSet.GetCommentListResultSet;
import com.example.bookback.repository.resultSet.GetFavoriteListResultSet;
import com.example.bookback.service.BoardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardServiceImplement implements BoardService{
    
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final ImageRepository imageRepository;
    private final EndSearchRepository endSearchRepository;
    private final CommentRepository commentRepository;
    private final SearchLogRepository searchLogRepository;

    private final FavoriteRepository favoriteRepository;
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
    public ResponseEntity<? super GetSearchEndListResponseDto> getSearchEndList(String searchWord) {
        
        List<EndSearchEntity> endSearchEntities = new ArrayList<>();
        try {


            endSearchEntities = endSearchRepository.findByNameContains(searchWord);

            SearchLogEntity searchLogEntity = new SearchLogEntity(searchWord);
            searchLogRepository.save(searchLogEntity);

            

        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return GetSearchEndListResponseDto.success(endSearchEntities);
    }

    @Override
    public ResponseEntity<? super GetFavoriteListResponseDto> getFavoriteList(Integer boardNumber) {

        List<GetFavoriteListResultSet> resultSets = new ArrayList<>();
        try {
            boolean existedBoard = boardRepository.existsByBoardNumber(boardNumber);
            if(!existedBoard) return GetFavoriteListResponseDto.noExistBoard();

            resultSets = favoriteRepository.getFavoriteList(boardNumber);
            
        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }
        return GetFavoriteListResponseDto.success(resultSets);
    }
    @Override
    public ResponseEntity<? super GetCommentListResponseDto> getCommentList(Integer boardNumber) {

        List<GetCommentListResultSet> resultSets = new ArrayList<>();

       try {

            boolean existedBoard = boardRepository.existsByBoardNumber(boardNumber);
            if(!existedBoard) return GetCommentListResponseDto.noExistBoard();

            resultSets = commentRepository.getCommentList(boardNumber);

       } catch(Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
       }
       return GetCommentListResponseDto.success(resultSets);
    }

    @Override
    public ResponseEntity<? super PostCommentResponseDto> postComment(PostCommentRequestDto dto, Integer boardNumber,String email) {
        
        try {
            BoardEntity boardEntity =boardRepository .findByBoardNumber (boardNumber);
            if (boardEntity == null ) return PostCommentResponseDto.noExistBoard();

            boolean existedUser =userRepository .existsByEmail (email );
            if (!existedUser ) return PostCommentResponseDto .noExistUser ();

            CommentEntity commentEntity =new CommentEntity (dto , boardNumber , email );
            commentRepository.save(commentEntity);

            boardEntity.increaseCommentCount();
            boardRepository.save(boardEntity);
            
            } catch (Exception exception ) {
                exception .printStackTrace ();
                return ResponseDto .databaseError ();
            }
            return PostCommentResponseDto .success();
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

    
    @Override
    public ResponseEntity<? super PutFavoriteResponseDto> putFavorite(Integer boardNumber, String email) {
        
        try {

            boolean existedUser = userRepository.existsByEmail(email);
            if(!existedUser) return PutFavoriteResponseDto.noExistUser();

            BoardEntity boardEntity = boardRepository.findByBoardNumber(boardNumber);
            if (boardEntity == null) return PutFavoriteResponseDto.noExistBoard();

            FavoriteEntity favoriteEntity = favoriteRepository.findByBoardNumberAndUserEmail(boardNumber, email);
            if(favoriteEntity == null) {
                favoriteEntity = new FavoriteEntity(email, boardNumber);
                favoriteRepository.save(favoriteEntity);
                boardEntity.increaseFavoriteCount();
                
            }
            else {
                favoriteRepository.delete(favoriteEntity);
                boardEntity.decreaseFavoriteCount();
            }

            boardRepository.save(boardEntity);


        } catch (Exception exception) {
            exception.printStackTrace();
            return ResponseDto.databaseError();
        }

        return PutFavoriteResponseDto.success();
    }

   

    
    }

    

    

    

    
    
    

