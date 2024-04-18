import styled from "styled-components";


const ImgWrapper = styled.div`
  width: 130px;
  height: 130px;
  position: relative;

  .likes_on {
    position: absolute;
    top: 45%;
    left: 25%;
    z-index: 1;
    font-size: 15px;
    width: 60px;
    text-align: center;
    color: #ffffff;
    font-weight: 700;
    display: none;
    user-select: none;
  }

  &:hover .likes_on {
    display: block;
  }

  &:hover .post_thumbnail {
    filter: brightness(0.5);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    vertical-align: middle;
  }

  .post_thumbnail {
    width: 100%;
    height: 100%;
  }

  .heartIcon {
    width: 16px;
    height: 12px;
  }
`;

const ModalBackdrop = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
`;

const PostRead = () => {

 

  return (
    <>
      <ImgWrapper >
        <p className="likes_on">
          
          
        </p>
        <div className="post_thumbnail">
         
        </div>
      </ImgWrapper>
     
    </>
  );
};

export default PostRead;