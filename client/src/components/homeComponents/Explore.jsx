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
    const [isModalVisible, setModalVisible] = useState(false);

    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);
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
    }, [search]);

    const Modal = ({ isVisible, onClose }) => {
        if (!isVisible) return null;
        const [postData, setPostData] = useState('');
        const [status, setStatus] = useState(0);
        const AddPost = () => {
            setStatus(0);
            if (postData.length <= 5) {
                setStatus(1);
                return;
            }
            else if (postData.length >= 500) {
                setStatus(2);
                return;
            }
            fetch(`${baseUrl}posts/${user.username}`, {
                method: "POST",
                body: JSON.stringify({ post_data: postData }),
                headers,
                credentials: properties.credentials,
            })
                .then(res => {
                    if (res.status === 200) {
                        onClose();
                        return res.json();
                    }
                    return null;
                })
                .then(res => {
                    console.log(res);
                    setPostList([res,...postList])
                })
                .catch((err) => {
                    setStatus(3);
                })
        }

        return (
            <div className="modal is-active">
                <div className="modal-background" onClick={onClose}></div>
                <div className="modal-content">
                    <div className="box px-6">
                        <div className="container has-text-weight-semibold my-3" >
                            Enter the post information/thoughts in the box below
                        </div>
                        <div className="control">
                            <textarea
                                className="textarea is-info is-focused"
                                placeholder="Enter it Here"
                                value={postData}
                                onChange={(e) => { setPostData(e.target.value) }}
                            ></textarea>
                        </div>
                        <div className="field is-grouped my-3">
                            <p className="control">
                                <button className="button is-link" onClick={AddPost}>Add Post</button>
                            </p>
                            <p className="control">
                                <button className=" button is-danger " aria-label="close" onClick={onClose}>Cancel</button>
                            </p>
                        </div>

                        <div className="container  my-3 has-text-danger" >
                            {status === 0 ? "" : status === 3 ? "Server Error" : `Entered text length too ${status == 1 ? 'short' : 'long'}.`}
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="column   is-vcentered px-3 py-1 mx-0" style={{ height: "90vh", overflowY: 'auto' }} >
            <div className="container   has-background-dark px-0 is-vcentered is-flex has-flex-direction-row is-alignitems-center " >
                <div className="field mt-2  px-2" style={{ width: "-webkit-fill-available ", maxWidth: "50vw" }} >
                    <div className="control has-icons-left has-icons-right">
                        <input className="input  " type="search" placeholder="Search User/Posts" value={search} onChange={(e) => { SetSearch(e.target.value) }} />
                        <span className="icon is-small is-left">
                            <i className="fas fa-search"></i>
                        </span>
                    </div>

                </div>

                <div className="buttons has-addons is-vcentered py-1 pb-1 ">
                    <button className="button is-primary is-normal py-2 px-3" style={{ maxHeight: "40px" }} onClick={searchUser} >Search</button>
                    <button className="button is-link is-normal py-2 px-3" data-target='modal' style={{ maxHeight: "40px" }} onClick={openModal} >Add Post</button>
                </div>
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
                searchResultPosts?.map(({ username, post_data, timestamp, likes, dislikes, id }, index) => {
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
                postList?.map(({ username, post_data, timestamp, likes, dislikes, id }, index) => {
                    return <PostsBox key={index}
                        id={id}
                        username={username}
                        post_data={post_data}
                        timestamp={timestamp}
                        likes={likes}
                        dislikes={dislikes} />
                })
            }
            <Modal isVisible={isModalVisible} onClose={closeModal} />
        </div>

    )
}

export default Explore


export const PostsBox = ({ id, username, post_data, timestamp, likes, dislikes }) => {
    const [like, setLike] = useState(likes);
    const [dislike, setDislike] = useState(dislikes);
    const date = new Date(+timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}`;

    const addLike = () => {
        fetch(`${baseUrl}like/like:${id}`, {
            method: "POST",
            headers,
            credentials: properties.credentials,
        })
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    setLike(like => like + 1);
                    return;
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    const addDislike = () => {

        fetch(`${baseUrl}dislike/dislike:${id}`, {
            method: "POST",
            headers,
            credentials: properties.credentials,
        })
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    setDislike(dislike => dislike + 1);
                    return;
                }
            })
            .catch((err) => {
                console.log(err);
            })
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
                                        <i className="fas fa-heart has-text-danger" onClick={addLike} aria-hidden="true"></i>
                                    </span>
                                    <span className='pr-1 pl-1'>{like}</span>
                                </a>

                                <a className="level-item" aria-label="like">
                                    <span className="icon is-small">
                                        <i className="fas fa-thumbs-down has-text-grey" onClick={addDislike} aria-hidden="true"></i>
                                    </span>
                                    <span className='pr-1 pl-1'> {dislike}</span>

                                </a>
                            </div>
                        </nav>
                    </div>
                </article>
            </div>
        </>
    )
}