const express = require('express');
const mongoose = require("mongoose");
const morgan = require('morgan');
const bodyParser = require("body-parser");
const ImageData = require("./models/ImageDataModel");
const cors = require("cors");
require("dotenv").config();

// Server Code
// Setup Express Server
var app = express();
var port = process.env.PORT || 3000;

// Middlwares
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
    res.send('JARVIS Online')
})

app.get("/data", async (req, res) => {
    // Leaving the Post.find() method empty
    // means we want to return the entire collection of data
    try {
        const posts = await ImageData.find();
        res.json(posts);
    } catch (err) {
        res.json({ message: err });
    }
});

