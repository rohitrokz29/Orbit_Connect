import { createContext, useContext, useState, useEffect } from "react";
import Home from "../components/Home";
import { UserContext } from "./UserContext";
import { baseUrl, headers, properties } from "../assets/api";


export const HomeContext = createContext();

export const HomeState = ({ children }) => {
    const [friends, setFriends] = useState([]);
    const { user } = useContext(UserContext);
    useEffect(() => {
        fetch(`${baseUrl}friends/${user.username}`, {
            method: "GET",
            credentials: properties.credentials,
            headers
        })
            .then(res => res.status === 200 ? res.json() : null)
            .then(res => {
                console.log({ res });
                if (!res) return;
                setFriends([...res]);
                res?.forEach((friendData) => {

                    if (!localStorage.getItem(`_messages_${friendData.username}`)) {
                        localStorage.setItem(`_messages_${friendData.username}`, JSON.stringify([]));
                    }
                })
            })
            .catch(err =>
                setFriends([])
            );
    }, [])

    return (
        <HomeContext.Provider value={{
            friends,
            setFriends
        }}>
            {children}
        </HomeContext.Provider>
    )
}