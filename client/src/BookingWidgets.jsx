import { useEffect, useState } from "react"
import { differenceInCalendarDays } from 'date-fns'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookingWidgets({ place }) {
    const navigate = useNavigate();
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [noOfGuests, setNoOfGuests] = useState(1);
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState();
    console.log(checkIn)
    let bookingPrice = 0;
    if (checkIn && checkOut) {
        bookingPrice = (differenceInCalendarDays(new Date(checkOut), new Date(checkIn)) * place?.price).toLocaleString();
    }
    const bookThisPlace = async () => {
        const placeId = place._id;
        const data = { placeId, checkIn, checkOut, noOfGuests, name, mobile, bookingPrice }
        console.log(data);
        await axios.post('/booking', { placeId, checkIn, checkOut, noOfGuests, name, mobile, bookingPrice }).then((res) => {
            navigate('/account/bookings')

        }).catch(err => console.log(err));
    }

    return (
        <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-2xl text-center">
                Price: ₹{place?.price} /per night
            </div>
            <div className="border rounded-2xl mt-4 ">
                <div className="flex">
                    <div className="py-3 px-4">
                        <label>Check in:</label>
                        {/* <input type="date" value={checkIn} onChange={ev => setCheckIn(ev.target.value)} required placeholder="select date" min={currentDate}/> */}
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
                        <label>Check out:</label>
                        {/* <input type="date" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} min={currentDate} /> */}
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
                    <label>Number of guests:</label>
                    <input type="number" value={noOfGuests} onChange={ev => setNoOfGuests(ev.target.value)} />
                </div>
                {bookingPrice.length > 0 && (
                    <>
                        <div className="py-3 px-4 bor">
                            <label>Name</label>
                            <input type="text" value={name} onChange={ev => setName(ev.target.value)} />
                        </div>
                        <div className="py-3 px-4 bor">
                            <label>Phone number</label>
                            <input type="tel" value={mobile} onChange={ev => setMobile(ev.target.value)} />
                        </div>
                    </>
                )}

            </div>

            <button className="primary mt-4" onClick={bookThisPlace}>
                Book this place
                {bookingPrice.length > 0 && (
                    <span> ₹{bookingPrice}/-</span>
                )}
            </button>
        </div>
    )
}