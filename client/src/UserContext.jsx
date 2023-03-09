import { createContext, useEffect, useState } from "react";
import axios from 'axios';
export const UserContext  = createContext({});

export function UserContextProvider({children}){

    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    const [flag, setFlag] = useState(false);
    const [searchQuery, setSearchQuery] = useState("a");

    useEffect(() => {
        if(!user){
            axios.get('/profile').then((res)=>{
                setUser(res.data);
                setReady(true);
            }).catch((err)=>{
                console.log(err);
            });
           
        }
    }, [user])
    return(
        <UserContext.Provider value={{user,setUser, ready,searchQuery, setSearchQuery ,flag, setFlag}}>
            {children}
        </UserContext.Provider>
    )
}