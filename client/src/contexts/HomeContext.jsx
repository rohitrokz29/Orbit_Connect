import { createContext, useState } from "react";
import Home from "../components/Home";

export const HomeContext = createContext();

export const HomeState = ({ children }) => {

    return (
        <HomeContext.Provider value={{
           
        }}>
            {children}
        </HomeContext.Provider>
    )
}