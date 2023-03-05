const cookieParser = require('cookie-parser');
const download = require('image-downloader');
const Place = require("../models/Places.js");
var jwt = require('jsonwebtoken');
const jwt_secret = "$52isu23sdw2";
const mongoose = require("mongoose");
const fs = require('fs');
const {uplaodToS3} = require('../s3Config.js');
const mime = require('mime-types');

module.exports.uploadViaLink = async (req, res) => {
    const { link } = req.body;

    try {
        const newName = 'photo' + Date.now() + '.jpg';
        options = {
            url: link,
            dest: '/../tmp/' + newName,
        };

        await download.image(options)
            .then(async() => {
                const url = await uplaodToS3('/../tmp/' + newName, newName, mime.lookup('/../tmp/' + newName));
                res.json(url);
            })
            .catch((err) => console.error(err));
    }
    catch (err) {
        res.status(422).json(err);
    }

}

module.exports.uploadViaSystem = async (req, res) => {
    try {
        const uplaodedFiles = [];
        for (let i = 0; i < req.files.length; i++) {
            const { path, originalname, mimetype } = req.files[i];
            const url = await uplaodToS3(path, originalname, mimetype);
            uplaodedFiles.push(url);
        }
        res.json(uplaodedFiles);
    } catch (err) {
        res.status(422).json(err);
    }
}

module.exports.newPlace = async (req, res) => {
    const id1 = req.query.id;
    const { token } = req.cookies;
    const { title, nearby, city, state, zipcode, address, addPhotos, description,
        extraInfo, perks, bedrooms, guests, price } = req.body;
    try {
        if (token) {
            jwt.verify(token, jwt_secret, {}, async (err, userData) => {
                if (err) {
                    res.status(422).json(err);
                }
                else {
                    if (id1 === 'undefined') {
                        // new place
                        const placeDoc = await Place.create({
                            owner: userData.id,
                            title, nearby, city, state, zipcode, address,
                            photos: addPhotos,
                            description, perks,
                            extraInfo, bedrooms,
                            maxGuests: guests,
                            price,

                        })
                        res.json(placeDoc);
                    }
                    else {
                        // update place
                        const placeDoc1 = await Place.findByIdAndUpdate(id1, {
                            title, nearby, city, state, zipcode, address,
                            photos: addPhotos,
                            description, perks,
                            extraInfo, bedrooms,
                            maxGuests: guests,
                            price,
                        }, { new: true });

                        res.json(placeDoc1);
                    }
                }

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

module.exports.getPlaces = async (req, res) => {
    const { token } = req.cookies;
    try {
        if (token) {
            jwt.verify(token, jwt_secret, {}, async (err, userData) => {
                if (err) {
                    res.status(422).json(err);
                }
                const { id } = userData
                res.json(await Place.find({ owner: id }));
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

module.exports.getPlaceById = async (req, res) => {
    const { id } = req.params;
    try {
        res.json(await Place.findById(id));
    }
    catch (err) {
        res.status(422).json(err);
    }
}

module.exports.getAllPlaces = async (req, res) => {
    const { searchQuery } = req.params;
    try {

        if(searchQuery.length ==1 ){
            const places = await Place.find();
            res.json(places);
        }
        else{
            const places = await Place.find({state: searchQuery});
            res.json(places);
        }
    }
    catch (err) {
        res.status(422).json(err);
    }
}

module.exports.markUnderRenovation = async (req, res) => {
    const { id } = req.body;
    try {
        const place = await Place.findById(id);
        place.isUnderRenovation = !place.isUnderRenovation;
        await place.save().then(result => {
            res.json("update successfully");
        }).catch(err => {
            res.json(err);
        });
    }
    catch (err) {
        res.status(422).json(err);
    }
}