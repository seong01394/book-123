package com.example.bookback.dto.object;

import java.util.List;

import com.example.bookback.entity.EndSearchEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SearchEndListItem {
    private String name;

    public static List<SearchEndListItem> getList(List<EndSearchEntity> endSearchEntities) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getList'");
    }

    
}
