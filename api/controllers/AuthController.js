const User = require("../models/User.js");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const jwt_secret = "$52isu23sdw2";
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");

//register login
module.exports.register = async(req, res) => {
    const { name, email, mobile, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, mobile, password: secPassword });
        res.status(200).json(user);
    }
    catch (err) {
        res.status(422).json(err);
    }
}

// login router
module.exports.login = async(req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {

            const passwordCompare = await bcrypt.compare(password, user.password);

            if (passwordCompare) {
                jwt.sign({ email: user.email, id: user._id, name: user.name, }, jwt_secret, {}, (err, token) => {
                    if (err) {
                        res.status(422).json(err);
                    }
                    return res.cookie('token', token).json(user);
                })

            }
            else {
                return res.status(400).json({ error: "Soory cannot login! please try loginin with correct credential" });
            }
        }
        else {
            return res.status(404).json({ error: "User not found" });
        }
    }
    catch (err) {
        res.status(422).json(err);
    }
}

module.exports.logout = async(req, res) => {
    try {
        res.cookie('token', '').json(true);
    } catch (error) {
        res.status(422).json(err);
    }
}