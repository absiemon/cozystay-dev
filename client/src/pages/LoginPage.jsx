import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../loader";

export default function LoginPage() {

    const navigate = useNavigate();
    const[loading, setLoading] = useState(false);
    const {user, setUser} = useContext(UserContext)
    const [credentials, setCredentials] = useState({
        email:"", password:""
    })
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value }); 
    }

    const loginUser  = async(e)=>{
        e.preventDefault();
        const {email, password} = credentials;
        if(!email || !password){
            toast.error("please provide valid input");
            return;
        }
        setLoading(true)
        await axios.post('/login', {
            email, password
        }).then((res) =>{
            setUser(res.data);  //setting user data to context
            setLoading(false)
            navigate('/')
        }).catch((err) =>{
            toast.error("Invalid credentials");
            setLoading(false)
            return;
        });

    }
    return (
        <>
        <ToastContainer />
        <Loading loading={loading}/>
        <div className="mt-4 grow flex items-center justify-around">
            <div className=" mb-32">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={loginUser}>
                    <input type="email" name="email" placeholder={'Email'} value={credentials.email} onChange={onChange}>

                    </input>
                    <input type="password" name="password" placeholder={'Password'} value={credentials.password} onChange={onChange}>

                    </input>
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500"> 
                        Don't have an account yet? 
                        <Link to={'/register'} className="underline text-black">Register now </Link>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
} 