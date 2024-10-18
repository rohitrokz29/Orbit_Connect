import { useContext, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoadingBar from 'react-top-loading-bar';
import { UserContext } from "./contexts/UserContext";
import { HomeState } from "./contexts/HomeContext";
import 'bulma/css/bulma.min.css';
import FallbackComp from "./loader/Fallback";
const Main = lazy(() => import("./components/Main"));
const Home = lazy(() => import("./components/Home"));
const SigninPage = lazy(() => import("./components/Signin"));
const SignupPage = lazy(() => import("./components/Signup"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const Profile = lazy(() => import("./components/Profile"));

function App() {
  const { user, loaderRef } = useContext(UserContext)

  return (
    <>
      <LoadingBar color="red" ref={loaderRef} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ?
            <HomeState>
              <Suspense fallback={<FallbackComp />}><Home /></Suspense>
            </HomeState> :
            <Suspense fallback={<FallbackComp />}><Main /></Suspense>
          } />
          <Route path="/signup" element={!user ?
            <Suspense fallback={<FallbackComp />}><SignupPage /></Suspense>
            : <Navigate to='/' replace />} />
          <Route path="/signin" element={!user ?
            <Suspense fallback={<FallbackComp />}><SigninPage /></Suspense>
            : <Navigate to='/' replace />} />
          <Route path="/forgot_password" element={!user ?
            <Suspense fallback={<FallbackComp />}><ForgotPassword /></Suspense>
            : <Navigate to='/' replace />} />
          <Route path="/reset/:id" element={!user ?
            <Suspense fallback={<FallbackComp />}><ResetPassword /></Suspense>
            : <Navigate to='/' replace />} />
          <Route exact path='/user/:username' element={
            <Suspense fallback={<FallbackComp />}><Profile /></Suspense>
          } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
