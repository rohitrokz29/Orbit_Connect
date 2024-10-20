import { useContext, useEffect, useRef, useState } from "react";
import { HomeContext } from "../../contexts/HomeContext";
import { profiles } from "./helpers";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { SocketContext } from "../../contexts/SocketContext";
import { baseUrl, properties, headers } from "../../assets/api";
import Explore from "./Explore";

const ChatBox = ({ chatUser, setChatUser }) => {
    const { name, username, profileImg } = chatUser
    const messageBoxRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const { user } = useContext(UserContext);
    const { socket } = useContext(SocketContext);
    const { friends, setFriends } = useContext(HomeContext);
    const [isOnline, SetIsOnline] = useState(false);
    console.log({ chatUser });
    useEffect(() => {
        if (!username || username === undefined) return;
        let _stored_messages = JSON.parse(localStorage.getItem(`_messages_${username}`));
        setMessages([..._stored_messages])
    }, [username]);

  
    useEffect(() => {
        socket?.emit('check-online', { from: user?.username, check: username });
    }, [username, socket])

    socket?.on('check-online', ({ check, status }) => {
        console.log({ status });
        SetIsOnline(status);
    })

    socket?.on('recieve-message', ({ sender, message, timeStamp }) => {
        console.log({ message, sender, timeStamp });
        localStorage.setItem(`_messages_${username}`, JSON.stringify([...messages, { sender, message, timeStamp }]));
        setMessages([...messages, { sender, message, timeStamp }]);
    })
    let prevDate = "";

    const sendMessage = (e) => {
        e.preventDefault();
        let newMessage = messageBoxRef.current.value;
        if (!newMessage) return;
        socket.emit('send-message', {
            sender: user.username,
            to: username,
            message: newMessage,
            timeStamp: (new Date()).getTime()
        });
        localStorage.setItem(`_messages_${username}`, JSON.stringify([...messages, { sender: user.username, message: newMessage, timeStamp: (new Date()).getTime() }]));
        setMessages([...messages, { sender: user.username, message: newMessage, timeStamp: (new Date()).getTime() }])
        messageBoxRef.current.value = "";
    }
    const deleteUser = (e) => {
        e.preventDefault();
        fetch(`${baseUrl}delete/friend`, {
            method: "POST",
            credentials: properties.credentials,
            headers,
            body: JSON.stringify({ user: user.username, friend: username })
        })
            .then(res => res.status === 200 ? res.json() : null)
            .then(res => {
                if (!res) return;
                localStorage.removeItem(`_messages_${username}`);
                setFriends((friends) => friends.filter(friend => friend.username !== username))
                setChatUser({});
            })

    }

    return username ? (
        <div className="column  is-vcentered   " style={{ height:'85vh' }} >
            <div className="block mx-0  py-0 my-0 has-background-dark is-flex has-flex-direction-row is-justify-content-space-between	" style={{
                height: "7vh",
                borderBottom: "2px solid #7e5f5f"
            }}>
                <Link to={`user/${username}`} className="is-flex has-flex-direction-row ">
                    <figure className="image is-vcentered mx-2" style={{ width: "50px", inlineSize: "50px", cursor: "pointer" }}>
                        <img src={profiles[profileImg]} style={{ width: '45px', height: "45px", maxHeight: "100%", border: "2px solid #fff" }} className="is-rounded" alt="" />
                    </figure>
                    <div className="content px-2 ">
                        <p className=" my-0 py-0 "   >
                            <span className="is-size-6 has-text-light" >{name} &nbsp;&nbsp;
                                <span className="is-size-7 has-text-light" >({username}) </span>
                            </span>
                        </p>
                        <p className={`is-size-6 my-0 py-0 has-text-${isOnline?'success':'danger'}`}>
                            &nbsp;{isOnline ? "Online" : "Offline"}
                        </p>
                    </div>
                </Link>

                <div className="is-align-self-baseline		 dropdown is-hoverable ">
                    <div className="dropdown-trigger px-6 py-1">
                        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                            <span>More</span>
                        </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                        <div className="dropdown-content px-0 mx-0" style={{ width: "100px", cursor: 'pointer' }}>
                            <div className="dropdown-item px-0 has-text-centered  has-background-link"
                                onClick={(e) => {
                                    localStorage.setItem(`_messages_${username}`, JSON.stringify([]));
                                    setMessages([]);
                                }}>
                                <span style={{ cursor: 'hover' }}>
                                    Delete Chat
                                </span>
                            </div>
                            {/* <hr className="dropdown-divider px-0 mx-0" style={{ width: '100px', cursor: 'pointer' }} /> */}
                            <div className="dropdown-item px-0 has-text-centered has-background-link"
                                onClick={deleteUser}>
                                <span style={{ cursor: 'hover' }}>
                                    Delete User
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* messages */}
            <div className="container" style={{ height: "72vh", overflowY: "auto" }}>
                {messages?.map(({ message, sender, timeStamp }, index) => {
                    const currentD_T = new Date(+timeStamp)
                    let date = currentD_T.toLocaleDateString();
                    let time = currentD_T.toLocaleTimeString();
                    let status = date === prevDate;
                    prevDate = date;


                    return (
                        <div key={index} className="container px-2 mx-2">
                            {!status &&
                                <div key={date} className=" is-flex is-justify-content-center has-flex-direction-row my-4">
                                    <p className="content tag">{date}</p>
                                </div>}
                            <div className={` my-3 mx-2 is-flex has-flex-direction-row  is-justify-content-${sender === username ? "left" : "right"}`} >
                                <div className={`box px-2 py-2  has-background-${sender === username ? "dark" : 'primary-25'} has-text-light`} style={{ maxWidth: "450px" }}>
                                    <p className="content mb-0">
                                        {message}
                                    </p>
                                    <p className="content mt-1 is-small has-text-link-light">
                                        {time}
                                    </p>
                                </div>
                            </div>
                        </div>)


                })}
                <ScrollToBottom />
            </div>
            <div className="container   has-background-dark px-0  py-0 my-0 is-vcentered is-flex has-flex-direction-row is-alignitems-center is-justify-content-space-around" >
                <div className="field mt-2  px-2" style={{ width: "-webkit-fill-available " }} >
                    <div className="control has-icons-left has-icons-right">
                        <input className="input  " type="text" placeholder="Message" ref={messageBoxRef} />
                        <span className="icon is-small is-left">
                            <i className="fas fa-envelope"></i>
                        </span>
                    </div>
                </div>
                <button className="button is-primary is-normal px-6  mt-2 mr-5  is-alignself-center" style={{ maxHeight: "40px" }} onClick={sendMessage}>Send</button>

            </div>
        </div>
    )
        : (
            <Explore />
        )
}
export default ChatBox;

const ScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
};