package com.example.bookback.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.bookback.entity.YourEntity;
import com.example.bookback.repository.resultSet.GetYourListResultSet;

public interface YourRepository extends JpaRepository<YourEntity, String>{
    YourEntity findBynameContaining(String name, String address);
    
    @Query(
        value=
        "SELECT " +
        "   FROM  favorhome_info, " +
        "   WHERE name LIKE '?김가네김밥 봉담2지구점' AND 업태구분명 LIKE '한식', " +
        "   ORDER BY 소재지면적 DESC",
        nativeQuery=true
    )
    List<GetYourListResultSet> getYourList(String name, String address);

    List<GetYourListResultSet> getYourList(String name, String address);
} 
