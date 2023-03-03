const {getProfile, updateProfile}  = require('../controllers/ProfileController');
const {register, login, logout} = require('../controllers/AuthController');
const {uploadViaLink, uploadViaSystem, newPlace, getPlaces,getPlaceById, getAllPlaces, markUnderRenovation} = require('../controllers/PlaceController')
const {bookPlace, getBookings, cancelBooking} = require('../controllers/BookingController')
const router = require('express').Router();
const multer = require('multer');

const upload = multer({ dest: '/tmp' });

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', getProfile);
router.post('/update-profile', upload.array('avatar', 100), updateProfile);

router.post('/upload-by-link', uploadViaLink);
router.post('/uploads', upload.array('photos', 100), uploadViaSystem);
router.post('/new-place', newPlace);
router.get('/get-places', getPlaces);
router.get('/place/:id', getPlaceById);
router.get('/all-places', getAllPlaces);
router.post('/mark-under-renovation', markUnderRenovation);

router.post('/booking', bookPlace);
router.get('/get-bookings', getBookings);
router.post('/cancel-booking', cancelBooking);

module.exports = router;