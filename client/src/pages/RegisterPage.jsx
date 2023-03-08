import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../loader";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [credentials, setCredentials] = useState({
        name: "", email: "", mobile:"", password: ""
    })

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const registerUser = async (e) => {
        e.preventDefault();
        const { name, email, mobile, password } = credentials;
        if (!name || !email || !mobile || !password) {
            toast.error("please provide valid input");
            return;
        }
        setLoading(true)
        await axios.post('/register', {
            name, email, mobile, password
        }).then((res) => {
            setLoading(false);
            toast.success("registration successful! wait a little bit");
            setTimeout(() => {
                navigate('/login')
            }, 3000);
        }).catch((err) => {
            toast.error("cannot register! may be your email already registered");
            setLoading(false);
            return;
        });
    }
    return (
        <>
            <ToastContainer />
            <Loading loading={loading} />
            <div className="mt-4 grow flex items-center justify-around">
                <div className=" mb-32">
                    <h1 className="text-4xl text-center mb-4">Register</h1>
                    <form className="max-w-md mx-auto" onSubmit={registerUser}>
                        <input type="text" name="name" placeholder={'Name'} value={credentials.name} onChange={onChange}>

                        </input>
                        <input type="email" name="email" placeholder={'Email'} value={credentials.email} onChange={onChange}>

                        </input>
                        <input type="text" name="mobile" placeholder={'Mobile number'} value={credentials.mobile} onChange={onChange}>

                        </input>
                        <input type="password" name="password" placeholder={'Password'}
                            value={credentials.password} onChange={onChange}>
                        </input>
                        <button className="primary">Register</button>
                        <div className="text-center py-2 text-gray-500">
                            Already a member?
                            <Link to={'/login'} className="underline text-black font-semibold mx-1">Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>

    );
} 