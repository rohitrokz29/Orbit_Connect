CREATE TABLE users (
    id VARCHAR(60) PRIMARY KEY,
    email VARCHAR(50) UNIQUE,
    name VARCHAR(30),
    username VARCHAR(20) UNIQUE,
    description VARCHAR(100),
    password VARCHAR(400)
);
ALTER TABLE users ADD COLUMN profileImg INT DEFAULT 3;


CREATE TABLE forgot_password(
    token_id VARCHAR(20) PRIMARY KEY,
    token VARCHAR(500)   
);

CREATE TABLE friends(
    user1 VARCHAR(20),
    user2 VARCHAR(20)
);

CREATE TABLE socket_ids(
    username VARCHAR(20) UNIQUE PRIMARY KEY,
    socket_id VARCHAR(30)  
);

CREATE TABLE pending(
    sender VARCHAR(20),
    reciever VARCHAR(20),
    message VARCHAR(500),
    timeStamp VARCHAR(25)
);