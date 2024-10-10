import React, {
    createContext,
    useEffect,
    useContext,
    useState,
    useReducer,
    useRef,
} from "react";
import { baseUrl, headers, properties } from "../assets/api";
import { Navigate } from "react-router-dom";
export const UserContext = createContext();

/**
 * state={
 * user:{
 * username,name,id
 * }
 * }
 */
export const UserState = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [error, setError] = useState("");
    const loaderRef = useRef(null);
    const userReducerFunction = (state, action) => {
        switch (action.type) {
            case "signin":
                localStorage.setItem("orbit_user_data", JSON.stringify(action.payload));
                setIsSignedIn((isSignedIn) => true);
                <Navigate to='/' replace />
                return { user: action.payload };
            case "signout":
                localStorage.clear();
                setIsSignedIn((isSignedIn) => false);
                return { user: null };
            default:
                setIsSignedIn((isSignedIn) => false);
                return { user: null };
        }
    };
    const [state, userDispatch] = useReducer(userReducerFunction, { user: null });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("orbit_user_data"));
        console.log(user);
        if (user?.authTokenExpiry <= Date.now() || !user) {
            userDispatch({ type: "signout" });
        } else {
            userDispatch({ type: "signin", payload: user });
        }
    }, []);

    const Signup = ({ email, name, password, username }) => {
        loaderRef.current.continuousStart();
        console.log({ email, name, password, username });
        setError("");
        fetch(`${baseUrl}signup`, {
            method: "POST",
            credentials: properties.credentials,
            headers,
            body: JSON.stringify({ email, name, password, username }),
        })
            .then((res) => {
                if (res.status === 400) {
                    setError("invalid_email");
                    return null;
                }
                if (res.status === 401) {
                    setError("email_exist");
                    return null;
                }
                if (res.status === 500) {
                    setError('server_error');
                    return null;
                }
                return res.json();
            })
            .then((res) => {
                if (res) {
                    userDispatch({
                        type: "signin",
                        payload: { username, name, id: res.id },
                    });

                }
                loaderRef.current.complete();
            })
            .catch((err) => {
                setError(err.message);
                console.log(err);
                loaderRef.current.complete();
            });

    };

    const Signin = ({ username, password }) => {
        loaderRef.current.continuousStart();
        setError("");
        fetch(`${baseUrl}signin`, {
            method: "POST",
            credentials: properties.credentials,
            headers,
            body: JSON.stringify({ username, password }),
        })
            .then((res) => {
                console.log(res);
                if (res.status === 404) {
                    setError("invalid_username")
                    return null;
                }
                if (res.status === 400) {
                    setError("wrong_password");
                    return null;
                }
                return res.json();
            })
            .then((res) => {
                console.log(res);
                if (res) {
                    userDispatch({
                        type: "signin",
                        payload: { username: res.username, name: res.name, id: res.id },
                    });
                }
                loaderRef.current.complete();
            })
            .catch((err) => {
                setError(err.message);
                loaderRef.current.complete();
            });

    };
    const SignOut = () => {
        loaderRef.current.continuousStart();
        fetch(`${baseUrl}signout`, {
            method: "DELETE",
            credentials: properties.credentials,
            headers,
        })
            .then((res) => res.json())
            .then((res) => {
                if (res) {
                    userDispatch({ type: "signout" });
                }
                loaderRef.current.complete();
            })
            .catch((err) => {
                setError(err.message)
                loaderRef.current.complete();
            }
            );

    };

    return (
        <UserContext.Provider
            value={{
                ...state,
                isSignedIn,
                error,
                loaderRef,
                setError,
                Signin,
                Signup,
                SignOut,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
