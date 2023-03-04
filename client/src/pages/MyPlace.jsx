import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import BookingWidgets from "../BookingWidgets";
import { useContext } from "react"
import { UserContext } from "../UserContext"
import { CSSTransition } from 'react-transition-group';
import '../my-transition.css';
import Loading from "../loader";

export default function MyPlace() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const [place, setPlace] = useState();
    const [showAllPhotos, setShowAllPhotos] = useState(false); // for pop-up
    const { user } = useContext(UserContext);

    useEffect(() => {
        setLoading(true);
        setIsOpen(true);
        if (!id) {
            return;
        }
        axios.get('/place/' + id).then((res) => {
            setPlace(res?.data);
            setLoading(false);
        })
    }, [id]);

    if (!place) {
        return '';
    }

    if (showAllPhotos) {
        //show pop-up
        return (
            <div className="absolute inset-0 bg-black text-white min-h-screen">
                <div className="bg-black p-8 grid gap-4">
                    <div className="">
                        <h2 className="text-3xl mr-36">Photos of {place?.title}</h2>
                        <button onClick={() => setShowAllPhotos(false)} className="fixed right-12 top-8 flex gap-1 py-2 px-4 rounded-2xl bg-white text-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Close photos

                        </button>
                    </div>
                    {place?.photos?.length > 0 && place?.photos?.map(photo => (
                        <div className="">
                            <img src={photo} alt="img" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <>
            <Loading loading={loading} flag={false} />
            <CSSTransition in={isOpen} appear timeout={1000} classNames="my-transition" unmountOnExit>
                <div className="mt-8 bg-gray-100 px-8 pt-8 rounded-xl">
                    <h1 className="text-2xl">{place?.title}</h1>
                    <a target="_blank" className="flex gap-1 my-3 my-2 block font-semibold underline" href={'https://maps.google.com/?q=' + place?.address}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>

                        {place?.address}
                    </a>

                    <div className="relative">
                        <div className="grid grid-cols-4 gap-2">
                            {place?.photos?.slice(0, 3).map((photo, index) => (
                                <div
                                    key={index}
                                    className={`relative ${index === 0 ? 'col-span-2' : 'col-span-1'
                                        }`}
                                >
                                    <img
                                        className="object-cover rounded-3xl" style={{ height: '23rem', width: '38rem' }}
                                        src={photo}
                                        alt="img"
                                    />
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowAllPhotos(true)} className=" flex gap-1 absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl shadow shadow-md shadow-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>

                            Show more
                        </button>
                    </div>


                    <div className="mt-8 mb-8 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
                        <div >
                            <div className=" my-4 flex" style={{ gap: '18rem' }}>
                                <h2 className="font-semibold text-2xl"> {place?.description}</h2>
                            </div>
                            <div className="flex text-lg text-gray-800 -mt-9 border-b-2 border-gray-400 py-4">
                                {place?.bedrooms} bedrooms • {place.maxGuests} max guest
                            </div>
                            <h1 className="text-xl font-semibold mt-5"> What this place offers</h1>
                            <div className="grid grid-cols-2 mt-5 gap-4">
                                {place?.perks.includes("wifi") && 
                                <label className="border p-4 bg-white flex rounded-2xl gap-2 items-center ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                                    </svg>

                                    <span>Wifi</span>
                                </label>}
                                {place?.perks.includes("parking") && 
                                <label className="border p-4 bg-white flex rounded-2xl gap-2 items-center ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                    </svg>

                                    <span>Free parking</span>
                                </label>}
                                {place?.perks.includes("tv") && 
                                <label className="border p-4 bg-white flex rounded-2xl gap-2 items-center ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z" />
                                    </svg>

                                    <span>Tv</span>
                                </label>}
                                {place?.perks.includes("radio") && 
                                <label className="border p-4 bg-white flex rounded-2xl gap-2 items-center ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5l16.5-4.125M12 6.75c-2.708 0-5.363.224-7.948.655C2.999 7.58 2.25 8.507 2.25 9.574v9.176A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169A48.329 48.329 0 0012 6.75zm-1.683 6.443l-.005.005-.006-.005.006-.005.005.005zm-.005 2.127l-.005-.006.005-.005.005.005-.005.005zm-2.116-.006l-.005.006-.006-.006.005-.005.006.005zm-.005-2.116l-.006-.005.006-.005.005.005-.005.005zM9.255 10.5v.008h-.008V10.5h.008zm3.249 1.88l-.007.004-.003-.007.006-.003.004.006zm-1.38 5.126l-.003-.006.006-.004.004.007-.006.003zm.007-6.501l-.003.006-.007-.003.004-.007.006.004zm1.37 5.129l-.007-.004.004-.006.006.003-.004.007zm.504-1.877h-.008v-.007h.008v.007zM9.255 18v.008h-.008V18h.008zm-3.246-1.87l-.007.004L6 16.127l.006-.003.004.006zm1.366-5.119l-.004-.006.006-.004.004.007-.006.003zM7.38 17.5l-.003.006-.007-.003.004-.007.006.004zm-1.376-5.116L6 12.38l.003-.007.007.004-.004.007zm-.5 1.873h-.008v-.007h.008v.007zM17.25 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zm0 4.5a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                    </svg>


                                    <span>Radio</span>
                                </label>}
                                {place?.perks.includes("pets") && 
                                <label className="border p-4 bg-white flex rounded-2xl gap-2 items-center ">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-6 h-6"><path d="M309.6 158.5L332.7 19.8C334.6 8.4 344.5 0 356.1 0c7.5 0 14.5 3.5 19 9.5L392 32h52.1c12.7 0 24.9 5.1 33.9 14.1L496 64h56c13.3 0 24 10.7 24 24v24c0 44.2-35.8 80-80 80H464 448 426.7l-5.1 30.5-112-64zM416 256.1L416 480c0 17.7-14.3 32-32 32H352c-17.7 0-32-14.3-32-32V364.8c-24 12.3-51.2 19.2-80 19.2s-56-6.9-80-19.2V480c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V249.8c-28.8-10.9-51.4-35.3-59.2-66.5L1 167.8c-4.3-17.1 6.1-34.5 23.3-38.8s34.5 6.1 38.8 23.3l3.9 15.5C70.5 182 83.3 192 98 192h30 16H303.8L416 256.1zM464 80a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z" /></svg>
                                    <span>Pets</span>
                                </label>}
                                {place?.perks.includes("entrance") && 
                                <label className="border p-4 bg-white flex rounded-2xl gap-2 items-center ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                    </svg>

                                    <span>Private entrance</span>
                                </label>}

                            </div>

                        </div>
                        <div>
                            <BookingWidgets place={place} />
                        </div>
                    </div>
                    <div className="bg-white -mx-8 px-8 py-8 border-t">
                        <div>
                            <h2 className="font-semibold text-2xl">Exta info</h2>
                        </div>
                        <div className="mb-4 mt-2 text-lg text-gray-700 leading-5" >{place.extraInfo}</div>
                    </div>

                </div>
            </CSSTransition>
        </>
    )
}