import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Homepage } from './pages/homepage/Homepage';
import { Posts } from './pages/posts/Posts';
import { PostsTitle } from './pages/posts/PostsTitle';
import { Photos } from './pages/photos/Photos';
import { About } from './pages/about/About';
import { Notfound } from './pages/notfound/Notfound';
import { Loginpage } from './pages/auth/Loginpage';

import { Breadbord } from './сomponents/breadbord/Breadbord';

function App() {
  const [isLogin, setIsLogin] = useState(localStorage.getItem('isLogin') === 'true');

  return (
    <>
      <Routes> 
        <Route path="/" element={<Breadbord isLogin={isLogin} setIsLogin={setIsLogin} />} >
          <Route index element={<Homepage />} />
          <Route path="posts" element={<Posts />} />
          <Route path="posts/:title" element={<PostsTitle />} />
          <Route path="photos" element={<Photos />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Loginpage setIsLogin={setIsLogin} isLogin={isLogin} />} />
        
          <Route path="*" element={<Notfound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;
