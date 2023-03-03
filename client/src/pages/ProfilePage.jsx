import axios from "axios";
import { useContext } from "react"
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext"
import AccountPage from "./AccountPage";
import PlacePage from "./PlacePage";

export default function ProfilePage() {

    const navigate = useNavigate();
    const { user, ready, setUser } = useContext(UserContext);
    let { subpage } = useParams();
    console.log(subpage)
    if (subpage === undefined) {
        subpage = 'profile';
    }

    const logout = async () => {
        await axios.post('/logout').then((res) => {
            setUser(null);
            navigate('/');
        }).catch((err) => {
            console.log(err);
        })
    }

    if (!ready) {
        return 'Loading...';
    }
    if (ready && !user) {
        navigate('/login');
    }
    const user1 = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '123-456-7890',
        image: 'https://via.placeholder.com/150',
      };

    return (
        <div>
            <AccountPage />
            {subpage == 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user?.name} {user?.email} <br />
                    <button onClick={logout} className="primary max-w-sm mt-3">Logout</button>
                    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg overflow-hidden">
                        <div className="flex justify-center">
                            <img src={user1.image} alt="img" className="rounded-full w-32 h-32" />
                        </div>
                        <div className="text-center mt-5">
                            <h1 className="text-lg font-bold">{user1.name}</h1>
                            <p className="mt-2">{user1.email}</p>
                            <p className="mt-1">{user1.phone}</p>
                        </div>
                    </div>
                </div>
            )}
            {subpage === 'places' && (
                <PlacePage />
            )}
        </div>
    )
}