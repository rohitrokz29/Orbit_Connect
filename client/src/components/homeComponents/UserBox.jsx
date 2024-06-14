import { Link, useNavigate } from "react-router-dom"
import { profiles } from "./helpers"
import { useEffect } from "react";


const UserBox = ({ name, username, profileImg, type, isOnline, newChatUser }) => {
    const navigate = useNavigate(null);
    useEffect(() => {
        if (type === 'search') {
            isOnline = false;
            newChatUser = () => {
                navigate(`/user/${username}`)
            };
        }
    }, [])
    return (

        <article className="block message my-3 py-1" style={{ maxHeight: "90px", cursor: type === 'search' ? "" : "pointer" }}
            onClick={newChatUser}>
            <div className="message-body has-text-light  is-flex has-flex-direction-row container" >

                <Link to={`user/${username}`}>
                    <figure className="image is-vcentered  " style={{
                        width: "60px",
                        inlineSize: "60px",
                        cursor: "pointer"
                    }}>
                        <img src={profiles[profileImg]} style={{
                            padding: "0",
                            width: '60px',
                            height: "60px",
                            maxHeight: "100%",
                            border: "2px solid #fff"
                        }} className="is-rounded" alt="" />
                    </figure>
                </Link>
                <div className="content px-3 is-vcentered">
                    <p className=" my-0 py-0 "   >
                        <span className="is-size-5" >{name} </span>
                        {isOnline && <span className={`icon has-text-success is-size-6 ml-3`}>
                            <i className="fas fa-circle"></i>
                        </span>}
                    </p>
                    <p className="is-size-6 my-0 py-0">&nbsp;{username}</p>
                </div>
            </div>
        </article>
    )
}

export default UserBox