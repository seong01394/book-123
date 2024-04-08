import { AUTH_PATH } from 'constant';
import Footer from 'layouts/Footer';
import Header from 'layouts/Header';
import { Outlet, useLocation } from 'react-router-dom';

//              components(container)      //
export default function Container() {
  //       state: 현재 페이지 path name 상태       //
  const { pathname } = useLocation();
  const authPath = AUTH_PATH();
  //      render  //
  return (
    <>
      {pathname === authPath ? (
        <Outlet />
      ) : (
        <>
          <Header />
          <Outlet />
          <Footer />
        </>
      )}
    </>
  );
}
