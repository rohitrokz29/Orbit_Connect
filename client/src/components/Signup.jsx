import React, { useRef, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { SideImage } from "./Main";
import { UserContext } from "../contexts/UserContext";

const SignupPage = () => {

  const nameRef = useRef(null);//1
  const usernameRef = useRef(null);//2
  const emailRef = useRef(null);//3
  const passwordRef = useRef(null);//4
  const genderRef = useRef(null);//5
  const dobRef = useRef(null);//6

  const [infoCheck, setInfoCheck] = useState(0);
  const { Signup, error } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setInfoCheck(0);
    const info = {
      name: nameRef.current.value,
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      gender: genderRef.current.value,
      dob: dobRef.current.value
    };
    if (info.name.length < 2) {
      setInfoCheck(1);
      return;
    }
    if (info.username.length < 2 || info.username.indexOf(' ') >= 0) {
      setInfoCheck(2);
      return;
    }
    if (!info.email) {
      setInfoCheck(3);
      return;
    }
    if (info.password.length < 10) {
      setInfoCheck(4);
      return;
    }
    if (!info.gender) {
      setInfoCheck(5);
      return;
    }
    if (!info.dob) {
      setInfoCheck(6);
      return;
    }

    if (infoCheck === 0) {
      console.log(info);
      Signup(info);
    }


  }

  return (
    <main className="hero pt-0 mt-0">
      <div className="columns is-vcentered">
        <div className="column px-6">
          <section className="section is-small">

            <h2 className="subtitle  has-text-centered">
              Welcome to Orbit Connect
            </h2>
          </section>

          <p className="content  has-text-centered"><strong>Signup</strong> at Orbit Connect</p>
          <div className="box" style={{overflowY:"auto", height:"70vh"}}>

            <div className="field px-6">
              <label className="label">Name</label>
              <div className="control has-icons-left has-icons-right">
                <input className="input   " type="text" placeholder="Enter Name" ref={nameRef} />
                {(infoCheck === 1) && <>
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock"></i>
                  </span>
                  <span className="icon is-small is-right has-text-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span></>}
              </div>
              {infoCheck === 1 &&
                <p className="help is-danger">This name is invalid.</p>
              }
            </div>
            <div className="field px-6">
              <label className="label">Username</label>
              <div className="control has-icons-left has-icons-right">
                <input className="input   " type="text" placeholder="Enter Username" ref={usernameRef} />
                {(infoCheck === 2) && <>
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock"></i>
                  </span>
                  <span className="icon is-small is-right has-text-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span></>}
              </div>
              {infoCheck === 2 &&
                <p className="help is-danger">This username name is invalid.</p>
              }
              {
                error === 'username_already_exist' &&
                <p className="help is-danger">
                  This username already taken.
                </p>
              }
            </div>

            <div className="field px-6 " >
              <label className="label">Email</label>
              <div className="control has-icons-left has-icons-right">
                <input className="input  " type="email" placeholder="Enter Email" ref={emailRef} />
                {(infoCheck === 3 || error === "invalid_email" || error === "email_exist") && <>
                  <span className="icon is-small is-left">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <span className="icon is-small is-right has-text-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span></>}
              </div>
              {(infoCheck === 3 || error === "invalid_email") && <p className="help is-danger">This email is invalid.</p>
              }
              {
                error === "email_exist" && <p className="help is-danger">Email already in use.</p>
              }
            </div>

            <div className="field px-6">
              <label className="label">Password</label>
              <div className="control has-icons-left has-icons-right">
                <input className="input  " type="password" placeholder="Enter Password" ref={passwordRef} />
                {infoCheck === 4 && <> <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
                  <span className="icon is-small is-right has-text-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                  </span></>}
              </div>
              {infoCheck === 4 &&
                <p className="help is-danger">This password is not strong.</p>
              }
            </div>
            <div className="field px-6">

              <div className="select " >
                <select ref={genderRef} defaultValue={null} className="px-6">
                  <option value={null} selected >Gender</option>
                  <option value={"Male"} >Male</option>
                  <option value={"Female"} >Female</option>
                  <option value={"Prefer not to say"} >Prefer Not to Say</option>
                </select>
                {infoCheck === 5 &&
                  <p className="help is-danger">Please select a gender</p>
                }
              </div>
            </div>


            <div className="field px-6">
              <label className="label">Date of Birth</label>
              <div className="control has-icons-left has-icons-right">
                <input className="input  " type="date" placeholder="Date of Birth" ref={dobRef} />

              </div>
              {infoCheck === 6 &&
                <p className="help is-danger">Enter Date of Birth</p>
              }
            </div>

            <div className="field px-6">
              <div className="control">
                <label className="checkbox">
                  <input type="checkbox" />
                  I agree that details provided are correct.
                </label>
              </div>
            </div>
            <div className="is-flex is-justify-content-center">
              <button className="button is-primary is-normal px-6 mb-4 " onClick={handleSubmit}>Signup</button>
            </div>
            <p className="content has-text-centered">Already have a account- <Link to="/signin">Signin</Link></p>

          </div>

        </div>
        <div className="column pt-6">
          <SideImage />
        </div>
      </div>
    </main>
  );


}

export default SignupPage;