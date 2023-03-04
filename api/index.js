const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const router = require('./router/router');
const setupCronJob = require('./cron');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());    // for reading cookies
app.use('/uploads', express.static(__dirname + '/uploads')); // used to serve static files from the directory specified.
const allowedOrigins = ['http://127.0.0.1:5173','https://cozy-stay.vercel.app'];
const corsOptions = {
    credentials: true,
    origin: allowedOrigins,
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization, Cookie'
};

app.use(cors(corsOptions));

const port = process.env.PORT || 4000;

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
}).then(()=> {
    console.log('Connected to database')
}).catch(err=>{
    throw err;
})
setupCronJob();
app.use('/api', router);

app.listen(port);