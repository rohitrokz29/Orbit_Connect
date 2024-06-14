import React, { useState, useContext, createContext, useEffect, Children } from "react";
import { UserContext } from "./UserContext";
import socketIO from "socket.io-client";
import { useNavigate } from "react-router-dom";

export const SocketContext = createContext();

export const SocketState = ({ children }) => {
    const [socket, SetSocket] = useState(null);
    const { user, isSignedIn, loaderRef } = useContext(UserContext);
    console.log({userSocker:user});
    useEffect(() => {
        if(!user) return;
        const newSocket = socketIO.connect(process.env.SOCKET_IO_CONNECTION || "http://localhost:3000/",{query:`signedinUser=${user["username"]}`});
        SetSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}