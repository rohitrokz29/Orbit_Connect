import { useContext, useEffect, useState } from "react";
import { baseUrl, headers, properties, } from "../assets/api";
import { useLocation } from "react-router-dom";
import { profiles } from './homeComponents/helpers'
import Image from '../assets/images/profile.png'
import NoPost from '../assets/images/nopost.jpeg'
import { Navbar } from "./Home";
import { PostsBox } from "./homeComponents/Explore";
import { UserContext } from "../contexts/UserContext";


const Profile = () => {
    const { user } = useContext(UserContext);
    const location = useLocation();

    const profile_name = location.pathname.split('/').at(2)
    const [profile, setProfile] = useState({});
    const [isFrined, setIsFrined] = useState(false);
    const [topPost, setTopPost] = useState([]);
    const [isRequested, setIsRequested] = useState(false);

    useEffect(() => {
        const frindsList = JSON.parse(localStorage.getItem('friends'));
        if (frindsList?.includes(profile_name)) {
            setIsFrined(true);
        }
    }, [profile_name]);

    useEffect(() => {
        fetch(`${baseUrl}user/${profile_name}`, {
            method: "GET",
            headers,
            credentials: properties.credentials
        })
            .then((res) => {
                if (res.status === 200) return res.json();
                return;
            })
            .then((res) => {
                setProfile({ ...profile, ...res })
                console.log(profile);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        if (!isFrined) {
            let list = JSON.parse(localStorage.getItem('friend_request'));
            if (list && list.includes(profile_name)) setIsRequested(true);

            return;
        }
        fetch(`${baseUrl}topPost/${profile_name}`, {
            method: "GET",
            headers,
            credentials: properties.credentials
        })
            .then(res => {
                if (res.status === 200) return res.json();
                return null;
            })
            .then(res => {
                console.log(res);
                if (!res) return;
                setTopPost([...res]);
            })
            .catch(err => {
                console.log(err);
                setTopPost([]);
            })

    }, [isFrined])

    const SendRequest = () => {
        let list = JSON.parse(localStorage.getItem('friend_request'));
        if ( isRequested || !user) return
        console.log("Req sent");
        fetch(`${baseUrl}sendRequest`, {
            method: "POST",
            body: JSON.stringify({ sender: user.username, reciever: profile_name }),
            headers,
            credentials: properties.credentials
        })
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    return true;
                }
                return false;
            })
            .then(res => {
                console.log(res);
                if (!res) return;
                if (list) {
                    list.push(profile_name);
                }
                else {
                    list = [profile_name]
                }
                localStorage.setItem('friend_request', JSON.stringify(list));

                setIsRequested(true)
            })
            .catch(err => {
                console.log(err);
            })
    }
    return (
        <>
            <div className="container mt-6 pt-4 columns">
                <div className="column is-one-third ">
                    <div className="card">
                        <div className="card-image">
                            <figure className="image is-4by3">
                                <img
                                    src={profile?.gender === 'Male' ? profiles.malePoster : profiles.femalePoster}
                                    alt="Poster image"
                                />
                            </figure>
                        </div>
                        <div className="card-content">
                            <div className="media">
                                <div className="media-left">
                                    <figure className="image is-64x64">
                                        <img
                                            src={profile ? profiles[profile.profileImg] : profiles[0]}
                                            alt="Profile image"
                                        />
                                    </figure>
                                </div>
                                <div className="media-content">
                                    <p className="title is-4">{profile.name}</p>
                                    <p className="subtitle is-6">@{profile.username}</p>
                                </div>
                            </div>

                            <div className="content">
                                {/* about me, gender, dob */}
                                <blockquote>
                                    {profile.description}
                                </blockquote>
                                <blockquote>
                                    <strong>DOB:</strong>  {profile.dob ? profile.dob : "dd-mm-yyyy"}
                                </blockquote>
                                <div className="container is-flex is-flex-direction-row	is-justify-content-center	 ">

                                    {!isFrined && <div className="content">
                                        <button className="button is-link" onClick={SendRequest}>{isRequested ? "Requested" : "Add Friend"}</button>
                                    </div>
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="column">
                    <nav className="level is-mobile mt-6 pt-6">
                        <div className="level-item has-text-centered">
                            <div>
                                <p className="heading">Posts</p>
                                <p className="title">{profile.num_posts ? profile.num_posts : 0}</p>
                            </div>
                        </div>
                        <div className="level-item has-text-centered">
                            <div>
                                <p className="heading">Friends</p>
                                <p className="title">{profile.num_friends ? profile.num_friends : 0}</p>
                            </div>
                        </div>
                        <div className="level-item has-text-centered">
                            <div>
                                <p className="heading">Likes</p>
                                <p className="title">{profile.num_likes ? profile.num_likes : 0}</p>
                            </div>
                        </div>
                        <div className="level-item has-text-centered">
                            <div>
                                <p className="heading">Profile Visits</p>
                                <p className="title">{profile.visits ? profile.visits : 0}</p>
                            </div>
                        </div>
                    </nav>
                    <div className="container mt-4 " style={{ height: "40vh", overflowY: 'auto' }}>
                        {
                            isFrined && topPost.length > 0 ?
                                topPost?.map(({ username, post_data, timestamp, likes, dislikes, id }, index) => {
                                    return <PostsBox key={index}
                                        id={id}
                                        username={username}
                                        post_data={post_data}
                                        timestamp={timestamp}
                                        likes={likes}
                                        dislikes={dislikes} />
                                })
                                : <img src={isFrined ? NoPost : Image} style={!isFrined ? {
                                    filter: "blur(5px)"
                                } : {
                                    width: '40vw',
                                    marginInline: "5rem"

                                }} alt="Blurred Example" className="image" />


                        }
                    </div>
                </div>
            </div>
        </>
    )
}
export default Profile;