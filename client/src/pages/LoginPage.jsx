import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../loader";

export default function LoginPage() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useContext(UserContext)
    const [credentials, setCredentials] = useState({
        email: "", password: "", mobileNo: "", newPassword: "", otp: ""
    })
    const [isForgetPassword, setForgetPassword] = useState(false);
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const loginUser = async (e) => {
        e.preventDefault();
        const { email, password } = credentials;
        if (!email || !password) {
            toast.error("please provide valid input");
            return;
        }
        setLoading(true)
        await axios.post('/login', {
            email, password
        }).then((res) => {
            setUser(res.data);  //setting user data to context
            setLoading(false)
            navigate('/')
        }).catch((err) => {
            toast.error("Invalid credentials");
            setLoading(false)
            return;
        });

    }

    const sendOtp = async(e) => {
        e.preventDefault();
        const {mobileNo} = credentials;
        if (!mobileNo) {
            toast.error("please provide valid mobile number");
            return;
        }
        await axios.post('/get-otp', {mobileNo}).then((res)=>{
            toast.success("otp send successfully!");
        }).catch((err) => {
            toast.success("Cannot send otp please try again later!");
        })
    }

    const renewPassword = async(e)=>{
        e.preventDefault();
        const {mobileNo, otp, newPassword} = credentials;
        if (!mobileNo || !otp || !newPassword) {
            toast.error("please provide valid input");
            return;
        }
        await axios.post('/renew-password', {mobileNo, otp, newPassword}).then((res)=>{
            toast.success("password changed successfully wait a littile bit!");
            setTimeout(() => {
                setForgetPassword(false);
            }, 4000);
        }).catch((err) => {
            toast.success("Cannot set password please try again later!");
        })
    }
    return (
        <>
            <ToastContainer />
            <Loading loading={loading} />
            {!isForgetPassword ?
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
                                <Link to={'/register'} className="underline text-black font-semibold mx-1">Register now </Link>
                            </div>

                        </form>
                        <div className="text-center py-2 text-gray-500">
                            Forget password?
                            <button className=" px-3 bg-blue-100 text-black font-semibold rounded-xl mx-1" onClick={() => setForgetPassword(true)}> click</button>
                        </div>
                    </div>
                </div>
                :
                <div className="mt-4 grow flex items-center justify-around">
                    <div className=" mb-32">
                        <h1 className="text-4xl text-center mb-4">Forget Password</h1>
                        <form className="max-w-md mx-auto" >
                            <div className="flex">
                              <input type="text" name="mobileNo" placeholder={'+917334234543'} value={credentials.mobileNo} onChange={onChange}/>
                              <button className="primary mx-2" onClick={sendOtp}>Send otp</button>
                              
                            </div>
                            
                            <input type="password" name="newPassword" placeholder={'New password ( write carefully )'} value={credentials.newPassword} onChange={onChange}/> 

                            <input  type="text" name="otp" placeholder={'Otp'} value={credentials.otp} onChange={onChange}/>
                            <button className="primary" onClick={renewPassword}>Submit</button>

                        </form>
                        <div className="text-center py-2 text-gray-500">
                            Want to go back?
                            <button className=" px-3 bg-blue-100 text-black font-semibold rounded-xl mx-1" onClick={() => setForgetPassword(false)}> click</button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
} 