const User = require("../models/User.js");
const cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
const jwt_secret = "$52isu23sdw2";
const mongoose = require("mongoose");
const fs = require('fs');
const {uplaodToS3} = require('../s3Config.js');

module.exports.getProfile = async(req, res) => {
    const { token } = req.cookies;
    try{
        if (token) {
            jwt.verify(token, jwt_secret, {}, async (err, data) => {
                if (err) {
                    res.status(422).json(err);
                }
                await User.findById(data.id, { password: 0 }).then((user) => {
                    res.json(user);
                })
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

module.exports.updateProfile = async(req, res) => {
    try {
        const { token } = req.cookies;
        if (token) {
            jwt.verify(token, jwt_secret, {}, async (err, data) => {
                if (err) {
                    res.status(422).json(err);
                }
                const uplaodedFiles = [];

                const { path, originalname, mimetype } = req.files[0];
                const url = await uplaodToS3(path, originalname, mimetype);
                uplaodedFiles.push(url);

                await User.findByIdAndUpdate(data.id, {avatar: uplaodedFiles[0], isAvatar: true}, {new: true}).then((user) =>{
                  res.json(uplaodedFiles);
                }).catch(err =>{
                    res.json(err)
                });
            })
        }
        else {
            res.json(null);
        }
       
    } catch (err) {
        res.status(422).json(err);
    }
}
