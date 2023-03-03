import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Perks from "./Perks";
import AccountPage from "./pages/AccountPage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "./loader";

export default function PlaceForm({ flag }) {

    const[loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams(); // for add new palce id will be null and for editing place it will be some id.
    const [fields, setFields] = useState({
        title: "", nearby:"", city:"", state:"", zipcode:"", photoLink: "", description: "", extraInfo: "", bedrooms: "", guests: "", price: ""
    })

    const [addPhotos, setAddPhotos] = useState([]);
    const [perks, setPerks] = useState([]);

    const onChange = (e) => {
        setFields({ ...fields, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        if (!id) {
            return;
        }
        setLoading(true)
        axios.get('/place/' + id).then((res) => {
            const { data } = res;
            setFields({
                title: data.title,
                nearby:data.nearby, 
                city: data.city, 
                state: data.state, 
                zipcode:data.zipcode,
                address: data.address,
                description: data.description,
                extraInfo: data.extraInfo,
                bedrooms: data.bedrooms,
                guests: data.maxGuests,
                price: data.price,
            });
            setLoading(false)
            setAddPhotos(data.photos);
            setPerks(data.perks);
        })
    }, [id])

    const addPhotoUsingLink = async (e) => {
        //api call
        e.preventDefault();
        const { photoLink } = fields;
        setLoading(true)
        await axios.post('/upload-by-link', {
            link: photoLink
        }).then((res) => {
            // set the uploaded photo in addPhotos array
            const data = res.data;
            setAddPhotos((prev) => {
                return [...prev, data];
            })
            // after uploading photo set photo input to empty
            setLoading(false)
            setFields({ ...fields, photoLink: '' });

        }).catch((err) => {
            toast.error("Can not uplaod due to internal server error");
            setLoading(false)
            return;
        })

    }

    const uploadFromDevice = async (e) => {
        e.preventDefault();
        const files = e.target.files;  // contains array of seleted files from the system.
        const data = new FormData(); // using formdata it would be easy to transfer files.
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        setLoading(true)
        await axios.post('/uploads', data, {
        }).then((response) => {
            const { data } = response;
            setLoading(false)
            setAddPhotos((prev) => {
                return [...prev, ...data];
            })
        })

    }

    const savePlace = async (e) => {
        e.preventDefault();
        const { title, nearby, city, state, zipcode ,description,
            extraInfo, bedrooms, guests, price } = fields;
        
        const address = nearby+ " " + city +" " + state;
        const data = {
            title, nearby, city, state, zipcode ,address, addPhotos, description,
            extraInfo, perks, bedrooms, guests, price
        };

        if(!title || !nearby || !city || !state || !zipcode || !description || !extraInfo || !bedrooms || !guests || !price){
            toast.warn("all input should be filled");
            return;
        }
        if(addPhotos.length <3){
            toast.warn("minimum 3 photos needed");
            return;
        }
        else{
            setLoading(true)
            await axios.post(`/new-place?id=${id}`, data).then((response) => {
                flag = true;
                setLoading(false)
                navigate('/account/places');
                window.location.reload();
            }).catch((error) =>{
                toast.error("Can not create place due to internal server error");
                setLoading(false)
                return;
            });
        }

    }

    const deletePhoto = (filename) => {
        const newArr = addPhotos.filter(photo => photo !== filename);
        setAddPhotos(newArr);
    }

    return (
        <>  
            <ToastContainer />
            <Loading loading={loading}/>
            <AccountPage />
            <div className="px-4">
                <form onSubmit={savePlace}>
                    <h2 className="text-xl mt-4 font-semibold">Title</h2>
                    <input type="text" name="title" value={fields.title} onChange={onChange} placeholder="My lovely place" />
                    <h2 className="text-xl mt-4 font-semibold">Address</h2>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="text" name="nearby" value={fields.nearby} onChange={onChange} placeholder="Nearby location" />
                        <input type="text" name="city" value={fields.city} onChange={onChange} placeholder="City" />
                        <input type="text" name="state" value={fields.state} onChange={onChange} placeholder="State" />

                        <input type="text" name="zipcode" value={fields.zipcode} onChange={onChange} placeholder="zipcode" />
                    </div>
                    <h2 className="text-xl mt-4 font-semibold">Photos<span className="text-gray-600 text-lg mx-1">(minimum 3)</span></h2>
                    <div className="flex gap-3">
                        <input type="text" name="photoLink" value={fields.photoLink} onChange={onChange} placeholder="Add using link.." />
                        <button className="bg-white px-4 rounded-2xl" onClick={addPhotoUsingLink}>Add&nbsp;photo</button>
                    </div>
                    <div className=" mt-3 gap-2 grid grid-cols-3 md:grid-cols-4 lg:grid-col-6">
                        {addPhotos.length > 0 && addPhotos.map((link) => {
                            return (
                                <div className="h-32 flex relative" key={link}>
                                    <img className="rounded-2xl w-full object-cover" src={link} alt="img"></img>

                                    <button className="absolute bottom-1 right-1 text-white bg-black p-1 bg-opacity-50 rounded-xl" onClick={() => deletePhoto(link)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>

                                    </button>
                                </div>
                            )
                        })}
                        <label className="h-32 flex cursor-pointer items-center justify-center border bg-white rounded-2xl p-2 text-2xl text-gray-600 gap-3">
                            <input type="file" className="hidden" accept="image/*" onChange={uploadFromDevice} multiple />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 00021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            Upload
                        </label>
                    </div>
                    <h2 className="text-xl mt-4 font-semibold">Description</h2>
                    <textarea name="description" value={fields.description} onChange={onChange} />
                    <h2 className="text-xl mt-4 font-semibold">Perks</h2>
                    <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                        <Perks selected={perks} onChange={setPerks} />
                    </div>
                    <h2 className="text-xl mt-4 font-semibold">Extra info</h2>
                    <textarea name="extraInfo" value={fields.extraInfo} onChange={onChange} />
                    <h2 className="text-xl mt-4 font-semibold">Other info</h2>
                    <div className="grid gap-2 grid-cols-2 md:grid-cols-3">
                        <div>
                            <h3 className="mt-2 -mb-1 ">No of bedrooms</h3>
                            <input type="number" name="bedrooms" value={fields.bedrooms} onChange={onChange}  />
                        </div>
                        
                        <div>
                            <h3 className="mt-2 -mb-1 " >Max guests</h3>
                            <input type="number" name="guests" value={fields.guests} onChange={onChange} />
                        </div>
                        <div>
                            <h3 className="mt-2 -mb-1 " >Price</h3>
                            <input type="number" name="price" value={fields.price} onChange={onChange} />
                        </div>
                    </div>
                    <button className="primary my-4">Save</button>
                </form>
            </div>
        </>
    )
}