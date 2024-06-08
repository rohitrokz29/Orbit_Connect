import React, { useRef, useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { baseUrl, properties, headers } from "../assets/api";

const ResetPassword = () => {
    const { id } = useParams();
    const passRef = useRef(null);
    const confPassRef = useRef(null);
    const [errorType, setErrorType] = useState(0);
    const navigate = useNavigate();
    const handleChange = (e) => {
        e.preventDefault();
        setErrorType(0);
        const pass = {
            password: passRef.current.value,
            confPassword: confPassRef.current.value
        }
        if (pass.password.length < 10) {
            setErrorType(1);
            return;
        }
        if (pass.password !== pass.confPassword) {
            setErrorType(2);
            return;
        }
        fetch(`${baseUrl}reset/${id}`, {
            method: "POST",
            credentials: properties.credentials,
            headers,
            body: JSON.stringify({ password: pass.password }),
        }).then(res => {
            console.log(res);
            if (!res.ok) {
                setErrorType(3);
                return null;
            }
            navigate('/signin')
        })
            .catch(err => {
                setErrorType(3);
            })
    }

    return (
        <main className="hero px-6">
            <section className="section is-small">

                <h2 className="subtitle pt-2 has-text-centered">
                    Welcome to <Link to="/">Orbit Connect</Link>
                </h2>
                <p className="content has-text-centered"><strong>Change Password </strong> of Orbit Connect</p>

            </section>
            <div className="box mx-6">
                <div className="field">
                    <label className="label">New Password</label>
                    <div className="control">
                        <input className="input" type="password" placeholder="Enter New Password" ref={passRef} />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Confirm Password</label>
                    <div className="control">
                        <input className="input" type="password" placeholder="Confirm Password" ref={confPassRef} />
                    </div>
                </div>
                <p className="content has-text-danger">{
                    (errorType === 1) ? "Password too Short" :
                        (errorType === 2) ? "Password doesn't match" :
                            (errorType === 3) ? "Server Error" :
                                ""
                }</p>

                <button className="button is-primary" onClick={handleChange}>Submit</button>
            </div>
        </main>);
}
export default ResetPassword;