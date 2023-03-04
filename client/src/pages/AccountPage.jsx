
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../UserContext"
import axios from 'axios'
import { CSSTransition } from 'react-transition-group';
import '../my-transition.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../loader";

export default function AccountPage() {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user, ready, setUser } = useContext(UserContext);

    const { pathname } = useLocation();
    let subpage = pathname.split('/')?.[2];
    if (subpage === undefined) {
        subpage = 'profile';
    }
    useEffect(() => {
        setIsOpen(true);
    }, [])
    const [hovering, setHovering] = useState(false);
    const linkClasses = (type = null) => {  // making defalut type as null
        let classes = 'inline-flex gap-2 py-2 px-6 rounded-full';
        if (type === subpage) {
            classes += ' bg-primary text-white';
        }
        else {
            classes += ' bg-white '
        }
        return classes;
    }

    const logout = async () => {
        setLoading(true)
        await axios.post('/logout').then((res) => {
            setUser(null);
            setLoading(false)
            navigate('/');
        }).catch((err) => {
            setLoading(false)
            toast.error("cannot logged out! Please try again");
            return;
        })
    }

    const handleImageChange = async (e) => {
        e.preventDefault();
        const files = e.target.files;  // contains array of seleted files from the system.
        const data = new FormData();
        data.append('avatar', files[0]);
        setLoading(true)
        await axios.post('/update-profile', data, {
            headers: { "Content-Type": "multipart/form-data" },
        }).then((res) => {
            setUser((prev) => {
                return { ...prev, avatar: res.data[0] };
            })
            setLoading(false);
        }).catch(err => {
            setLoading(false)
            toast.error("cannot upload profile picture! Please try again");
            return;
        });
    }

    return (
        <>
            <ToastContainer />
            <Loading loading={loading} />
            <CSSTransition
                in={isOpen}
                appear
                timeout={1000}
                classNames="my-transition"
                unmountOnExit
            >
                <div>
                    <nav className="w-full flex justify-center mt-8 gap-2 mb-8">
                        <Link className={linkClasses('profile')} to={'/account'}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>

                            My Profile
                        </Link>
                        <Link className={linkClasses('bookings')} to={'/account/bookings'}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>

                            My bookings
                        </Link>
                        <Link className={linkClasses('places')} to={'/account/places'}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                            </svg>

                            My accomodation
                        </Link>
                    </nav>
                    {subpage === 'profile' && (
                        <div className="text-center max-w-lg mx-auto">
                            <div className="max-w-md mx-auto mt-10 bg-white rounded-lg overflow-hidden py-3">
                                {/* <label className=" w-32 h-32 flex cursor-pointer items-center justify-center bg-transparent rounded-2xl">
                            <input type="file" className="hidden" accept="image/*" />
                            <img src={'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_960_720.png'} alt={user?.name} className="rounded-full w-32 h-32 relative left-40 hover:bg-gray-700" />
    
                        </label> */}
                                <div
                                    className="relative flex justify-center w-32 left-40 "
                                    onMouseEnter={() => setHovering(true)}
                                    onMouseLeave={() => setHovering(false)}
                                >
                                    <img src={user?.avatar} alt="img" className="rounded-full w-32 h-32 " />
                                    {hovering && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50 rounded-full ">
                                            <label htmlFor="image" className="cursor-pointer text-gray-600 text-xl p-10 ">
                                                Edit
                                                <input
                                                    type="file"
                                                    id="image"
                                                    name="image"
                                                    className="hidden"
                                                    accept=".jpg,.jpeg,.png"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div className="text-center mt-5">
                                    <h1 className="text-lg font-bold">{user?.name}</h1>
                                    <p className="mt-2">{user?.email}</p>
                                    <p className="mt-1">{user?.mobile}</p>
                                </div>
                            </div>
                            <button onClick={logout} className="primary max-w-sm mt-3">Logout</button>
                        </div>
                    )}

                </div>
            </CSSTransition>
        </>
    )
}