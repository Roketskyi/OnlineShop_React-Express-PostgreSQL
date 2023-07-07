import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import './Registration.css';

function Registration() { 
    const [showError, setShowError] = useState(false); // Додано стан для відображення помилки
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
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
    const [errorMessage, setErrorMessage] = useState('');
    const [formValid, setFormValid] = useState(false);

    useEffect(() => {
        if (loginError || passwordError || emailError) setFormValid(false);
        else setFormValid(true);
    }, [loginError, passwordError, emailError]);

    const loginHandler = (e) => {
        const regex = /^[a-zA-Z0-9_.]+$/;
        if (!regex.test(e.target.value)) setLoginError('Incorrect login');
        else if (e.target.value.length < 4 || e.target.value.length > 12) setLoginError('Login must be more than 4 and less than 12 characters');
        else setLoginError('');

        setLogin(e.target.value);
    }

    const passwordHandler = (e) => {
        const regex = /^[a-zA-Z0-9_.]+$/;
        if (!e.target.value) setPasswordError('Password cannot be empty');
        else if (e.target.value.length < 4 || e.target.value.length > 10) setPasswordError('Password must be more than 4 and less than 10 characters');
        else if (!regex.test(e.target.value)) setPasswordError('Incorrect password');
        else setPasswordError('');

        setPassword(e.target.value);
    }

    const emailHandler = (e) => {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      
        if (!e.target.value) {
          setEmailError('Email cannot be empty');
        } else if (e.target.value.length < 6 || e.target.value.length > 30) {
          setEmailError('Email must be more than 5 and less than 30 characters');
        } else if (!regex.test(e.target.value)) {
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
          const responseSubmit = await axios.post('/register', { login, password, email });
    
          if (responseSubmit.status === 200) {
            navigate('/login');
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            setErrorMessage(error.response.data.error);
            setShowError(true); // Показати помилку при отриманні помилкової відповіді
            setTimeout(() => {
              setShowError(false); // Через 5 секунд приховати помилку
            }, 5000);
          } else {
            setErrorMessage('Server error');
          }
        } finally {
          setPassword('');
        }
      };
    
    return (
        <div className="registrationContainer">
      {/* контейнер для вікна помилки */}
      {showError && (
        <div className="errorWindow">
            <div className="errorMessage">{errorMessage}</div>
        </div>
      )}
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
        </div>
    )
}

export {Registration}