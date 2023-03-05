import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import Loading from "../loader.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSSTransition } from 'react-transition-group';
import '../my-transition.css';

export default function IndexPage() {
  const { searchQuery, setSearchQuery } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsOpen(true);
    setLoading(true);
    axios.get('/all-places/' + searchQuery).then((res) => {
      const { data } = res;
      const newData = data.filter(obj => {
        return !obj.isUnderRenovation && !obj.isBooked;
      })
      setPlaces(newData);
      setLoading(false);
    })

  }, [searchQuery]);

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
        <div className="mt-8 gap-x-6 gap-y-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {places.length > 0 && places.map((place) => {
            return (
              <Link to={'/place/' + place._id} key={place._id}>
                <div className="bg-gray-500 mb-2 rounded-2xl flex ">
                  {place.photos.length > 0 && (
                    <img className="h-full w-full rounded-2xl object-cover aspect-square" src={place.photos?.[0]} alt="img"></img>
                  )}
                </div>

                <h2 className="font-bold">{place.address}</h2>
                <h3 className="text-sm text-gray-500">{place.title}</h3>
                <div className="mt-2">
                  <span className="font-bold">₹{place.price} night</span>
                </div>
              </Link>
            )
          })}

        </div></CSSTransition>

    </>
  );
}