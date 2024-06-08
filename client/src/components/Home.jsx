import { Link } from "react-router-dom";
import ProfileImage from '../assets/userImages/profile3.jpeg'
import ChatBox from "./homeComponents/ChatBox";
import Profile1 from '../assets/userImages/profile1.jpeg'
import Profile2 from '../assets/userImages/profile2.jpeg'
import Profile3 from '../assets/userImages/profile3.jpeg'
import Profile4 from '../assets/userImages/profile4.jpeg'
import Profile5 from '../assets/userImages/profile5.jpeg'
import Profile6 from '../assets/userImages/profile6.jpeg'
import Profile7 from '../assets/userImages/profile7.jpeg'
import Profile8 from '../assets/userImages/profile8.jpeg'
import Profile9 from '../assets/userImages/profile9.jpeg'
import Profile10 from '../assets/userImages/profile10.jpeg'
import { useState } from "react";

const Home = () => {
    const [chatUser, setChatUser] = useState({});
    const friends = [
        {
            username: "rohitrpkknkefn",
            name: "Rohit",
            profileImg: 1
        },
        {
            username: "hjfbrjkj",
            name: "Rohkjebkjb4r kjbfkjewkit",
            profileImg: 4
        }, {
            username: "kjdhkeh",
            name: "kjbfke kjbkje",
            profileImg: 10

        }, {
            username: ",fjbejbk",
            name: "kfjbkej wkjbekjb",
            profileImg: 3

        },
        {
            username: "rohitrpkknkefn",
            name: "Rohit",
            profileImg: 1
        },
        {
            username: "hjfbrjkj",
            name: "Rohkjebkjb4r kjbfkjewkit",
            profileImg: 4
        }, {
            username: "kjdhkeh",
            name: "kjbfke kjbkje",
            profileImg: 10

        }, {
            username: ",fjbejbk",
            name: "kfjbkej wkjbekjb",
            profileImg: 3

        }, {
            username: "rohitrpkknkefn",
            name: "Rohit",
            profileImg: 1
        },
        {
            username: "hjfbrjkj",
            name: "Rohkjebkjb4r kjbfkjewkit",
            profileImg: 4
        }, {
            username: "kjdhkeh",
            name: "kjbfke kjbkje",
            profileImg: 10

        }, {
            username: ",fjbejbk",
            name: "kfjbkej wkjbekjb",
            profileImg: 3

        },
    ]
    const profiles = {
        1: Profile1,
        2: Profile2,
        3: Profile3,
        4: Profile4,
        5: Profile5,
        6: Profile6,
        7: Profile7,
        8: Profile8,
        9: Profile9,
        10: Profile10
    }

    return (
        <>
            <Navbar />
            <div className="columns pt-6 mt-2">
                <div className="column has-background-grey mx-1 is-4 " style={{ height: '90vh', overflow: "auto" }} >
                    <div className="field ">
                        <div className="control">
                            <input className="input" type="search" placeholder="Sarch " />
                        </div>
                    </div>

                    {
                        friends.length > 0 && friends.map(({ username, name, profileImg }, index) => {
                            const newChatUser = (e) => {
                                e.preventDefault();
                                console.log("seting char user");
                                setChatUser({ username, profileImg, name })
                            }
                            return (
                                <article className="block message my-1 py-1" key={index} style={{ maxHeight: "100px" }}>
                                    <div className="message-body has-text-light  is-flex has-flex-direction-row container" >

                                        <Link to={`user/${username}`}>
                                            <figure className="image is-vcentered  " style={{ width: "60px", inlineSize: "60px", cursor: "pointer" }}>
                                                <img src={profiles[profileImg]} style={{ padding: "0", width: '60px', height: "60px", maxHeight: "100%", border: "2px solid #fff" }} className="is-rounded" alt="" />
                                            </figure>
                                        </Link>
                                        <div className="content px-3 is-vcentered">
                                            <p className="is-size-4 my-0 py-0 " style={{ cursor: 'pointer' }} onClick={newChatUser} >{name}</p>
                                            <p className="is-size-6 my-0 py-0">&nbsp;{username}</p>
                                        </div>
                                    </div>
                                </article>
                            )
                        })
                    }
                </div>
                <ChatBox chatUser={chatUser} />
            </div>

        </>
    )
}
export default Home;

const Navbar = () => {
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
                <Link className="navbar-item has-text-light is-size-6 px-5">Explore</Link>
                <div className="navbar-item px-2 mr-6 py-0 my-0  has-dropdown  is-hoverable">
                    <Link className="navbar-link is-arrowless py-0  ">
                        <figure className="image py-0 ">
                            <img src={ProfileImage} style={{ padding: "0", width: '50px', height: "50px", maxHeight: "100%", border: "2px solid #fff" }} className="is-rounded" alt="" />
                        </figure>
                    </Link>
                    <div className="navbar-dropdown px-0  ">
                        <Link className="navbar-item has-text-centered  has-background-primary-40	has-text-dark	is-size-6">
                            Profile
                        </Link>
                        <Link className="navbar-item has-text-centered has-background-primary-40	has-text-dark is-size-6	">
                            Logout
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    </nav >)
}