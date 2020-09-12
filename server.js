const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const mongoose = require("mongoose");
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require("body-parser");
const ImageData = require("./models/ImageDataModel");
const cors = require("cors");
require("dotenv").config();

// Server Code
// Setup Express Server
var app = express();
var port = process.env.PORT || 3000;

// Middlwares
app.use(helmet());
app.use(bodyParser.json());
app.use(morgan(':method :url :status'));
app.use(cors());


// Connect to database
(async () => {
    await mongoose
        .connect(`${process.env.DB_CONNECTION}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        })
        .then(() => {
            console.log("Database is online!!");
        })
        .catch((err) => {
            console.log("Connection failed!" + err.message);
        });
})();

// Boot up this ole bad boi
app.listen(port, () => {
    console.log("Server listening on port " + port);
});

// GET routes
app.get('/', (req, res) => {
    res.send('JARVIS Online and Ready')
})

app.get('/Jarvisyouthere', (req, res) => {
    res.send('For you sir, always.');
})

app.get("/data", async (req, res) => {
    // Leaving the Post.find() method empty
    // means we want to return the entire collection of data
    try {
        const images = await ImageData.find();
        res.json(images);
    } catch (err) {
        res.json({ message: err });
    }
});

const jwtCheck = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-8ff1npvg.au.auth0.com/.well-known/jwks.json'
    }),

    // Validate the audience and the issuer.
    audience: 'https://instagramScrapAPI/',
    issuer: 'https://dev-8ff1npvg.au.auth0.com/',
    algorithms: ['RS256']
});

app.use(jwtCheck);

// POST routes
app.post("/postdata", async (req, res) => {
    console.log("I got a request");
    // Array of data that needs to be inserted to MongoDB
    const data = req.body;

    ImageData.insertMany(data)
        .then((result) => {
            console.log("result ", result);
            res.status(200).json({ success: "new documents added!", data: result });
        })
        .catch((err) => {
            console.error("error ", err);
            res.status(400).json({ err });
        });
});