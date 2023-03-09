import { useState, useContext } from "react"
import { differenceInCalendarDays } from 'date-fns'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "./UserContext";

export default function BookingWidgets({ place }) {
    const navigate = useNavigate();
    const { user} = useContext(UserContext);
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [noOfGuests, setNoOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState();
    const [loading , setLoading] = useState(false);

    let bookingPrice = 0;
    if (checkIn && checkOut) {
        bookingPrice = (differenceInCalendarDays(new Date(checkOut), new Date(checkIn)) * place?.price).toLocaleString();
    }
    const bookThisPlace = async () => {

        if(!user){
            navigate('/login');
            return;
        }
        if(!checkIn || !checkOut || !noOfGuests || !name || !mobile){
            toast.error("All fields are mandatory");
            return;
        }
        const placeId = place._id;
        const data = { placeId, checkIn, checkOut, noOfGuests, name, mobile, bookingPrice }
        setLoading(true);
        await axios.post('/booking', { placeId, checkIn, checkOut, noOfGuests, name, mobile, bookingPrice }).then((res) => {
            setLoading(false);
            navigate('/account/bookings')
        }).catch(err => {
            setLoading(false);
            toast.error("Cannot book this place please try again later");
            return;
        });
    }

    return (
        <>
        <ToastContainer/>
        <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
                Price: ₹{place?.price} /per night
            </div>
            <div className="border rounded-2xl mt-4 ">
                <div className="flex">
                    <div className="py-3 px-4">
                        <label className="font-semibold">Check in<span className="text-red-600">*</span></label>

                        <DatePicker
                            selected={checkIn}
                            onChange={(date) => setCheckIn(date)}
                            selectsStart
                            startDate={checkIn}
                            endDate={checkOut}
                            placeholderText="Check in"
                            dateFormat="MMMM d, yyyy"
                            popperPlacement="bottom-start"
                            minDate={new Date()}
                        />
                    </div>
                    <div className="py-3 px-4 bor">
                        <label className="font-semibold">Check out<span className="text-red-600">*</span></label>

                        <DatePicker
                            selected={checkOut}
                            onChange={(date) => setCheckOut(date)}
                            selectsStart
                            startDate={checkIn}
                            endDate={checkOut}
                            placeholderText="Check out"
                            dateFormat="MMMM d, yyyy"
                            popperPlacement="bottom-start"
                            minDate={new Date(checkIn).setDate(new Date(checkIn).getDate() +1 )}
                        />
                    </div>
                </div>
                <div className="py-3 px-4 bor">
                    <label className="font-semibold">Number of guests<span className="text-red-600">*</span></label>
                    <input type="number" value={noOfGuests} onChange={ev => setNoOfGuests(ev.target.value)} />
                </div>
                {bookingPrice.length > 0 && (
                    <>
                        <div className="py-3 px-4 bor">
                            <label className="font-semibold">Name<span className="text-red-600">*</span></label>
                            <input type="text" value={name} onChange={ev => setName(ev.target.value)} />
                        </div>
                        <div className="py-3 px-4 bor">
                            <label className="font-semibold">Phone number<span className="text-red-600">*</span></label>
                            <input type="tel" value={mobile} onChange={ev => setMobile(ev.target.value)} />
                        </div>
                    </>
                )}

            </div>

            {!loading ? 
            <button className={"primary mt-4 font-semibold"} onClick={bookThisPlace}>
                Book this place
                {bookingPrice.length > 0 && (
                    <span> ₹{bookingPrice}/-</span>
                )}
            </button>
            :
            <button className={"loading mt-4 font-semibold"} onClick={bookThisPlace} disabled={loading}>
                Booking...
            </button>
            }
        </div>
        </>
    )
}