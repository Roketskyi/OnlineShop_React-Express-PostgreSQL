import { NavLink } from 'react-router-dom';
import { Mainpage } from '../mainpage/Mainpage';

import './header.css';
import './footer.css';

function Breadbord({isLogin, setIsLogin}) {

    localStorage.setItem('isLogin', isLogin ? true : false);

    return (
        <>
        <header>            
            <NavLink to="/" className={'nav'}>Home</NavLink>
            <NavLink to="/posts" className={'nav'}>Posts</NavLink>
            <NavLink to="/photos" className={'nav'}>Photos</NavLink>
            <NavLink to="/about" className={'nav'}>About</NavLink>
            <NavLink to="/login" className={'nav'} onClick={() => setIsLogin(false)}>{isLogin ? 'Logout' : 'Login'}</NavLink>
        </header>

        <Mainpage />
        
        <footer>© Reynes | Telegram: @reynesss</footer>
        </>
    )
}

export {Breadbord}