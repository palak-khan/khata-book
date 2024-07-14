// packages imports
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const flash = require("connect-flash");
const expressSession = require("express-session");

// dotenv configuration
const dotenv = require("dotenv");
require("dotenv").config();

// Database configuration & models
const db = require('./config/mongoose-connection');

// Routes
const indexRouter = require('./routes/index-router');
const hisaabRouter = require('./routes/hisaab-router');

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cookieParser());
app.use(flash());

app.use('/', indexRouter);
app.use('/hisaab', hisaabRouter);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
