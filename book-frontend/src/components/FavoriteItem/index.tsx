import defaultProfileImage from 'assets/default-profile-image.png';
import { FavoriteListItem } from 'types/interface';
import './style.css';

interface Props {
  favoriteListItem: FavoriteListItem;
}
//              FavoriteItem 컴포넌트                       //
export default function FavoriteItem({ favoriteListItem }: Props) {
  //             properties                       //
  const { profileImage, nickname } = favoriteListItem;
  //              FavoriteItem 컴포넌트 렌더링                       //
  return (
    <div>
      <div className="favorite-list-item">
        <div className="favorite-list-item-profile-box">
          <div
            className="favorite-list-item-profile-image"
            style={{
              backgroundImage: `url(${
                profileImage ? profileImage : defaultProfileImage
              })`,
            }}
          ></div>
        </div>
        <div className="favorite-list-item-nickname">{nickname}</div>
      </div>
    </div>
  );
}
