import { NavLink } from 'react-router-dom';
import { Mainpage } from '../mainpage/Mainpage';

import './header.css';
import './footer.css';

function Breadbord({ setIsLogin }) {
  const token = localStorage.getItem('token');
  const isLogin = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLogin(false);
  };

  return (
    <>
      <header>
        <NavLink to="/" className={'nav'}>Home</NavLink>
        <NavLink to="/posts" className={'nav'}>Posts</NavLink>
        <NavLink to="/photos" className={'nav'}>Photos</NavLink>
        <NavLink to="/about" className={'nav'}>About</NavLink>
        <NavLink to="/login" className={'nav'} onClick={isLogin ? handleLogout : null}>{isLogin ? 'Logout' : 'Login'}</NavLink>
        <NavLink to="/sign-up" className={'nav'}>Sign up</NavLink>
      </header>

      <Mainpage />

      <footer>© Reynes | Telegram: @reynesss</footer>
    </>
  );
}

export { Breadbord };