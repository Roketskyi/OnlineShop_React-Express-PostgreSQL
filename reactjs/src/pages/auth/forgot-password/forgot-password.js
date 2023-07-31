import { useState } from 'react';
import axios from 'axios';

import './forgot-password.css';

function Forgot() {
  const [email, setEmail] = useState('');
  const [emailDirty, setEmailDirty] = useState(false);
  const [emailError, setEmailError] = useState('Email cannot be empty');
  const [formValid, setFormValid] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      // eslint-disable-next-line
      const response = await axios.post('/api/reset-password', { email });
      setSuccess(true);
      setError('');
    } catch (error) {
      setError('Failed to reset password. Please try again.');
      setSuccess(false);
    }
  };

  const emailHandler = (e) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!e.target.value) {
      setEmailError('Email cannot be empty');
      setFormValid(false);
    } else if (e.target.value.length < 6 || e.target.value.length > 30) {
      setEmailError('Email must be between 6 and 30 characters');
      setFormValid(false);
    } else if (!emailRegex.test(e.target.value)) {
      setEmailError('Invalid email format');
      setFormValid(false);
    } else {
      setEmailError('');
      setFormValid(true);
    }

    setEmail(e.target.value);
  };

  const blurHandle = (e) => {
    switch (e.target.name) {
      case 'email':
        setEmailDirty(true);
        break;
      default:
        break;
    }
  };

  return (
    <form className="loginForm" onSubmit={handlePasswordReset} method="post">
      <h1 className="adminPanel">Forgot Password</h1>

      {success && <div className="successMessage">Password reset instructions have been sent to your email.</div>}
      {error && <div className="errorMessage">{error}</div>}

      {emailDirty && emailError && <div className="inputsError">{emailError}</div>}
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
        <button className="btnLogin" disabled={!formValid} type="submit">
          Send
        </button>
      </div>
    </form>
  );
}

export { Forgot };