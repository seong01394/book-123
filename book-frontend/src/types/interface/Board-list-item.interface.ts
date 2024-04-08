export default interface BoardListItem {
  boardNumber: number;
  title: string;
  content: string;
  boardTitleImage: string | null;
  favoriteCount: number;
  commentCount: number;
  viewCount: number;
  writeDatetime: string;
  writeNickname: string;
  writeProfileImage: string | null;
}
