package com.example.bookback.dto.object;

import java.util.ArrayList;
import java.util.List;

import com.example.bookback.repository.resultSet.GetYourListResultSet;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class YourListItem {
    private String name;
    private String address;

    public YourListItem(GetYourListResultSet resultSet) {
        this.name = resultSet.getName();
        this.address = resultSet.getAddress();
    }

    public static List<YourListItem> copyList(List<GetYourListResultSet> resultSets) {
        List<YourListItem> list = new ArrayList<>();
        for (GetYourListResultSet resultSet: resultSets) {
            YourListItem yourListItem = new YourListItem(resultSet);
            list.add(yourListItem);
        }
        return list;
    }

    
}
