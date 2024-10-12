import { useEffect, useState } from "react";
import { baseUrl, headers, properties, } from "../assets/api";
import { useLocation } from "react-router-dom";
import { profiles } from './homeComponents/helpers'
const Profile = () => {
    const location = useLocation();
    const [profile, setProfile] = useState({});
    const [dob, setDob] = useState("");
    useEffect(() => {
        fetch(`${baseUrl}user/${location.pathname.split('/').at(2)}`, {
            method: "GET",
            headers,
            credentials: properties.credentials
        })
            .then((res) => {
                if (res.status === 200) return res.json();
                return;
            })
            .then((res) => {
                setProfile({ ...res })
                console.log(profile);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    useEffect(() => {
        console.log(profile);
        if (!profile) return;
        const date = new Date(+profile.dob);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formattedDate = `${day}-${month}-${year}`;
        setDob(formattedDate)

    }, [profile])
    return (
        <>
            <div className="container columns">
                <div className="column is-one-third ">
                    <div className="card">
                        <div className="card-image">
                            <figure className="image is-4by3">
                                <img
                                    src={profile?.gender === 'male' ? profiles.malePoster : profiles.femalePoster}
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
                                    <strong>DOB:</strong>  {dob ? dob : "dd-mm-yyyy"}
                                </blockquote>
                                <div className="container is-flex is-flex-direction-row	is-justify-content-center	 ">

                                    <div className="content">
                                        <button class="button is-link">Add Friend</button>
                                    </div>

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
                                <p className="title">3,456</p>
                            </div>
                        </div>
                        <div className="level-item has-text-centered">
                            <div>
                                <p className="heading">Friends</p>
                                <p className="title">123</p>
                            </div>
                        </div>
                        <div className="level-item has-text-centered">
                            <div>
                                <p className="heading">Likes</p>
                                <p className="title">456K</p>
                            </div>
                        </div>
                        <div className="level-item has-text-centered">
                            <div>
                                <p className="heading">Profile Visits</p>
                                <p className="title">789</p>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    )
}
export default Profile;