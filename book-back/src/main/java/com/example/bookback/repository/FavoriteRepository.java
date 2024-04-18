package com.example.bookback.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.bookback.entity.FavoriteEntity;
import com.example.bookback.entity.primaryKey.FavoritePK;
import com.example.bookback.repository.resultSet.GetFavoriteListResultSet;

@Repository
public interface FavoriteRepository extends JpaRepository<FavoriteEntity, FavoritePK>{
    
    FavoriteEntity findByBoardNumberAndUserEmail(Integer boardNumber, String useremail);

    @Query(
        value=
        "SELECT " +
        "   U.email AS email, " +
        "   U.nickname AS nickname, " +
        "    U.profile_image AS profileImage " +
        "FROM favorite As F " +
        "INNER JOIN user AS U " +
        "ON F.user_email = U.email " +
        "WHERE F.board_number = ?1",
        nativeQuery=true
    )
    List<GetFavoriteListResultSet> getFavoriteList(Integer boardNumber);
}

