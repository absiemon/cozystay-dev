import axios from "axios";
import { differenceInCalendarDays, format } from "date-fns";
import { useEffect, useState } from "react";
import Loading from "../loader";
import AccountPage from "./AccountPage";
import { CSSTransition } from 'react-transition-group';
import '../my-transition.css';
import PopUp from "../PopUp";

// for showing all bookings in the bookings section
export default function BookingsPage() {
    const [isOpen, setIsOpen] = useState(false);
    const[loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [cancel, setCancel] = useState(false);
    const [popUp, setPopUp] = useState(false);
    
    useEffect(() => {
        setIsOpen(true);
        setLoading(true);
        axios.get('/get-bookings').then((res) => {
            // console.log(res);
            setBookings(res.data);
            setLoading(false);
        }).catch(err => {
            console.log(err);
        })
    }, [cancel]);

    return (
        <>
        <Loading loading={loading} flag={true}/>
        <AccountPage />

        <CSSTransition in={isOpen} appear timeout={1000} classNames="my-transition" unmountOnExit>
        <div>
            <div>
                {bookings?.length > 0 && bookings.map(booking => (
                    <div className="flex gap-4 bg-white rounded-2xl overflow-hidden" key={booking._id}>
                        <div className="h-34 w-48 mt-2">
                            {booking.placeId.photos.length > 0 && (
                                <img className="object-cover" src={booking.placeId.photos[0]} alt="photo" />
                            )}
                        </div>
                        <PopUp popUp={popUp} setPopUp={setPopUp} bookingId={booking._id} placeId={booking.placeId._id} cancel={cancel} setCancel={setCancel}/>

                        <div className="py-3 pr-3 grow">
                            <h2 className="text-xl">{booking.placeId.title}</h2>
                            <button className="absolute bg-primary text-white flex py-1 px-3 rounded-2xl right-20 -mt-5 gap-1" onClick={()=> setPopUp(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>

                                Cancel
                            </button>
                            <div className="text-xl">


                                <div className="flex gap-1 items-center mt-2 mb-2 text-gray-600">
                                    <div className="flex gap-1 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                        </svg>
                                        {differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn))} nights :
                                    </div>
                                    <div className="flex gap-1 items-center ml-2">
                                        <svg xm lns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                                        </svg>

                                        {format(new Date(booking.checkIn), 'yyyy-MM-dd')} &rarr; {format(new Date(booking.checkOut), 'yyyy-MM-dd')}
                                    </div>

                                </div>

                                Total price: ₹{booking.bookingPrice}
                            </div>

                        </div>


                    </div>
                ))}
            </div>
        </div>
        </CSSTransition>

        </>
    )
}