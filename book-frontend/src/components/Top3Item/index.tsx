import defaultProfileImage from 'assets/default-profile-image.png';
import PListItem from 'types/interface/Board-list-item.interface';
import './style.css';
interface Props {
  top3ListItem: PListItem;
}

//               component: Top 3 Item                       //
export default function Top3Item({ top3ListItem }: Props) {
  //                           properties                      //
  const { boardNumber, title, content, boardTitleImage } = top3ListItem;
  const { favoriteCount, commentCount, viewCount } = top3ListItem;
  const { writeDatetime, writeNickname, writeProfileImage } = top3ListItem;

  //          function: 네비게이트 함수 //
  // const navigator = useNavigate();

  // event handler: 게시물 아이템 클릭 이벤트 처리 함수 //
  const onClickHandler = () => {
    //navigator(boardNumber);//
  };
  //  render: Top 3 Item       //
  return (
    <div
      className="top-3-list-item"
      style={{ backgroundImage: `url(${boardTitleImage})` }}
      onClick={onClickHandler}
    >
      <div className="top-3-list-item-main-box">
        <div className="top-3-list-item-top">
          <div className="top-3-list-item-profile-box">
            <div
              className="top-3-list-item-profile-image"
              style={{
                backgroundImage: `url(${
                  writeProfileImage ? writeProfileImage : defaultProfileImage
                })`,
              }}
            ></div>
          </div>
          <div className="top-3-list-item-write-box">
            <div className="top-3-list-item-nickname">{writeNickname}</div>
            <div className="top-3-list-item-write-date">{writeDatetime}</div>
          </div>
        </div>
        <div className="top-3-list-item-middle">
          <div className="top-3-list-item-title">{title}</div>
          <div className="top-3-list-item-content">{content}</div>
        </div>
        <div className="top-3-list-item-bottom">
          <div className="top-3-list-item-counts">
            {`댓글 ${commentCount} · 좋아요 ${favoriteCount} · 조회수 ${viewCount}`}
          </div>
        </div>
      </div>
    </div>
  );
}
