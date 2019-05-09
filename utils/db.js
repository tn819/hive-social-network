require("dotenv").config();
var spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");
const moment = require("moment");

var db = spicedPg(process.env.DATABASE_URL);

exports.addUser = (firstname, lastname, email, password) => {
    let q =
        "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING userid, firstname, lastname, email";
    let params = [firstname, lastname, email, password];
    return db.query(q, params);
};

exports.getUsersByIds = arrayOfIds => {
    let q = `SELECT id, first, last, pic FROM users WHERE id = ANY($1)`;
    return db.query(q, [arrayOfIds]);
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

exports.addFriendship = (requester, receiver) => {
    let q =
        "INSERT INTO friendships (requester, receiver) VALUES ($1, $2) RETURNING id, requester, receiver, accepted";
    let params = [requester, receiver];
    return db.query(q, params);
};

exports.getFriendship = (requester, receiver) => {
    let q =
        "SELECT * FROM friendships WHERE (requester = $1 AND receiver = $2) OR (requester = $2 AND receiver = $1)";
    let params = [requester, receiver];
    return db.query(q, params);
};

exports.getFriendships = id => {
    let q = `SELECT users.userid, firstname, lastname, pic, bio, accepted, requester, receiver
        FROM friendships JOIN users
        ON (receiver = $1 AND requester = users.userid)
        OR (requester = $1 AND receiver = users.userid)
    `;
    let params = [id];
    return db.query(q, params);
};

exports.updateFriendship = (requester, receiver, accepted) => {
    let q =
        "UPDATE friendships SET accepted = $3 WHERE (requester = $1 AND receiver = $2) OR (requester = $2 AND receiver = $1)";
    let params = [requester, receiver, accepted];
    return db.query(q, params);
};

exports.deleteFriendship = (requester, receiver) => {
    let q =
        "DELETE * FROM friendships WHERE (requester = $1 AND receiver = $2) OR (requester = $2 AND receiver = $1)";
    let params = [requester, receiver];
    return db.query(q, params);
};

exports.addMessage = (userid, comment) => {
    let q =
        "INSERT INTO messages (userid, comment) VALUES ($1, $2) RETURNING id, userid, comment, created_at";
    let params = [userid, comment];
    return db.query(q, params);
};

exports.getMessages = () => {
    return db.query(
        `SELECT firstname, lastname, pic, messages.id, messages.userid, comment, messages.created_at
        FROM messages JOIN users
        ON messages.userid = users.userid
        WHERE messages.receiver IS NULL
        ORDER BY messages.created_at
        LIMIT 100`
    );
};

exports.getFormattedMessages = messages => {
    return messages.map(
        ({
            firstname,
            lastname,
            pic,
            id: messageid,
            userid: id,
            comment,
            created_at
        }) => ({
            firstname: firstname,
            lastname: lastname,
            pic: pic,
            id: id,
            messageid: messageid,
            comment: comment,
            created_at: created_at,
            formatted_time: moment(created_at).format("dddd, MMMM Do YYYY")
        })
    );
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
