import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate} from 'react-router-dom';
import { fetchPosts } from './actions/actions';
import Header from './components/header';
import Footer from './components/footer';
import { BrowserRouter as Router,  Route, Routes } from 'react-router-dom';
import UploadPost from './components/Posts/Post/UploadPost';
import Auth from './components/Auth/Auth';
import PaginatedItems from './components/pagination';

const App = () => {
  const[currentId, setCurrentId] = useState('');
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const[user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

  
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('profile')));
  }, user)

  useEffect(() => {
     dispatch(fetchPosts());
  },[currentId])

  return (
    <div className="w-full">
      <Router>
        <Header user={user} setUser={setUser}/> 
        <Routes>
            <Route path='/auth' exact element={ !user ? <Auth /> : <Navigate to='/feed'/>} />
            <Route path='/' exact element={<Navigate to='/auth'/>}/>
            <Route path='/feed' exact element={user ? <PaginatedItems setCurrentId={setCurrentId} items={posts}/> : <Navigate to='/auth'/>} />
            <Route path='/post' exact element={user ? <UploadPost currentId={currentId} setCurrentId={setCurrentId} user={user} /> : <Navigate to="/auth"/>}/>              
        </Routes>
        <Footer/>
      </Router>  
    </div>
  );
}

export default App;
