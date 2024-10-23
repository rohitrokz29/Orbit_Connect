import { createContext, useContext, useState, useEffect } from "react";
import Home from "../components/Home";
import { UserContext } from "./UserContext";
import { baseUrl, headers, properties } from "../assets/api";


export const HomeContext = createContext();

export const HomeState = ({ children }) => {
    const [friends, setFriends] = useState([]);
    const { user } = useContext(UserContext);
    const [request, setRequest] = useState([]);
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
                console.log(friendsList);
                res?.forEach((friendData) => {
                    friendsList.push(friendData.username);
                    if (!localStorage.getItem(`_messages_${friendData.username}`)) {
                        localStorage.setItem(`_messages_${friendData.username}`, JSON.stringify([]));
                    }
                })
                setFriends([...res]);

                const friend_json_string = JSON.stringify(friendsList);
                if (!localStorage.getItem('friends') || localStorage.getItem('friends') !== friend_json_string) {
                    localStorage.setItem('friends', friend_json_string);
                }
            })
            .catch(err =>
                console.log(err)
            );
        if (!localStorage.getItem('friends')) {
            localStorage.setItem('friends', JSON.stringify(friendsList));
        }
    }, [user])

    useEffect(() => {
        console.log({ friends });
    }, [friends])
    useEffect(() => {
        if (!user) return;
        const username = user.username
        fetch(`${baseUrl}messages/${user.username}`, {
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
                const messages = {};
                res?.forEach(({ sender, message, timeStamp }) => {
                    if (!messages[sender]) {
                        messages[sender] = [];
                    }
                    messages[sender].push({ sender, message, timeStamp })
                })
                return messages;
            })
            .then((messages) => {
                console.log({ messages });
                for (let username in messages) {
                    messages[username] = messages[username].sort((a, b) => {
                        return +a.timeStamp - (+b.timeStamp);
                    })
                    if (!localStorage.getItem(`_messages_${username}`)) {
                        localStorage.setItem(`_messages_${user}`, JSON.stringify(messages[username]));
                        continue;
                    }
                    let prevMessages = JSON.parse(localStorage.getItem(`_messages_${username}`));

                    localStorage.setItem(`_messages_${username}`, JSON.stringify([...prevMessages, ...messages[username]]));
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        fetch(`${baseUrl}request/${user.username}`, {
            method: "GET",
            credentials: properties.credentials,
            headers
        }).then(res => {
            if (res.status === 200) return res.json();

            return null;
        })
            .then(res => {
                if (!res) return;
                setRequest([...res]);
            })
    }, [])



    return (
        <HomeContext.Provider value={{
            friends,
            setFriends,
            request,
            setRequest
        }}>
            {children}
        </HomeContext.Provider>
    )
}