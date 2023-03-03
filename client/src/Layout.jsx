import { Outlet } from 'react-router-dom';
import Header from './header.jsx';

export default function(){
    return(
        <div className='px-4 bg-gray-200 flex flex-col min-h-screen'>
            <Header/>
            <Outlet/>
        </div>
    )
}