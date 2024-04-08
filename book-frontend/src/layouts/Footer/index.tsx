import './style.css';

//    컴포넌트 Footer        //
export default function Footer() {
  //         event handler(insta)               //
  const onInstaIconButtonClickHandler = () => {
    window.open('https://www.instagram.com');
  };
  //         event handler(naver blog)               //
  const onNaverBlogIconButton = () => {
    window.open('https://blog.naver.com');
  };
  //         render               //
  return (
    <div id="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo-box">
            <div className="icon-box">
              <div className="icon logo-light-icon"></div>
            </div>
            <div className="footer-logo-text">{'FOR JP'}</div>
          </div>
          <div className="footer-link-box">
            <div className="footer-email-link">{'abc@gmail.com'}</div>
            <div
              className="icon-button"
              onClick={onInstaIconButtonClickHandler}
            >
              <div className="icon insta-icon"></div>
            </div>
            <div className="icon-button" onClick={onNaverBlogIconButton}>
              <div className="icon naver-blog-icon"></div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copyright">
            {'copyright © 2022 JP rights reserved'}
          </div>
        </div>
      </div>
    </div>
  );
}
