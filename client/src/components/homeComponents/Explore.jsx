import React, { useRef, useState } from 'react';
import { baseUrl, properties,headers } from '../../assets/api';
import UserBox from './UserBox';

const Explore = () => {
    const searchRef = useRef(null);
    const [searchResult, setSearchResult] = useState([]);
    const searchUser = (e) => {
        e.preventDefault();
        const searchParam = searchRef.current.value;
        if (!searchParam) return;
        fetch(`${baseUrl}search/${searchParam}`, {
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
                setSearchResult([...res]);
            })
    }
    return (
        <div className="column  is-vcentered px-3 py-0 mx-0" style={{ height: "90vh" }} >
            <div className="container   has-background-dark px-0 is-vcentered is-flex has-flex-direction-row is-alignitems-center is-justify-content-space-around" >
                <div className="field mt-2  px-2" style={{ width: "-webkit-fill-available " }} >
                    <div className="control has-icons-left has-icons-right">
                        <input className="input  " type="search" placeholder="Search User" ref={searchRef} />
                        <span className="icon is-small is-left">
                            <i className="fas fa-search"></i>
                        </span>
                    </div>
                </div>
                <button className="button is-primary is-normal px-6  my-2 mr-5  is-alignself-center" style={{ maxHeight: "40px" }} onClick={searchUser} >Search</button>

            </div>

            {searchResult.length > 0 &&
                searchResult.map(({ username, name, profileImg },index) => {
                    return(
                        <UserBox key={index} username={username} name={name} profileImg={profileImg} type={"search"} />
                    )
                })}
        </div>
    )
}

export default Explore