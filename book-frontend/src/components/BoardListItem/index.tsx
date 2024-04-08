import defaultProfileImage from 'assets/default-profile-image.png';

import BoardListItem from 'types/interface/Board-list-item.interface';
import './style.css';


interface Props {
  boardListItem: BoardListItem;
}

//              component: Board List Item  컴포넌트     //

export default function PJListItem({ boardListItem }: Props) {
  //                    properties                        //
  const { boardNumber, title, content, boardTitleImage } = boardListItem;
  const { favoriteCount, commentCount, viewCount } = boardListItem;
  const { writeDatetime, writeNickname, writeProfileImage } = boardListItem;

  //               funtion: 네비게이트 함수              //
  //const navigator = useNavigate();

  //                event handler: 게시물 아이템 클릭 이벤트 처리 함수 //
  const onClickhandler = () => {
    // navigator(boardNumber);
  };

  //              render: P List Item  컴포넌트     //
  return (
    <div className="p-list-item" onClick={onClickhandler}>
      <div className="p-list-item-main-box">
        <div className="p-list-item-top">
          <div className="p-list-item-profile-box">
            <div
              className="p-list-item-profile-image"
              style={{
                backgroundImage: `url(${
                  writeProfileImage ? writeProfileImage : defaultProfileImage
                })`,
              }}
            ></div>
          </div>
          <div className="p-list-item-write-box">
            <div className="p-list-item-nickname">{writeNickname}</div>
            <div className="p-list-item-write-date">{writeDatetime}</div>
          </div>
        </div>
        <div className="p-list-item-middle">
          <div className="p-list-item-title">{title}</div>
          <div className="p-list-item-content">{content}</div>
        </div>
        <div className="p-list-item-bottom">
          <div className="p-list-item-counts">
            댓글 {commentCount} · 좋아요 {favoriteCount} · 조회수
            {viewCount}
          </div>
        </div>
      </div>
      {boardTitleImage !== null && (
        <div className="p-list-item-image-box">
          <div
            className="p-list-item-image"
            style={{
              backgroundImage: `url(${boardTitleImage})`,
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
