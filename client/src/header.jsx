import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function () {

    const { user, searchQuery, setSearchQuery } = useContext(UserContext);
    const { pathname } = useLocation();
    const suggestions = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal']

    const [inputValue, setInputValue] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        const filtered = suggestions.filter((suggestion) =>
            suggestion.toLowerCase().startsWith(value.toLowerCase())
        );
        setFilteredSuggestions(filtered);
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        setFilteredSuggestions([]);
    };
    const searchPlace = () => {
        if (inputValue.length == 0) {
            setSearchQuery("p");
            setFilteredSuggestions([]);
        }
        else {
            setSearchQuery(inputValue);
            setFilteredSuggestions([]);
        }
    }

    return (
        <header className='sticky top-0 z-30 -mx-4 py-3 flex justify-between border-b-2 bg-white rounded-xl'>
            <Link to={'/'} href="" className='flex items-center gap-1 ml-5'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8" style={{ color: '#8B5CF6' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                </svg>
                <span className="font-semibold text-xl">Cozy<span className="text-primary">Stay</span></span>
            </Link>
            {(pathname === '/login') || (pathname === '/register') ?
                " "
                :
                <div className='flex gap-2 border border-gray-300 rounded-xl px-4 justify-center items-center'>
                    <div >
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Search state"

                        />
                        {filteredSuggestions.length > 0 && (
                            <ul className="absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-y-scroll" style={{ height: '25rem' }}>
                                {filteredSuggestions.map((suggestion, index) => (
                                    <li className="block px-4 py-2 text-text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer" key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button className='bg-primary text-white py-2 px-3 rounded-full h-10 w-10' onClick={searchPlace}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </button>
                </div>}

            <Link to={user ? '/account' : '/login'} className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 mr-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>

                <div className="bg-gray-500 text-white rounded-full border border-gray-400 overflow-hidden">
                    {user ?
                        <img src={user?.avatar} alt={user?.name} className="rounded-full w-8 h-8 " />
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 ">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                    }
                </div>

                {!!user && (
                    <div>{user.name}</div>
                )}

            </Link>

        </header>
    )
}