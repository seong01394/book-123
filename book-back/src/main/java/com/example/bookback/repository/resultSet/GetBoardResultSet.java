package com.example.bookback.repository.resultSet;

public interface GetBoardResultSet {
    Integer getBoardNumber();
    String getTitle();
    String getContent();
    String getWriteDatetime();
    String getWriterEmail();
    String getWriterNickname();
    String getWriterProfileImage();
}
