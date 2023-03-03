const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
    owner:{ type: mongoose.Schema.Types.ObjectId, ref:'User'},
    title: {type: String},
    nearby:{type: String}, 
    city: {type: String}, 
    state: {type: String}, 
    zipcode:{type: String},
    address:{type: String},
    photos : [
        { type: String},
    ],
    description:{type: String},
    perks: [
        {type: String}
    ],
    extraInfo: {type: String},
    bedrooms:{type: Number},
    maxGuests: {type: Number},
    price:{type: Number},
    isUnderRenovation: {type: Boolean, default: false},
    isBooked: {type: Boolean, default: false},
})

const PlaceModel = mongoose.model('Place', PlaceSchema);
module.exports = PlaceModel;