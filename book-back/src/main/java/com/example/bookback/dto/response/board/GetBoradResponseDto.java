package com.example.bookback.dto.response.board;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.bookback.common.ResponseCode;
import com.example.bookback.common.ResponseMessage;
import com.example.bookback.dto.response.ResponseDto;
import com.example.bookback.entity.ImageEntity;
import com.example.bookback.repository.resultSet.GetBoardResultSet;

import lombok.Getter;
@Getter
public class GetBoradResponseDto extends ResponseDto{
    // "boardNumber": 1,
    // "title": "a",
    // "content": "b",
    // "boardImageList" : [],
     // writeDatetime: "2023.08.18. 00:54:27",
    // "writeNickname": "안녕하세요나는안성윤",
    // "writeProfileImage": null

    private int boradNumber;
    private String title;
    private String content;
    private List<String>  boardImageList;
    private String writeDatetime;
    private String writerEmail;
    private String writerNickname;
    private String writerProfileImage;

    private GetBoradResponseDto(GetBoardResultSet resultSet, List<ImageEntity> imageEntities) {
        super(ResponseCode.SUCCESS, ResponseMessage.SUCCESS);

        List<String> boardImageList = new ArrayList<>();
        for (ImageEntity imageEntity: imageEntities) {
            String boardImage = imageEntity.getImage();
            boardImageList.add(boardImage);
        }
        this.boradNumber = resultSet.getBoardNumber();
        this.title = resultSet.getTitle();
        this.content = resultSet.getContent();
        this.boardImageList = boardImageList;
        this.writeDatetime = resultSet.getWriteDatetime();
        this.writerEmail = resultSet.getWriterEmail();
        this.writerNickname = resultSet.getWriterNickname();
        this.writerProfileImage = resultSet.getWriterProfileImage();
    }

    public static ResponseEntity<GetBoradResponseDto> success(GetBoardResultSet resultSet, List<ImageEntity> imageEntities) {
        GetBoradResponseDto result = new GetBoradResponseDto(resultSet, imageEntities);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    public static ResponseEntity<ResponseDto> notExistBoard() {
        ResponseDto result = new ResponseDto(ResponseCode.NOT_EXISTED_BOARD, ResponseMessage.NOT_EXISTED_BOARD);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

}
