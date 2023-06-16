import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import './forgot-password.css';

function Forgot() { 
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
    }

    const [email, setEmail] = useState('');
    const [emailDirty, setEmailDirty] = useState(false);
    const [emailError, setEmailError] = useState('Email cannot be empty');
    // eslint-disable-next-line
    const [formValid, setFormValid] = useState(false); 

    const emailHandler = (e) => {
        const emailRegex = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
      
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
            case 'email':
                setEmailDirty(true);
            break;
                
            default:
        }
    }
                
    // check login/password in base
    const [invalidAuth, setInvalidAuth] = useState(false);

    const authHandler = async () => {    
        try {    
            const responseSubmit = await axios.post("/api/submit", { email })
    
            if (responseSubmit.status === 200) {
                setInvalidAuth(false);
                navigate('/');
            } else {
                setInvalidAuth(true);
            }
        } catch (error) {
            console.error(error);
            setInvalidAuth(true);
        }
    };
    
    
    
    return (
        <form className="loginForm" onSubmit={handleLogin} method="post">
            <h1 className="adminPanel">Forgot Password</h1>

            {invalidAuth && <div className="inputsError invalidAuth">Invalid login/password</div>}

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
                <button className='btnLogin' disabled={!formValid} type="submit" onClick={authHandler}>Send</button>
            </div>
        </form>
    )
}

export {Forgot}