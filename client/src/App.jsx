import { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoadingBar from 'react-top-loading-bar';
import { UserContext } from "./contexts/UserContext";
import 'bulma/css/bulma.min.css';
import Main from "./components/Main";
import Home from "./components/Home";
import SigninPage from "./components/Signin";
import SignupPage from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Profile from "./components/Profile";
import { HomeState } from "./contexts/HomeContext";

function App() {
  const { user, isSignedIn, loaderRef } = useContext(UserContext)

  return (
    <>
      <LoadingBar color="red" ref={loaderRef} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isSignedIn ? <HomeState><Home /></HomeState> : <Main />} />
          <Route path="/signup" element={!isSignedIn ? <SignupPage /> : <Navigate to='/' replace />} />
          <Route path="/signin" element={!isSignedIn ? <SigninPage /> : <Navigate to='/' replace />} />
          <Route path="/forgot_password" element={!isSignedIn ? <ForgotPassword /> : <Navigate to='/' replace />} />
          <Route path="/reset/:id" element={!isSignedIn ? <ResetPassword /> : <Navigate to='/' replace />} />
          <Route exact path='/user/:username' element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
