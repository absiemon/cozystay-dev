import { createContext, useEffect, useState } from "react";
import axios from 'axios';
export const UserContext  = createContext({});

export function UserContextProvider({children}){

    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    const [anyState, setAnyState] = useState('');
    const [anyTitle, setAnyTitle] = useState('');
    // const [isSearched, setIsSearched] = useState(false);
    const [searchQuery, setSearchQuery] = useState({ anyState: '', anyTitle: '' });

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
        <UserContext.Provider value={{user,setUser, ready, anyState, setAnyState, anyTitle, setAnyTitle,searchQuery, setSearchQuery}}>
            {children}
        </UserContext.Provider>
    )
}