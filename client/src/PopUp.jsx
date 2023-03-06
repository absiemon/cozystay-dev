import React, { useState } from 'react';
import axios from 'axios';

export default function PopUp({ bookingId, popUp, setPopUp, placeId, cancel, setCancel }) {
    const [loading, setLoading] = useState(false);
    const [reasons, setReasons] = useState({
        'Booked somewhere else': false,
        'Changed my mind': false,
        'Due to health problem': false,
        'Other reason': false,
    });

    const handleChange = (event) => {
        setReasons({ ...reasons, [event.target.name]: event.target.checked });
    };

    const cancelBooking = async () => {
        const selectedReasons = Object.keys(reasons).filter((reason) => reasons[reason]);
        setLoading(true);
        await axios.post('/cancel-booking', { bookingId, placeId }).then((res) => {
            setLoading(false);
            setPopUp(false);
            if (!cancel) {
                setCancel(true);
            }
            else {
                setCancel(false);
            }

        }).catch(err => {
            console.log(err);
        })
    };

    return (
        <>
            {popUp && (
                <>
                    {/* <Loading loading={loading} /> */}
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                            <div
                                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="modal-headline"
                            >
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div
                                            className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 cursor-pointer"
                                            role="button"
                                            onClick={() => setPopUp(false)}
                                        >
                                            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <h3
                                                className="text-lg leading-6 font-medium text-gray-900"
                                                id="modal-headline"
                                            >
                                                Cancel Booking
                                            </h3>
                                            <div className="mt-2">
                                                <div className="space-y-4">
                                                    {Object.keys(reasons).map((reason) => (
                                                        <div className="flex items-center" key={reason}>
                                                            <input
                                                                id={reason}
                                                                name={reason}
                                                                type="checkbox"
                                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                                checked={reasons[reason]}
                                                                onChange={handleChange}
                                                            />
                                                            <label
                                                                htmlFor={reason}
                                                                className="ml-3 block text-sm font-medium text-gray-700"
                                                            >
                                                                {reason}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <button className=" bg-primary text-white flex py-1 px-5 rounded-2xl right-20 mt-5 gap-1" onClick={cancelBooking}>
                                                {!loading ? 'Submit' : 'Submitting...'}
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}