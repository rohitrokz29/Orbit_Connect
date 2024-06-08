import React, { useRef, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { SideImage } from "./Main";
import { UserContext } from "../contexts/UserContext";

const SigninPage = () => {
  const { Signin, error } = useContext(UserContext);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [infoCheck, setInfoCheck] = useState(0);
  /*
  infoCheck-1 username
  2- password
  3-both
   */
  const handleSignin = (e) => {
    e.preventDefault();
    setInfoCheck(0);
    const info = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };
    if (!info.username) {
      setInfoCheck(1);
      return;
    }
    if (info.password.length < 10) {
      console.log(info.password.length);
      setInfoCheck(2);
      return;
    }
    if (infoCheck === 0) {
      Signin(info);
    }
  };
  return (
    <main className="hero">
      <div className="columns is-vcentered">
        <div className="column px-6">
          <section className="section is-small">

            <h2 className="subtitle pt-2 has-text-centered">
              Welcome to Orbit Connect
            </h2>
          </section>

          <p className="content has-text-centered"><strong>Signin</strong> at Orbit Connect</p>
          <div className="box">
            <div className="field px-6 " >
              <label className="label">Username</label>
              <div className="control has-icons-left has-icons-right">
                <input className="input  " type="username" placeholder="Enter Username" ref={usernameRef} />
                {(infoCheck === 1 || error === "invalid_username") && <>
                  <span className="icon is-small is-left">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <span className="icon is-small is-right has-text-warning">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span>
                </>}
              </div>
              {(infoCheck === 1 || error === "invalid_username" ) &&
                <p className="help is-danger">This username is invalid</p>
              }
            </div>

            <div className="field px-6">
              <label className="label">Password</label>
              <div className="control has-icons-left has-icons-right">
                <input className="input   " type="password" placeholder="Enter Password" ref={passwordRef} />
                {(infoCheck === 2 || error === "wrong_password") && <>
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock"></i>
                  </span>
                  <span className="icon is-small is-right has-text-warning">
                    <i className="fas fa-exclamation-triangle "></i>
                  </span></>}
              </div>
              {(infoCheck === 2 || error === "wrong_password") &&
                <p className="help is-danger">Wrong Password</p>
              }
            </div>
            <div className="is-flex is-justify-content-center">
              <button className="button is-primary is-normal px-6 mb-4 " onClick={handleSignin}>Signin</button>
            </div>
            <p className="content has-text-centered" ><Link to="/forgot_password">Forgot Password?</Link></p>
            <p className="content has-text-centered">Doesn't have a account- <Link to="/signup">Signup</Link></p>

          </div>

        </div>
        <div className="column">
          <SideImage />
        </div>
      </div>
    </main>
  );
};

export default SigninPage;


