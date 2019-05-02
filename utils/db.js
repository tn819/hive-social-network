require("dotenv").config();
var spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");

var db = spicedPg(process.env.DATABASE_URL);

exports.addUser = (firstname, lastname, email, password) => {
    let q =
        "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING userid, firstname, lastname, email";
    let params = [firstname, lastname, email, password];
    return db.query(q, params);
};

exports.getUserByEmail = email => {
    let q = "SELECT * FROM users WHERE email = $1";
    let params = [email];
    return db.query(q, params);
};

exports.getUserById = id => {
    let q = "SELECT * FROM users WHERE userid = $1";
    let params = [id];
    return db.query(q, params);
};

exports.updateUserPic = (id, value) => {
    let q = "UPDATE users SET pic = $2 WHERE userid = $1 RETURNING *";
    let params = [id, value];
    return db.query(q, params);
};

exports.updateUserBio = (id, value) => {
    let q = "UPDATE users SET bio = $2 WHERE userid = $1 RETURNING *";
    let params = [id, value];
    return db.query(q, params);
};

exports.checkPassword = (
    textEnteredInLoginForm,
    hashedPasswordFromDatabase
) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(
            textEnteredInLoginForm,
            hashedPasswordFromDatabase,
            (err, doesMatch) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doesMatch);
                }
            }
        );
    });
};
