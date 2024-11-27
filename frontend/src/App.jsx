import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AfterRegister from './pages/auth/AfterRegister';
import { useUser } from './context/userContext';
import Profile from './pages/home/Profile';

const ProtectedRoute = ({ element, ...rest }) => {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return element; 
};

const App = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <>
      <Routes>
        {/* Protected route: User needs to be logged in to access this */}
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        
        {/* Routes for login, register, and afterRegister */}
        <Route path="/login" element={!user ? <Login /> : <Home />} />
        <Route path="/register" element={!user ? <Register /> : <Home />} />
        <Route path="/profile" element={!user ? <Login /> : <Profile />} />
        <Route path="/afterRegister" element={<AfterRegister />} />
      </Routes>
    </>
  );
};

export default App;
