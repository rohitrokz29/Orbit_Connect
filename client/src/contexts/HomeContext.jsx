import { createContext, useContext, useState, useEffect } from "react";
import Home from "../components/Home";
import { UserContext } from "./UserContext";
import { baseUrl, headers, properties } from "../assets/api";


export const HomeContext = createContext();

export const HomeState = ({ children }) => {
    const [friends, setFriends] = useState([]);
    const { user } = useContext(UserContext);
    //fetch friends
    useEffect(() => {
        if (!user) return;
        const friendsList = [user.username]
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

                console.log(friendsList);
                res?.forEach((friendData) => {
                    friendsList.push(friendData.username);
                    if (!localStorage.getItem(`_messages_${friendData.username}`)) {
                        localStorage.setItem(`_messages_${friendData.username}`, JSON.stringify([]));
                    }
                })

                const friend_json_string = JSON.stringify(friendsList);
                if (!localStorage.getItem('friends') || localStorage.getItem('friends') !== friend_json_string) {
                    localStorage.setItem('friends', friend_json);
                }
            })
            .catch(err =>
                setFriends([])
            );
        if (!localStorage.getItem('friends')) {
            localStorage.setItem('friends', JSON.stringify(friendsList));
        }
    }, [])

    useEffect(() => {
        if (!user) return;
        const username = user[username]
        const messages = {};
        fetch(`${baseUrl}friends/${user.username}`, {
            method: "GET",
            credentials: properties.credentials,
            headers
        })
            .then((res) => {
                if (res.status !== 200) {
                    return null;
                }
                return res.json();
            })
            .then((res) => {
                res?.forEach(({ sender, message, timeStamp }) => {
                    if (!messages[sender]) {
                        messages[sender] = [];
                    }
                    messages[sender].push({ sender, message, timeStamp: new Date(+timeStamp).toString() })
                    /**
                     * 
                     * COMPLETE THIS LOGIC TO SET MESSAGES AFTER FETCHING
                     */
                })
            })
            .catch((err) => {
                console.log(err);
            });
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