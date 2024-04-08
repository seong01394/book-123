import './style.css';
import defaultProfileImage from 'assets/default-profile-image.png'
import { CommentListItem } from 'types/interface';

interface Props {
  comListItem: CommentListItem;
}
//      ComItem 컴포넌트     //

export default function ComItem({ comListItem }: Props) {
  //properties//
  const { nickname, profileImage, writeDatetime, content } = comListItem;
//      ComItem 컴포넌트 렌더링     //
  return (
    <div className="com-list-item">
      <div className="com-list-item-top">
        <div className="com-list-item-profile-box">
          <div
            className="com-list-item-profile-image"
            style={{ backgroundImage: `url(${profileImage ? profileImage : defaultProfileImage})` }}
          ></div>
        </div>
        <div className="com-list-item-nickname">{nickname}</div>
        <div className="com-list-item-divider">{'|'}</div>
        <div className="com-list-item-time">{writeDatetime}</div>
      </div>
      <div className="com-list-item-main">
        <div className="com-list-item-content">{ content}</div>
      </div>
    </div>
  );
}
