import styled from "styled-components";

const StyledFeed = styled.div`
  height: 100%;
  width: calc(1340px * 2 / 5 - 63px);
  z-index: 997;
  padding: 65px 8px 0px 70px;
  background-color: #f8f8f8;
  border-right: 1px solid #d7d9dc;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
`;

const HeaderContainer = styled.div`
  width: 100%;
  border-bottom: 1px solid #bbbbbb;
  margin-bottom: 4px;
  h1 {
    width: 100%;
    margin: 24px 129px;
    font-size: 23px;
    font-weight: 600;
  }
`;

const StyledPosts = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  grid-gap: 4px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`;

  const Domain = () => {



  return (
    <StyledFeed>
      <HeaderContainer>
        <h1>오늘의 맛 Post</h1>
      </HeaderContainer>
      <StyledPosts>
        
      </StyledPosts>
    </StyledFeed>
  );
};

export default Domain;
