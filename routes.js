const express = require("express");
const app = express();
const register = require("./utils/register");
const s3 = require("./utils/s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const db = require("./utils/db");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

const isLoggedIn = (req, res, next) => {
    if (req.session.userid) {
        return next();
    } else {
        res.redirect("403");
    }
};

//ROUTES
app.post("/register", (req, res) => {
    register
        .checkValidRegistration(
            req.body.firstname,
            req.body.lastname,
            req.body.email,
            req.body.password
        )
        .then(inputs => {
            console.log("registration inputs:", inputs);
            return db.addUser(
                inputs.firstname,
                inputs.lastname,
                inputs.email,
                inputs.password
            );
        })
        .then(result => {
            console.log("db registration inputs:", result);
            const { userid } = result.rows[0];
            Object.assign(req.session, { userid });
            res.json({ success: true });
        })
        .catch(err => {
            console.log("bad registration", err);
            res.json({ success: false });
        });
});

app.post("/login", (req, res) => {
    console.log("POST login route");
    db.getUserByEmail(req.body.email)
        .then(result => {
            console.log("initial get user", result.rows[0]);

            const {
                userid,
                email,
                firstname,
                lastname,
                pic,
                bio
            } = result.rows[0];
            Object.assign(req.session, {
                userid,
                email,
                firstname,
                lastname,
                pic,
                bio
            });
            console.log("initial login cookies", req.session);
            return db.checkPassword(req.body.password, result.rows[0].password);
        })
        .then(result => {
            console.log("successful login", result);
            if (result) {
                res.json({ success: true });
            }
            req.session = null;
            res.json({ success: false });
        })
        .catch(err => {
            console.log("bad login", err);
            req.session.userid = null;
            res.json({ success: false });
        });
});

app.post("/pic", isLoggedIn, uploader.single("file"), s3.upload, (req, res) => {
    console.log(process.env.s3Url);
    const url = process.env.s3Url + req.file.filename;
    db.updateUserPic(req.session.userid, url)
        .then(results => {
            const { rows } = results;
            console.log("update pic", rows);
            res.json(rows[0]);
        })
        .catch(err => {
            console.log(err);
            res.json({ success: false });
        });
});

app.post("/bio", isLoggedIn, (req, res) => {
    db.updateUserBio(req.session.userid, req.body.bio)
        .then(results => {
            const { rows } = results;
            console.log("update bio", rows);
            res.json(rows[0]);
        })
        .catch(err => {
            res.json({ success: false });
            console.log(err);
        });
});

app.get("/user", isLoggedIn, (req, res) => {
    console.log("get user route");
    db.getUserById(req.session.userid)
        .then(({ rows }) => {
            console.log("initial get user", rows);
            res.json(rows[0]);
        })
        .catch(err => {
            res.json({ success: false });
            console.log(err);
        });
});

app.get("/search/:fragment", isLoggedIn, (req, res) => {
    console.log("search", req.params.fragment);
    db.getUserByFragment(req.params.fragment)
        .then(({ rows }) => {
            console.log("search results", rows);
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get("/api/user/:id", isLoggedIn, (req, res) => {
    console.log("get non-logged in user route", req.params.id);
    db.getUserById(req.params.id)
        .then(({ rows }) => {
            if (rows[0].userid === req.session.userid) {
                res.json({ isLoggedInUser: true });
            } else {
                res.json(rows[0]);
            }
        })
        .catch(err => {
            res.json({ success: false });
            console.log(err);
        });
});

app.get("/friendship/:receiver", isLoggedIn, (req, res) => {
    console.log("friend request route", req.params);
    db.getFriendship(req.session.userid, req.params.receiver)
        .then(({ rows }) => {
            console.log(rows, "db response for friendship");
            res.json(rows[0]);
        })
        .catch(err => console.log(err));
});

app.post("/friendship/:id", isLoggedIn, (req, res) => {
    let { type } = req.body;
    console.log(req.body, req.params, "friendship adjustment");
    if (type === "accept") {
        db.updateFriendship(req.session.userid, req.params.id, true)
            .then(data => {
                console.log("accept friendship", data);
                res.json({
                    requestAccepted: true
                });
            })
            .catch(err => console.log(err));
    } else if (type === "add") {
        db.addFriendship(req.session.userid, req.params.id)
            .then(data => {
                console.log("add friendship", data);
                res.json({
                    requestSent: true,
                    requestSender: true
                });
            })
            .catch(err => console.log(err));
    } else if (type === "delete") {
        db.deleteFriendship(req.session.userid, req.params.id)
            .then(data => {
                console.log("delete friendship data", data);
                res.json({
                    requestSent: false,
                    requestAccepted: false,
                    requestSender: null
                });
            })
            .catch(err => console.log(err));
    }
});

app.get("/friendships", isLoggedIn, (req, res) => {
    console.log("in friendships route");
    db.getFriendships(req.session.userid)
        .then(({ rows }) => {
            console.log("gathering all friend", rows);
            res.json({
                id: req.session.userid,
                friends: rows
            });
        })
        .catch(err => console.log(err));
});

app.get("/welcome", (req, res) => {
    if (req.session.userid) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    console.log("logout route!", req.session);
    res.redirect("/");
});

app.get("*", (req, res) => {
    if (!req.session.userid) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

module.exports = app;
