DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS friendships;

CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    pic VARCHAR(255),
    bio VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE friendships (
    id SERIAL PRIMARY KEY NOT NULL,
    requester SERIAL NOT NULL references users(userid) ON DELETE CASCADE,
    receiver SERIAL NOT NULL references users(userid) ON DELETE CASCADE,
    accepted BOOLEAN NOT NULL default 'false'
);
