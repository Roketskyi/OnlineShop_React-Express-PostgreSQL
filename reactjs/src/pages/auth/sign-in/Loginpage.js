import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './loginpage.css';

function Loginpage({ setIsLogin }) {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    authHandler();
  };

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loginDirty, setLoginDirty] = useState(false);
  const [passwordDirty, setPasswordDirty] = useState(false);
  const [loginError, setLoginError] = useState('Login cannot be empty');
  const [passwordError, setPasswordError] = useState('Password cannot be empty');
  const [formValid, setFormValid] = useState(false);
  const [invalidAuth, setInvalidAuth] = useState(false);

  useEffect(() => {
    if (loginError || passwordError) setFormValid(false);
    else setFormValid(true);
  }, [loginError, passwordError]);

  const loginHandler = (e) => {
    const re = /^[a-zA-Z0-9_.]+$/;
    if (!re.test(e.target.value)) setLoginError('Incorrect login');
    else if (e.target.value.length < 4 || e.target.value.length > 12)
      setLoginError('Login must be between 4 and 12 characters');
    else setLoginError('');

    setInvalidAuth(false);
    setLogin(e.target.value);
  };

  const passwordHandler = (e) => {
    const regex = /^[a-zA-Z0-9]+$/;
    if (!e.target.value) setPasswordError('Password cannot be empty');
    else if (e.target.value.length < 4 || e.target.value.length > 10)
      setPasswordError('Password must be between 4 and 10 characters');
    else if (!regex.test(e.target.value)) setPasswordError('Incorrect password');
    else setPasswordError('');

    setInvalidAuth(false);
    setPassword(e.target.value);
  };

  const blurHandle = (e) => {
    switch (e.target.name) {
      case 'login':
        setLoginDirty(true);
        break;

      case 'password':
        setPasswordDirty(true);
        break;

      default:
        break;
    }
  };

  const authHandler = async () => {
    try {
      const response = await axios.get('/api/find/' + login);
      const base = response.data;
      
      if (!base) {
        setInvalidAuth(true);
        return;
      }

      const responseSubmit = await axios.post('/api/submit', { login, password });

      if (responseSubmit.status === 200 && responseSubmit.data.token) {
        const token = responseSubmit.data.token;

        localStorage.setItem('token', token);

        setIsLogin(true);
        setInvalidAuth(false);
        navigate('/');
      } else {
        setInvalidAuth(true);
      }
    } catch (error) {
      console.error(error);
      setInvalidAuth(true);
    } finally {
      setPassword('');
    }
  };

  return (
    <form className="loginForm" onSubmit={handleLogin} method="post" style={{textAlign:"center"}}>
      <h1 className="adminPanel">Login</h1>

      {invalidAuth && <div className="inputsError invalidAuth">Invalid login/password</div>}

      <div>
        {loginDirty && loginError && <div className="inputsError">{loginError}</div>}
        <input
          onChange={loginHandler}
          onBlur={blurHandle}
          name="login"
          value={login}
          className="loginFormInput"
          type="text"
          placeholder="Login"
          autoComplete="nickname"
          required
        />
      </div>

      {passwordDirty && passwordError && <div className="inputsError">{passwordError}</div>}
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

      <a href="/forgot-password" className="forgot-password">
        Forgot password?
      </a>

      <div>
        <button className="btnLogin" disabled={!formValid} type="submit">
          Login
        </button>
      </div>
    </form>
  );
}

export { Loginpage };