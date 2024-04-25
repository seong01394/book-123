package com.example.bookback.dto.object;

import java.util.ArrayList;
import java.util.List;

import com.example.bookback.repository.resultSet.GetFavoriteListResultSet;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteListItem {
    private String email;
    private String nickname;
    private String profileImage;

    public FavoriteListItem(GetFavoriteListResultSet resultSet) {
        this.email = resultSet.getEmail();
        this.nickname = resultSet.getNickname();
        this.profileImage = resultSet.getProfileImage();
    }
    public static List<FavoriteListItem> copyList(List<GetFavoriteListResultSet> resultSets) {
        List<FavoriteListItem> list = new ArrayList<>();
        for (GetFavoriteListResultSet resultSet: resultSets) {
            FavoriteListItem favoriteListItem = new FavoriteListItem(resultSet);
            list.add(favoriteListItem);
        }
        return list;
    }
}
