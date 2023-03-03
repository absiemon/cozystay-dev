import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import BookingWidgets from "../BookingWidgets";
import { useContext } from "react"
import { UserContext } from "../UserContext"
import { CSSTransition } from 'react-transition-group';
import '../my-transition.css';

export default function MyPlace() {
    const [isOpen, setIsOpen] = useState(false);
    const { id } = useParams();
    const [place, setPlace] = useState();
    const [showAllPhotos, setShowAllPhotos] = useState(false); // for pop-up
    const { user } = useContext(UserContext);
    
    useEffect(() => {
        setIsOpen(true);
        if (!id) {
            return;
        }
        axios.get('/place/' + id).then((res) => {
            setPlace(res?.data)
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
                    {/* <div className="grid gap-x-2 grid-cols-[2fr_1fr] rounded-3xl">
                    <div>
                        {place?.photos?.[0] && (
                            <div>
                                <img className="aspect-square object-cover" src={'http://localhost:4000/uploads/' + place?.photos[0]} alt="img" />
                            </div>

                        )}
                    </div>
                    <div className="grid">
                        {place.photos?.[1] && (
                            <img className="aspect-square object-cover" src={'http://localhost:4000/uploads/' + place?.photos[1]} alt="img" />
                        )}

                        <div className="overflow-hidden">
                            {place.photos?.[2] && (
                                <img className="aspect-square object-cover relative top-2" src={'http://localhost:4000/uploads/' + place?.photos[2]} alt="img" />
                            )}
                        </div>

                    </div>
                </div> */}
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

                    </div>
                    <div>
                        <BookingWidgets place={place} />
                    </div>
                </div>
                <div className="bg-white -mx-8 px-8 py-8 border-t">
                    <div>
                        <h2 className="font-semibold text-2xl">Exta info</h2>
                    </div>
                    <div className="mb-4 mt-2 text-sm text-gray-700 leading-5" >{place.extraInfo}</div>
                </div>

            </div>
        </CSSTransition>

    )
}