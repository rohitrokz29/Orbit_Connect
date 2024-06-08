import React, { useRef, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { SideImage } from "./Main";
import { baseUrl, properties, headers } from "../assets/api";

/****
 ADD LOADING IN BUTTON
 */
const ForgotPassword = () => {
//make it username
    const usernameRef = useRef(null)
    const [infoCheck, setInfoCheck] = useState(0)

    const handleForgotPass = (e) => {
        e.preventDefault();
        setInfoCheck(0);
        const username = usernameRef.current.value;
        if (!username) {
            setInfoCheck(1);
            return;
        }
        fetch(`${baseUrl}forgot_password`, {
            method: "POST",
            credentials: properties.credentials,
            headers,
            body: JSON.stringify({ username }),
        }).then(res => {
            if (res.status === 404) {
                setInfoCheck(1);
                return null;
            }
            if (res.status === 400) {
                setInfoCheck(2);
                return;
            }
            if (res.status === 200) {
                setInfoCheck(3);
                return null;
            }
        })
            .catch(err => setInfoCheck(2));
    }

    return (
        <main className="hero">
            <div className="columns is-vcentered">
                <div className="column px-6">
                    <section className="section is-small">

                        <h2 className="subtitle pt-2 has-text-centered">
                            Welcome to Orbit Connect
                        </h2>
                    </section>

                    <p className="content has-text-centered"><strong>Reset Password </strong> of Orbit Connect</p>
                    <div className="box">
                        <div className="field px-6 " >
                            <label className="label">Username</label>
                            <div className="control has-icons-left has-icons-right">
                                <input className="input  " type="email" placeholder="Enter Username" ref={usernameRef} />
                                {(infoCheck === 1) && <>
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-envelope"></i>
                                    </span>
                                    <span className="icon is-small is-right has-text-warning">
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </span>
                                </>}
                            </div>
                            {(infoCheck !== 0) &&
                                <p className="help is-danger">{infoCheck === 1 ? "Invalid Username" : (infoCheck === 2) ? "Try Later" : ""}</p>
                            }
                        </div>
                        {(infoCheck === 3) &&
                            <p className="content has-text-success has-text-centered">Check Your Email</p>
                        }

                        <div className="is-flex is-justify-content-center">
                            <button type="submit" className="button is-primary is-normal px-6 mb-4 " onClick={handleForgotPass}>Submit</button>
                        </div>
                        <p className="content has-text-centered">Doesn't have a account- <Link to="/signup">Signup</Link></p>

                    </div>

                </div>
                <div className="column">
                    <SideImage />
                </div>
            </div>
        </main>
    )
}
export default ForgotPassword;