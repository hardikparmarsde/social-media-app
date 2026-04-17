import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { fetchPosts } from './actions/actions';
import Header from './components/header';
import Footer from './components/footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadPost from './components/Posts/Post/UploadPost';
import Auth from './components/Auth/Auth';
import PaginatedItems from './components/pagination';
import RequireAuth from './components/routing/RequireAuth';
import PublicOnly from './components/routing/PublicOnly';

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [currentId, setCurrentId] = useState('');

  // Fetch posts on component mount
  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 6 }));
  }, [dispatch]);

  // Memoize callbacks to prevent unnecessary re-renders of child components
  const handleSetCurrentId = useCallback((id) => {
    setCurrentId(id);
  }, []);

  return (
    <div className="app-shell app-bg">
      <Router>
        <Header user={user} setItemOffset={() => {}} />
        <main className="app-main">
          <div className="app-container py-6 sm:py-10">
            <Routes>
              <Route path="/" element={<Navigate to="/feed" replace />} />
              <Route
                path="/auth/login"
                element={
                  <PublicOnly>
                    <Auth mode="login" />
                  </PublicOnly>
                }
              />
              <Route
                path="/auth/signup"
                element={
                  <PublicOnly>
                    <Auth mode="signup" />
                  </PublicOnly>
                }
              />
              <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
              <Route
                path="/feed"
                element={
                  <PaginatedItems setCurrentId={handleSetCurrentId} />
                }
              />
              <Route
                path="/post"
                element={
                  <RequireAuth>
                    <UploadPost
                      currentId={currentId}
                      setCurrentId={handleSetCurrentId}
                      user={user}
                    />
                  </RequireAuth>
                }
              />
            </Routes>
          </div>
        </main>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
