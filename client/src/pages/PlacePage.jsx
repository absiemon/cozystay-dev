import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountPage from "./AccountPage";
import Loading from "../loader";
import { CSSTransition } from 'react-transition-group';
import '../my-transition.css';

export default function PlacePage() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [flag, setFlag] = useState(false);
    const [addedPlaces, setAddedPlaces] = useState([]);

    // showing the added palces
    useEffect(() => {
        setIsOpen(true);
        setLoading(true);
        axios.get('/get-places').then((res) => {
            setLoading(false);
            setAddedPlaces(res.data);
        }).catch((err) => console.log(err))

    }, [flag])

    const markUnderRenovation = async (id) => {
        setLoading(true);
        await axios.post('/mark-under-renovation', { id }).then((res) => {
            setLoading(false);
            if (!flag) {
                setFlag(true);
            }
            else {
                setFlag(false);
            }
        }).catch((err) => console.log(err));
    }


    return (
        <>
            <Loading loading={loading} flag={true}/>
            <AccountPage />

            <CSSTransition in={isOpen} appear timeout={1000} classNames="my-transition" unmountOnExit>
                <div>
                    <div className="text-center">
                        <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                            </svg>
                            Add new place
                        </Link>
                    </div>
                    <div className="mt-4">

                        {addedPlaces?.length > 0 && addedPlaces.map((place) => {
                            return (
                                <div key={place._id} className="bg-gray-100 gap-4 p-4 mb-2 rounded-2xl flex">
                                    <div className="flex w-32 h-32 bg-gray-300 shrink-0">
                                        <div className="overflow-hidden">
                                            {place.photos.length > 0 && (
                                                <img className="object-cover" src={place?.photos[0]} alt="photo" />
                                            )}
                                        </div>

                                    </div>
                                    <div className="flex grow-0 shrink">
                                        <Link to={'/account/places/' + place._id} className="absolute bg-gray-300 flex py-1 px-2 rounded-2xl right-60">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                            Edit
                                        </Link>
                                        <button onClick={() => markUnderRenovation(place._id)} className="flex absolute right-12 rounded-2xl bg-gray-300 py-1 px-4" style={{ background: `${place.isUnderRenovation ? "#8B5CF6" : "white"}` }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                                            </svg>
                                            Under renovation
                                        </button>
                                        <div >
                                            <h2 className="text-xl ">{place.title}</h2>
                                            <p className="text-sm mt-2">{place.description}</p>

                                        </div>

                                    </div>


                                </div>
                            )

                        })}
                    </div>

                    {/* )} */}
                    {/* {action === 'new' && (
                <div className="px-4">
                    <PlaceForm flag={flag}/>
                </div>
            )} */}

                </div>
            </CSSTransition>

        </>
    )
}