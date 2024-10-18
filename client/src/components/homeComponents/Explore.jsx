import React, { useContext, useEffect, useRef, useState } from 'react';
import { baseUrl, properties, headers } from '../../assets/api';
import UserBox from './UserBox';
import { UserContext } from '../../contexts/UserContext';
import { profiles } from './helpers';
import { Link } from 'react-router-dom';

const Explore = () => {
    const [search, SetSearch] = useState("");
    const { user, isSignedIn } = useContext(UserContext);
    const [searchResultUsers, setSearchResultUsers] = useState([]);
    const [searchResultPosts, setSearchResultPosts] = useState([]);

    const [postList, setPostList] = useState([]);
    const searchUser = (e) => {
        e.preventDefault();
        if (!search || search.length === 0) return;
        fetch(`${baseUrl}search/${search}/${user.username}`, {
            method: "GET",
            headers,
            credentials: properties.credentials,
        })
            .then(res => {
                if (res.status === 200) return res.json();
                return null;
            })
            .then(res => {
                if (!res) return;

                setSearchResultUsers([...res.users]);
                setSearchResultPosts([...res.posts]);
            })
    }
    useEffect(() => {
        fetch(`${baseUrl}posts/${user.username}`, {
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
                setPostList([...res])
            })


    }, [])
    useEffect(() => {
        if (search.length === 0) {
            setSearchResultUsers([]);
            setSearchResultPosts([]);
        }
    }, [search])
    return (
        <div className="column   is-vcentered px-3 py-0 mx-0" style={{ height: "90vh", overflowY: 'auto' }} >
            <div className="container   has-background-dark px-0 is-vcentered is-flex has-flex-direction-row is-alignitems-center is-justify-content-space-around" >
                <div className="field mt-2  px-2" style={{ width: "-webkit-fill-available " }} >
                    <div className="control has-icons-left has-icons-right">
                        <input className="input  " type="search" placeholder="Search User/Posts" value={search} onChange={(e) => { SetSearch(e.target.value) }} />
                        <span className="icon is-small is-left">
                            <i className="fas fa-search"></i>
                        </span>
                    </div>
                </div>
                <button className="button is-primary is-normal px-6  my-2 mr-5  is-alignself-center" style={{ maxHeight: "40px" }} onClick={searchUser} >Search</button>

            </div>

            {searchResultUsers.length > 0 &&
                searchResultUsers?.map(({ username, name, profileImg }, index) => {
                    return (
                        <UserBox key={index} username={username} name={name} profileImg={profileImg} type={"search"} />
                    )
                })
            }
            {
                searchResultPosts.length > 0 &&
                searchResultPosts?.map(({ username, post_data, timestamp, likes, dislikes,id }, index) => {
                    return <PostsBox key={index}
                        id={id}
                        username={username}
                        post_data={post_data}
                        timestamp={timestamp}
                        likes={likes}
                        dislikes={dislikes} />
                })

            }
            {
                postList.length > 0 && searchResultUsers.length === 0 && searchResultPosts.length === 0 &&
                postList?.map(({ username, post_data, timestamp, likes, dislikes,id }, index) => {
                    return <PostsBox key={index}
                        id={id}
                        username={username}
                        post_data={post_data}
                        timestamp={timestamp}
                        likes={likes}
                        dislikes={dislikes} />
                })
            }

        </div>
    )
}

export default Explore

const PostsBox = ({ id, username, post_data, timestamp, likes, dislikes }) => {
    const date = new Date(+timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}`;


    const addLike = () => {
        
    }
    const addDislike = () => {

    }

    return (
        <>
            <div className="box">
                <article className="media">
                    <div className="media-left">
                        <Link to={`user/${username}`}>
                            <figure className="image is-64x64">
                                <img src={profiles[0]} />
                            </figure>
                        </Link>
                    </div>
                    <div className="media-content">
                        <div className="content">
                            <p>
                                <strong>{username}</strong> <small className='pl-1 pr-1'>{formattedDate}</small>
                                <small className='pl-1 pr-1'>{formattedTime}</small>
                                <br />
                                {post_data}
                            </p>
                        </div>
                        <nav className="level is-mobile">
                            <div className="level-left">

                                <a className="level-item" aria-label="retweet">
                                    <span className="icon is-small">
                                        <i className="fas fa-heart" aria-hidden="true"></i>
                                    </span>
                                    <span className='pr-1 pl-1'>{likes}</span>
                                </a>

                                <a className="level-item" aria-label="like">
                                    <span className="icon is-small">
                                        <i className="fas fa-thumbs-down" aria-hidden="true"></i>
                                    </span>
                                    <span className='pr-1 pl-1'> {dislikes}</span>

                                </a>
                            </div>
                        </nav>
                    </div>
                </article>
            </div>
        </>
    )
}