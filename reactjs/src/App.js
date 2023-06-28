import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

import { Homepage } from './pages/homepage/Homepage';
import { Posts } from './pages/posts/Posts';
import { PostsTitle } from './pages/posts/PostsTitle';
import { Photos } from './pages/photos/Photos';
import { About } from './pages/about/About';
import { Notfound } from './pages/notfound/Notfound';
import { Loginpage } from './pages/auth/sign-in/Loginpage';
import { Registration } from './pages/auth/sign-up/Registration';
import { Forgot } from './pages/auth/forgot-password/forgot-password';

import { Breadbord } from './сomponents/breadbord/Breadbord';

function App() {
  const token = localStorage.getItem('token');
  // eslint-disable-next-line
  const [isLogin, setIsLogin] = useState(!!token);

  const checkTokenValidity = async () => {
    try {
      await axios.post('/api/check-token', { token });

      setIsLogin(true);
    } catch (error) {
      setIsLogin(false);
      localStorage.removeItem('token');
    }
  };

  if (token) {
    checkTokenValidity();
  }
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Breadbord setIsLogin={setIsLogin} />}>
          <Route index element={<Homepage />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/:title" element={<PostsTitle />} />
          <Route path="photos" element={<Photos />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Loginpage setIsLogin={setIsLogin} />} />
          <Route path="sign-up" element={<Registration />} />
          <Route path="forgot-password" element={<Forgot />} />

          <Route path="*" element={<Notfound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;