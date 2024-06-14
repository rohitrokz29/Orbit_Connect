import { Link } from "react-router-dom";
import ProfileImage from '../assets/userImages/profile3.jpeg'
import ChatBox from "./homeComponents/ChatBox";
import { useContext, useEffect, useState } from "react";
import { profiles } from "./homeComponents/helpers";
import { baseUrl, properties, headers } from "../assets/api";
import { UserContext } from "../contexts/UserContext";
import { HomeContext } from "../contexts/HomeContext";
import UserBox from "./homeComponents/UserBox";

const Home = () => {
    const [chatUser, setChatUser] = useState({});
    const { user, SignOut } = useContext(UserContext);
    const { friends } = useContext(HomeContext);
    return (
        <>
            <Navbar  setChatUser={setChatUser}/>
            <div className="columns pt-6 mt-3">
                <div className="column has-background-grey ml-3   is-4  " style={{
                    paddingLeft: "1.5rem",
                    height: '90vh', overflowX: "auto"
                }} >

                    <div className="field  ">
                        <div className="control">
                            <input className="input" type="search" placeholder="Sarch " />
                        </div>
                    </div>

                    {
                        friends.length > 0 && friends.map(({ username, name, profileImg, isOnline }, index) => {
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

const Navbar = ({setChatUser}) => {
    const { user, SignOut } = useContext(UserContext);

    return (<nav className="navbar is-fixed-top px-1  	" style={{ borderBottom: "2px solid #fff" }} role="navigation" aria-label="main navigation">
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
                <p className="navbar-item has-text-light is-size-6 px-5" style={{cursor:"pointer"}} onClick={(e)=>setChatUser({})} >Explore</p>
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
                    <div className="navbar-dropdown px-0  ">
                        <Link className="navbar-item has-text-centered  has-background-primary-40	has-text-dark	is-size-6" to={`/user/${user.username}`}>
                            Profile
                        </Link>
                        <Link className="navbar-item has-text-centered has-background-primary-40	has-text-dark is-size-6	" onClick={SignOut}>
                            SignOut
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    </nav >)
}