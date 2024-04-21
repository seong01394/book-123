package com.example.bookback.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.bookback.entity.YourEntity;
import com.example.bookback.repository.resultSet.GetYourListResultSet;

public interface YourRepository extends JpaRepository<YourEntity, String>{
    YourEntity findByNameAndAddress(String name, String address);
    
    @Query(
        value=
        "SELECT " +
        "   FROM  end, " +
        "   WHERE ?name AND ?Classname, " +
        "   ORDER BY Area DESC",
        nativeQuery=true
    )
    List<GetYourListResultSet> getYourList(String name, String address);
} 
