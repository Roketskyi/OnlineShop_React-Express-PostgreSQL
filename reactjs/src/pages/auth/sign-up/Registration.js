import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import './Registration.css';

function Registration() { 
    const [isLogin, setIsLogin] = useState(false);

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        localStorage.setItem('isLogin', isLogin ? true : false);
    }

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loginDirty, setLoginDirty] = useState(false);
    const [passwordDirty, setPasswordDirty] = useState(false);
    const [emailDirty, setEmailDirty] = useState(false);
    const [loginError, setLoginError] = useState('Login cannot be empty');
    const [passwordError, setPasswordError] = useState('Password cannot be empty');
    const [emailError, setEmailError] = useState('Email cannot be empty');
    const [formValid, setFormValid] = useState(false);

    useEffect(() => {
        if (loginError || passwordError || emailError) setFormValid(false);
        else setFormValid(true);
    }, [loginError, passwordError, emailError]);

    const loginHandler = (e) => {
        const re = /^[a-zA-Z0-9_.]+$/
        if (!re.test(e.target.value)) setLoginError('Incorrect login');
        else if (e.target.value.length < 4 || e.target.value.length > 12) setLoginError('Login must be more than 4 and less than 12 characters');
        else setLoginError('');

        setLogin(e.target.value);
    }

    const passwordHandler = (e) => {
        if (!e.target.value) setPasswordError('Password cannot be empty');
        else if (e.target.value.length < 4 || e.target.value.length > 10) setPasswordError('Password must be more than 4 and less than 10 characters');
        else setPasswordError('');

        setPassword(e.target.value);
    }

    const emailHandler = (e) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
        if (!e.target.value) {
          setEmailError('Email cannot be empty');
        } else if (e.target.value.length < 6 || e.target.value.length > 30) {
          setEmailError('Email must be more than 5 and less than 30 characters');
        } else if (!emailRegex.test(e.target.value)) {
          setEmailError('Invalid email format');
        } else {
          setEmailError('');
        }
      
        setEmail(e.target.value);
      };
      
    
    const blurHandle = (e) => {
        switch (e.target.name) {
            case 'login':
                setLoginDirty(true);
            break;

            case 'password':
                setPasswordDirty(true);
            break;

            case 'email':
                setEmailDirty(true);
            break;
                
            default:
        }
    }

    const authHandler = async () => {    
        try {    
            const responseSubmit = await axios.post("/register", { login, password, email })
    
            if (responseSubmit.status === 200) {
                setIsLogin(true);
                navigate('/login');
            } else {
            }
        } catch (error) {
            console.error(error);
        } finally {
            setPassword('');
        }
    };
    
    return (
        <form className="loginForm" onSubmit={handleLogin} method="post">
            <h1 className="adminPanel">Sign Up</h1>
            
            <div>
                {(loginDirty && loginError) && <div className='inputsError'>{loginError}</div>}
                <input
                    onChange={loginHandler}
                    onBlur={blurHandle}
                    name="login"
                    value={login}
                    className="loginFormInput"
                    type="text"
                    placeholder="Login"
                    autoComplete="username"
                    required                
                />
            </div>

            {(passwordDirty && passwordError) && <div className='inputsError'>{passwordError}</div>}
            <div>
                <input
                    onChange={passwordHandler}
                    onBlur={blurHandle}
                    name="password"
                    value={password}
                    className="loginFormInput"
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    required                
                />
            </div>

            {(emailDirty && emailError) && <div className='inputsError'>{emailError}</div>}
            <div>
                <input
                    onChange={emailHandler}
                    onBlur={blurHandle}
                    name="email"
                    value={email}
                    className="loginFormInput"
                    type="email"
                    placeholder="Email"
                    autoComplete="current-password"
                    required                
                />
            </div>
            
            <div>
                <button className='btnLogin' disabled={!formValid} type="submit" onClick={authHandler}>Register</button>
            </div>
        </form>
    )
}

export {Registration}