const path = require('path');

const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const expressLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require("express-session");
const dotEnv = require('dotenv');
const passport = require('passport');
const MongoStore = require("connect-mongo")(session);

const connectDB = require('./config/db');

//* Load Config
dotEnv.config({ path: "./config/config.env" });

//* Database connection
connectDB();

//* Passport Configuration
require("./config/passport");

const app = express();

//* View Engine
app.use(expressLayout);
app.set("view engine", "ejs");
app.set("layout", "./layouts/mainLayout");
app.set("views", "views");

//* BodyPaser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Fileupload
app.use(fileUpload());

//* Session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        unset: "destroy",
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);

//* Passport
app.use(passport.initialize());
app.use(passport.session());

//* Flash
app.use(flash()); //req.flash

//* Static Folder
app.use(express.static(path.join(__dirname, "public")));

//* Routes
app.use("/", require("./routes/home"));
app.use("/users", require("./routes/users"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/reserve", require("./routes/reserve"));

//* 404 Page
app.use(require("./controllers/errorController").get404);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
    console.log(
        `Server running on port ${PORT}`
    )
);
