const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    placeId:{type: mongoose.Schema.Types.ObjectId, required: true, ref:'Place'},
    user:{type: mongoose.Schema.Types.ObjectId, ref:'User', required: true}, // who has booked this place
    checkIn:{type:Date, require:true},
    checkOut:{type:Date, require:true},
    numberOfGuests:{type:Number, require:true},
    name:{type:String, required:true},
    mobile:{type:String, required:true},
    bookingPrice:{type:String},

})

const BookingModel = mongoose.model('Booking', BookingSchema);
module.exports = BookingModel;