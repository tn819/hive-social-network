const express = require("express");
const app = (module.exports = express());

//utilities
const path = require("path");
const dotenv = require("dotenv");
const favicon = require("express-favicon");
dotenv.config();

const compression = require("compression");

app.use(compression());
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(favicon(path.join(__dirname + "/../public/favicon.ico")));

//directory work
app.use(express.static(path.join(__dirname, "/../public")));
app.use(express.static(path.join(__dirname, "/../utils")));

//headers and cookies middleware
const csurf = require("csurf");
const cookieSession = require("cookie-session");
app.use(
    cookieSession({
        maxAge: 1000 * 60 * 60 * 24 * 14,
        secret: process.env.secret
    })
);
app.use(csurf());
app.use((req, res, next) => {
    res.set("x-frame-options", "DENY");
    res.locals.csrfToken = req.csrfToken();
    next();
});
