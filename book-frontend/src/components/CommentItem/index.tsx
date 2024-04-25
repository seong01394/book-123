import defaultProfileImage from 'assets/default-profile-image.png';
import { CommentListItem } from 'types/interface';
import './style.css';

interface Props {
  commentListItem: CommentListItem;
}
//      ComItem 컴포넌트     //

export default function CommentItem({ commentListItem }: Props) {
  //properties//
  const { nickname, profileImage, writeDatetime, content } = commentListItem;
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
