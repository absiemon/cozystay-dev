const Place = require("../models/Places.js");
const Booking = require("../models/Bookings.js");
var jwt = require('jsonwebtoken');
const jwt_secret = "$52isu23sdw2";
const mongoose = require("mongoose");
const { resolve } = require("path");
const { rejects } = require("assert");

module.exports.bookPlace = async(req, res)=>{
    const { placeId, checkIn, checkOut, numberOfGuests, name, mobile, bookingPrice } = req.body;
    const { token } = req.cookies;
    try{
        if (token) {
            jwt.verify(token, jwt_secret, {}, async (err, userData) => {
                if (err) {
                    res.status(422).json(err);
                }
                const { id } = userData;
                const data = await Booking.create({
                    placeId,
                    user: id,
                    checkIn, checkOut,
                    numberOfGuests, name,
                    mobile, bookingPrice
                })
                await Place.findByIdAndUpdate(placeId, { isBooked: true }, { new: true });
                res.json(data);
            })
        }
        else {
            res.json(null);
        }
    }
    catch (err) {
        res.status(422).json(err);
    }
    
}

const getUserDataFromToken = (token) => {
    return new Promise((resolve, rejects) => {
        jwt.verify(token, jwt_secret, {}, async (err, userData) => {
            if (err) {
                rejects('Error occurred while verifying user');
            }
            resolve(userData);
        })
    })
}

module.exports.getBookings = async(req, res)=>{
    const { token } = req.cookies;

    try{
        await getUserDataFromToken(token).then(async (userData) => {
            const userId = userData.id;
            res.json(await Booking.find({ user: userId }).populate('placeId'));
        }).catch(err => {
            res.json(err);
        });
    }catch (err) {
        res.status(422).json(err);
    }
    
}

module.exports.cancelBooking = async(req, res)=>{
    const { token } = req.cookies;
    const { bookingId, placeId } = req.body;
    try{
        await getUserDataFromToken(token).then(async (userData) => {
            await Booking.deleteOne({ _id: bookingId }).then(async (data) => {
                await Place.findByIdAndUpdate({ _id: placeId }, { isBooked: false }, { new: true });
                res.json({ msg: "deleted successfully", data });
            })
        }).catch(err => {
            res.json(err);
        });
    }
    catch (err) {
        res.status(422).json(err);
    }
}