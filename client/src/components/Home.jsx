import { Link, useLocation } from "react-router-dom";
import ProfileImage from '../assets/userImages/profile3.jpeg'
import ChatBox from "./homeComponents/ChatBox";
import { useContext, useEffect, useRef, useState } from "react";
import { profiles } from "./homeComponents/helpers";
import { baseUrl, properties, headers } from "../assets/api";
import { UserContext } from "../contexts/UserContext";
import { HomeContext } from "../contexts/HomeContext";
import UserBox from "./homeComponents/UserBox";

const Home = () => {
    const [chatUser, setChatUser] = useState({});
    const { user, SignOut } = useContext(UserContext);
    const { friends } = useContext(HomeContext);
    const [searchParam, setSearchParam] = useState("");
    const [searchFriends, setSearchFriends] = useState([]);

    const setSearch = () => {
        if (!searchParam) return;
        const res = friends.filter(({ username }) => username.includes(searchParam));
        setSearchFriends([...res]);
    }
    useEffect(() => {
        if (!searchParam || searchParam.length === 0) {
            setSearchFriends([]);
        }
    }, [searchParam])
    return (
        <>
            <Navbar setChatUser={setChatUser} />
            <div className="columns  " style={{
                height: '90vh', marginTop: '10vh', position: "sticky"
            }}>
                <div className="column has-background-grey ml-3   is-4  pt-5 " style={{
                    paddingLeft: "1.5rem",
                    height: '90vh', overflowX: "auto"
                }} >

                    <div className="field  ">
                        <div className="control is-flex">
                            <input className="input" type="search" placeholder="Search Friends " value={searchParam} onChange={(e) => setSearchParam(e.target.value)} />
                            <button className="button is-primary ml-1"
                                onClick={setSearch}>
                                <span className="icon is-small">
                                    <i className="fas fa-search"></i>
                                </span>
                            </button>
                        </div>


                    </div>
                    {
                        searchFriends.length > 0 &&
                        searchFriends?.map(({ username, name, profileImg, isOnline }, index) => {
                            const newChatUser = (e) => {
                                e.preventDefault();
                                console.log("seting char user");
                                setChatUser({ username, profileImg, name, isOnline })
                            }
                            return (
                                <UserBox
                                    key={index}
                                    username={username}
                                    name={name}
                                    profileImg={profileImg}
                                    isOnline={isOnline}
                                    type={"friend"}
                                    newChatUser={newChatUser}
                                />
                            )
                        })
                    }

                    {
                        friends.length > 0 && searchFriends.length === 0 && friends.map(({ username, name, profileImg, isOnline }, index) => {

                            const newChatUser = (e) => {
                                e.preventDefault();
                                console.log("seting char user");
                                setChatUser({ username, profileImg, name, isOnline })
                            }
                            return (
                                <UserBox
                                    key={index}
                                    username={username}
                                    name={name}
                                    profileImg={profileImg}
                                    isOnline={isOnline}
                                    type={"friend"}
                                    newChatUser={newChatUser}
                                />
                            )
                        })
                    }
                </div>
                <ChatBox chatUser={chatUser} setChatUser={setChatUser} />
            </div>

        </>
    )
}
export default Home;

export const Navbar = ({ setChatUser }) => {

    const { user, SignOut } = useContext(UserContext);
    const { request, setRequest } = useContext(HomeContext);

    const AddFriend = ({ user2 }) => {
        fetch(`${baseUrl}addFriend`, {
            method: "POST",
            body: JSON.stringify({ user1: user.username, user2 }),
            headers,
            credentials: properties.credentials
        }).then(res => {
            if (res.status === 200) return res.json();
            return null;
        })
            .then(res => {
                if (!res) return;
                let list = request.filter(item => item != user2);
                setRequest([...list]);
            }).catch(err=>console.log(err));
    }
    return (<nav className="navbar is-fixed-top px-1  	" style={{ height: "10vh", borderBottom: "2px solid #fff" }} role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
            <Link className="is-size-3 " to='/'><strong>Orbit Connect</strong></Link>
            <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarElements">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarElements" className="navbar-menu">
            <div className="navbar-end">
                <Link className="navbar-item has-text-light is-size-6 px-5">Home</Link>
                <p className="navbar-item has-text-light is-size-6 px-5" style={{ cursor: "pointer" }} onClick={(e) => setChatUser({})} >Explore</p>
                <div className="navbar-item has-dropdown is-hoverable">
                    <div className="navbar-link">
                        Requests
                    </div>

                    <div className="navbar-dropdown" style={{ width: "25vw" }}>
                        {request?.length > 0 ?
                            request.map(({ sender }, index) => {
                                const tempFun=()=>{
                                    AddFriend({user2:sender});
                                }
                                return (
                                    <p key={index} className="navbar-item">
                                        <Link  to={`/user/${sender}`} className="px-2">{sender}</Link>
                                        <button className="button is-success" onClick={tempFun}>Accept</button>
                                    </p>
                                )
                            }) :
                            <p className="navbar-item">
                                <p className="px-2">No Requests</p>
                            </p>
                        }


                    </div>
                </div>
                <div className="navbar-item px-2 mr-6 py-0 my-0  has-dropdown  is-hoverable">
                    <Link className="navbar-link is-arrowless py-0  ">
                        <figure className="image py-0 ">
                            <img src={ProfileImage} style={{
                                padding: "0",
                                width: '50px',
                                height: "50px",
                                maxHeight: "100%",
                                border: "2px solid #fff"
                            }} className="is-rounded" alt="" />
                        </figure>
                    </Link>
                    <div className="navbar-dropdown px-0 pt-1  ">
                        <Link className="navbar-item has-text-centered  has-background-primary-40	has-text-dark 	is-size-6" style={
                            {
                                border: "1px solid rgb(200,0,0)",
                                borderRadius: " 5px",
                            }
                        } to={`/user/${user.username}`}>
                            Profile
                        </Link>
                        <Link className="navbar-item has-text-centered has-background-primary-40	my-1 has-text-dark is-size-6	" style={
                            {
                                border: "1px solid rgb(200,0,0)",
                                borderRadius: " 5px",
                            }
                        } onClick={SignOut}>
                            SignOut
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    </nav >)
}