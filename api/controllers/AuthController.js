const User = require("../models/User.js");
require('dotenv').config();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET_KEY
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilio = require('twilio')(accountSid, authToken);

//register login
module.exports.register = async(req, res) => {
    const { name, email, mobile, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, mobile, password: secPassword });
        res.status(200).json("Registration successfull");
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
                    delete user.password;
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
module.exports.sendOtp = async(req, res) => {
    const {mobileNo} = req.body;

    try {
        const GenOtp = Math.floor(100000 + Math.random() * 900000);

        twilio.messages.create({
            from: process.env.TWILIO_PHONE_NUMBER,
            to: mobileNo,
            body: `Your otp for renewing password of CozyStay App is ${GenOtp}. Expired in 5 minutes`
        }).then((data) =>{
            res.cookie('OTP', GenOtp, { maxAge: 300000 }).json(true);
        }).catch((err) =>{
            res.status(422).json(err);
        })

    } catch (error) {
        res.status(422).json(error);
    }
}

module.exports.renewPassword = async(req, res) => {
    const { OTP } = req.cookies;
    const { mobileNo, otp, newPassword} = req.body;

    try{
        if(otp === OTP){
            const salt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(newPassword, salt);
            await User.findOneAndUpdate({mobile: mobileNo}, {password: secPassword}, {new: true}).then((data) =>{
                res.clearCookie('OTP');
                res.status(200).json("Password changed successfully");
            }).catch((err)=>{
                res.status(422).json(err);
            })
        }
        else{
            res.status(400).json(null);
        }
    }
    catch (error) {
        res.status(422).json(error);
    }
}

module.exports.logout = async(req, res) => {
    try {
        res.cookie('token', '').json(true);
    } catch (error) {
        res.status(422).json(err);
    }
}