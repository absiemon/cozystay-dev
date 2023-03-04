import { useState } from 'react'
import './App.css'
import {Route, Routes} from 'react-router-dom'
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import Layout from './Layout';
import RegisterPage from './pages/RegisterPage';
import axios from 'axios';
import { UserContextProvider } from './UserContext';
import Account from './pages/AccountPage';
import PlaceForm from './PlaceForm';
import PlacePage from './pages/PlacePage';
import MyPlace from './pages/MyPlace';
import BookingsPage from './pages/BookingsPage';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL; 
axios.defaults.withCredentials = true;

function App() {

  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<IndexPage/>}></Route>
          <Route path='/login' element={<LoginPage/>}></Route>
          <Route path='/register' element={<RegisterPage/>}></Route>
          <Route path='/account' element={<Account/>}></Route>    
          <Route path='/account/places' element={<PlacePage/>}></Route>    
          <Route path='/account/places/new' element={<PlaceForm/>}></Route>  
          <Route path='/account/places/:id' element={<PlaceForm/>}></Route> ☻ 
          <Route path='/place/:id' element={<MyPlace/>}></Route> 
          <Route path='/account/bookings' element={<BookingsPage/>}></Route>  

          {/* for myprofile subpage=undefined and  for mybookings and mu accomodation it will be bookings and places*/}
          {/* <Route path='/account/bookings' element={<Account/>}></Route>
          <Route path='/account/places' element={<Account/>}></Route> */}
          {/* <Route path='/account/:subpage/:action' element={<Account/>}></Route>     */}
          
        </Route>
      </Routes>
      </UserContextProvider>
  )
}

export default App
