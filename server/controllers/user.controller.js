const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validate } = require("email-validator");
const { CreateToken } = require("../middleware/token");
const { database } = require("../database/database");
const { ForgotPasswordMail } = require("../middleware/mailer");



const cookieOptions = {
    httpOnly: true,
    // secure: true,
    // sameSite: "None",
    // secure: process.env.NODE_ENV === 'production',
    maxAge: 2592000000,
};

const Signup = async (req, res) => {

    const { name, email, password, username, gender, dob } = req.body;
    try {
        console.log({ name, email, password, username });

        console.log(validate(email));
        if (!validate(email)) {
            return res.status(400).json({ message: "Use a valid email" });
        }
        if (!password || !name) {
            return res.status(400).json({ message: "Invalid Information" });
        }
        database.query(`SELECT COUNT(username) FROM users WHERE username='${username}';`, (err, usernameResult) => {
            if (err || +usernameResult[0]["COUNT(username)"] !== 0) {
                return res.status(401).json({ message: 'Username Already exist' });
            }
            bcrypt.hash(password, +process.env.BCRYPT_SALT_ROUNDS, (err, hash) => {
                if (err) throw Error(err);
                const id = nanoid(50);
                database.query(
                    "INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?,?);",
                    [id, email, name, username, "Hey, I am using Orbit Cnnect", hash, Math.floor(Math.random() * 10) + 1, gender, dob, 0],
                    (err, result) => {
                        console.log(err);
                        console.log(result);
                        if (err) {
                            res.status(401).json({ message: "Email Already Exist" });
                            return;
                        }
                        if (result?.affectedRows !== 1) {
                            res.status(500).json({ message: "Server Error" });
                            return;
                        }
                        const token = CreateToken({ id, type: 'signin' });
                        console.log(token);
                        res
                            .cookie("accessToken", token.accessToken, cookieOptions)
                            .cookie('userID', id, cookieOptions)
                            .status(200)
                            .json({ userID: id, created: true });
                    }
                );
            });

        })
    } catch (error) {
        console.log(error);
        return res.json({ message: error.message });
    }
}

const Signin = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log({ username, password });
        if (!username && !password) {
            return res.status(400).json({ message: "Invalid Details" });
        }
        database.query(
            `SELECT name,username,id,password FROM users WHERE username="${username}";`,
            async (error, result) => {
                // console.log(result);
                if (error || result.length === 0) {
                    return res
                        .status(404)
                        .json({ message: "You have Not signed up yet!" });
                }
                console.log(result);
                let status = await bcrypt.compare(password, result[0]?.password);
                console.log(status);
                if (!status) {
                    res.status(400).json({ message: "Wrong Password" });
                    return;
                }
                const token = CreateToken({ id: result[0].id, type: 'signin' });
                console.log(token);
                res
                    .cookie("accessToken", token.accessToken, cookieOptions)
                    .cookie('userID', result[0].id, cookieOptions)
                    .status(200)
                    .json({ id: result[0].id, name: result[0].name, username: result[0].username, });
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
}

const Signout = async (req, res) => {
    try {
        return res
            .clearCookie("accessToken")
            .clearCookie("userID")
            .status(200)
            .json({ message: "Successfully Logged Out" });
    } catch (error) {
        return res.status(400).json({ message: "Logout Failed" });
    }
}

const ForgotPassword = async (req, res) => {
    try {
        console.log(req.body.email);
        const { username } = req.body;
        database.query(
            `SELECT email,id FROM users WHERE username='${username}';`,
            async (error, usernameResult) => {
                if (error || usernameResult.length === 0) {
                    return res.status(404).json({ message: "Email Not Found" });
                }
                const token_id = nanoid(20);
                const { accessToken } = CreateToken({ id: usernameResult[0].id, type: 'reset' });

                database.query(
                    "INSERT INTO forgot_password VALUES (?,?);",
                    [accessToken, token_id],
                    async (error, result) => {
                        console.log({ error, result });
                        if (error || result?.affectedRows !== 1) {
                            res.status(400).json({ message: "Server Error" });
                            return;
                        }
                        const emailStatus = await ForgotPasswordMail({ token_id, email: usernameResult[0].email });
                        if (emailStatus) {
                            res.status(200).json({ message: "Check Your registered email!" });
                            return;
                        }
                        res.status(400).json({ message: "Try later!" });
                        return;
                    })

            });
    } catch (error) {
        res.status(400).json({ message: "Try later!" });
    }
}

const ResetPassword = async (req, res) => {
    try {
        const token_id = req.params.id;
        database.query(
            `SELECT token,token_id FROM forgot_password WHERE token_id='${token_id}';`,
            async (error, tokenResult) => {
                if (error || tokenResult.length === 0) {
                    res.status(400).json({ message: "You have exceeded time limit!" });
                    return;
                }
                const { id } = jwt.verify(tokenResult[0].token, process.env.JWT_ACCESS_TOKEN_SECRET);
                bcrypt.hash(req.body.password, +process.env.BCRYPT_SALT_ROUNDS, (err, hash) => {
                    database.query(
                        `UPDATE users SET password='${hash}' WHERE id='${id}'`,
                        async (error, result) => {
                            console.log(result);
                            if (error || result.changedRows !== 1) {
                                res.status(404).json({ message: "Server error." });
                                return;
                            }
                            database.query(
                                `DELETE FROM forgot_password WHERE token_id='${token_id}'`,
                                async (err, result) => {
                                    console.log(result);
                                    if (err || result.affectedRows !== 1) {
                                        res.status(400).json({ message: "Server Error" });
                                        return;
                                    }
                                    res.status(200).json({ message: "Password successfully changed!" });
                                    return;
                                }
                            )
                        }
                    )
                })
            });
    } catch (error) {
        res.status(404).json({ message: "Server error." });
    }
}

const SendFriendRequest = async (req, res) => {
    try {
        const { sender, reciever } = req.body;
        database.query('INSERT INTO request VALUES(?,?);', [sender, reciever],
            (err, result) => {
                console.log({ err, result });
                if (err || result.affectedRows === 0) {
                    res.status(404).json({ message: "Not Found" });
                    return;
                }
                res.status(200).json({ message: "Request Sent" });
            }
        )
    } catch (error) {
        res.status(404).json({ message: "Not Found" });
    }
}

const GetRequests = async (req, res) => {
    try {
        const { username } = req.params;
        database.query('SELECT sender FROM request WHERE reciever=?;', [username],
            (err, result) => {
                if (err) {
                    res.status(400).json({ message: "Not Found" });
                    return;
                }
                res.status(200).json(result);
            }
        )
    } catch (error) {
        res.status(400).json({ message: "Not Found" });
    }
}

const AddFriend = async (req, res) => {
    try {
        const { user1, user2 } = req.body;
        database.query(
            `SELECT COUNT(user1) FROM friends WHERE (user1 = '${user1}' AND user2 = '${user2}' )OR ( user1 = '${user2}' AND user2 = '${user1}');`,
            (err, countResult) => {
                if (err) {
                    console.log(err);
                    res.status(401).json({ message: "Server Error" });
                    return;
                }
                if (countResult[0]['COUNT(user1)'] !== 0) {
                    res.status(201).json({ message: "Alreadyy friend" })
                    return;
                }
                database.query(
                    `INSERT INTO friends VALUES ('${user1}','${user2}');DELETE FROM request WHERE sender ='${user2}' AND reciever='${user1}';`,

                    (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(401).json({ message: "Server Error" });
                            return;
                        }
                        if (result[0]?.affectedRows !== 1) {
                            console.log(result);
                            res.status(200).json({ message: "Server Error" });
                            return;
                        }
                        res.status(200).json({ message: "Added" });

                    }
                )
            }
        )

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

/**
 * 
 * @param { SEE THIS HOW TO REDUCE THE FETCH TIME USING JOINING THE TABLES TO FIND FRIENDS}  
 * @returns 
 */
const FetchFriends = async (req, res) => {
    try {
        const { username } = req.params;
        console.log({ username });
        let friends = [];
        database.query(
            ` SELECT * from friends WHERE user1='${username}' OR user2='${username}';`,
            async (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(201).json({ message: "Server Error" })
                    return;
                }
                result = result.map(({ user1, user2 }) => {
                    return `'${user1 === username ? user2 : user1}'`
                })
                database.query(
                    `SELECT name ,username,profileImg FROM users WHERE username IN (${result.toString()});`,
                    (err, userResult) => {
                        if (err) {
                            res.status(201).json({ message: "Server Error" });
                            return;
                        }
                        res.status(200).json(userResult);
                    }

                )

            }
        )
    } catch (error) {
        return res.status(500).json({ message: "Server Error" });

    }
}

const DeleteFriend = async (req, res) => {
    try {
        const { user, friend } = req.body;
        database.query(
            `DELETE FROM friends WHERE (user1 = '${user}' AND user2='${friend}') OR(user1='${friend}' AND user2='${user}');`,
            (err, result) => {
                if (err) {
                    res.status(404).json({ message: "Not Found" });
                    return;
                }
                res.status(200).json({ removed: true });
            }
        )
    } catch (error) {
        res.status(500).json({ message: "Error" });
    }
}

const FetchPendingMessages = async (req, res) => {
    try {
        const { username } = req.params;
        database.query(
            `SELECT sender,message,timeStamp FROM pending WHERE reciever=? ;`,
            [username],
            (err, messages) => {
                if (err) {
                    res.status(400).json({ message: "Server Error" });
                    return;
                }
                database.query(
                    'DELETE FROM pending WHERE reciever=?;', [username],
                    (err, result) => {
                        if (err) {
                            res.status(400).json({ message: "Server Error" });
                            return;
                        }
                        res.status(200).json(messages);
                    }
                )
                console.log(messages);

            }
        )
    } catch (error) {
        res.status(400).json({ message: "Server Error" });
    }
}

const Search = async (req, res) => {
    try {
        const { searchParam, username } = req.params;

        database.query(
            `SELECT username,name,profileImg FROM users WHERE username LIKE '%${searchParam}%' OR name LIKE '%${searchParam}%' ;
            SELECT DISTINCT id, username,post_data,timestamp,likes,dislikes FROM posts INNER JOIN friends ON (posts.username='${username}' OR (posts.username = friends.user1 AND friends.user2 = '${username}')OR ( posts.username = friends.user2 AND friends.user1 = '${username}')) WHERE username LIKE '%${searchParam}%' ORDER BY timestamp DESC;`,
            async (err, result) => {
                console.log({ err, result });
                if (err) {
                    res.status(404).json({ message: 'Not Found' })
                    return;
                }

                res.status(200).json({ users: result[0], posts: result[1] });

            }
        )

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

const UserProfile = async (req, res) => {
    try {
        const { username } = req.params
        database.query(
            `SELECT COUNT(user1) FROM friends user1 WHERE user1='${username}' OR user2='${username}';
            SELECT COUNT(id) FROM posts WHERE username='${username}';
            SELECT SUM(likes) FROM posts WHERE username='${username}';
            SELECT  name, username, description, profileImg, gender, dob,visits FROM users WHERE username='${username}'; 
            UPDATE users SET visits = visits + 1 WHERE username = '${username}';
            `,
            async (err, results) => {
                if (err) {
                    res.status(404).json({ message: "Not Found" });
                    return;
                }
                console.log(results);
                const formattedResult = {
                    num_friends: results[0][0]['COUNT(user1)'],
                    num_posts: results[1][0]['COUNT(id)'],
                    num_likes: results[2][0]['SUM(likes)'],
                    name: results[3][0].name,
                    username: results[3][0].username,
                    description: results[3][0].description,
                    profileImg: results[3][0].profileImg,
                    gender: results[3][0].gender,
                    dob: results[3][0].dob,
                    visits: results[3][0].visits
                };

                res.status(200).json(formattedResult);
            }
        )
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

const EditUser = async (req, res) => {
    try {
        const { username, name, profileImg, description, password } = req.body;
        database.query(
            `SELECT * FROM users WHERE username='${username}';`,
            async (err, result) => {
                if (err) {
                    res.status(404).json({ message: "NOT FOUND" });
                    return;
                }
                let status = await bcrypt.compare(password, result[0]?.password);
                if (!status) {
                    res.status(201).json({ message: "Wrong Password" });
                    return;
                }
                database.query(
                    `UPDATE users SET name='${name}', profileImg='${profileImg}', description='${description}' WHERE username='${username}';`,
                    (err, updatedResult) => {
                        if (err || updatedResult.affectedRows !== 1) {
                            res.status(400).json({ message: "Server Error" });
                            return;
                        }

                        res.status(200).json({ updated: true });
                    }
                )
            }
        )
    } catch (error) {
        res.status(400).json({ message: "Server Error" });
    }
}

const AddPost = async (req, res) => {
    try {
        const { username } = req.params;
        const { post_data } = req.body;
        const timestamp = (new Date()).getTime();
        const id = nanoid(50);
        database.query(
            `INSERT INTO posts VALUES('${username}','${post_data}','${timestamp}',0,0,'${id}');`,
            async (err, result) => {
                console.log(result);
                if (err) res.status(400).json({ message: "Post Not Added" });

                res.status(200).json({ id, post_data, timestamp, likes: 0, dislikes: 0, username });
            }
        )
    } catch (error) {
        res.status(400).json({ message: "Post Not Added" });
    }
}

const FetchPosts = async (req, res) => {
    try {
        const { username } = req.params;
        database.query(
            `WITH RankedPosts AS (
                    SELECT id, username, post_data, timestamp, likes, dislikes,
                    ROW_NUMBER() OVER (PARTITION BY id ORDER BY timestamp DESC) AS rn
                    FROM posts 
                    INNER JOIN friends ON (
                        posts.username = '${username}' 
                        OR (posts.username = friends.user1 AND friends.user2 = '${username}')
                        OR (posts.username = friends.user2 AND friends.user1 = '${username}')
                    )
                )
                SELECT id, username, post_data, timestamp, likes, dislikes
                FROM RankedPosts
                WHERE rn = 1
                ORDER BY timestamp DESC;`,
            async (err, result) => {
                if (err) {
                    res.status(400).json({ message: err.message });
                    return
                }
                res.status(200).json(result);
            })
    } catch (error) {
        res.status(400).json({ message: error.message });
        return
    }
}

const TopPosts = async (req, res) => {
    try {
        const { username } = req.params;
        database.query(
            'SELECT * FROM posts WHERE username =? ORDER BY likes DESC LIMIT 5', [username],
            (err, result) => {
                console.log({ err, result });
                if (err || result.length === 0) {
                    res.status(202).json({ message: "Not Found" })
                    return;
                }
                res.status(200).json(result)
            }
        )
    } catch (error) {
        res.status(400).json({ message: "Server Error" });
    }
}

const LikeAndDislikePost = async (req, res) => {
    try {
        //Store the user likes in loaclstorage
        /**
         * postID: like:hjhwdjhgejgejgej
         * postID: dislike:hkdhkehkehjke
         */
        console.log(req.params.postID);
        const [type, postID] = req.params.postID.split(':');
        if (type === 'like') {
            database.query(
                `UPDATE posts SET likes = likes + 1 WHERE id = '${postID}';`,
                (err, result) => {
                    console.log({ err, result });
                    if (err || result.affectedRows === 0) {
                        res.status(400).json({ message: "Like Not Added" });
                        return;
                    }
                    res.status(200).json({ message: "Like added" })
                }
            )
        }
        else {
            database.query(
                `UPDATE posts SET dislikes =dislikes + 1 WHERE id = '${postID}';`,
                (err, result) => {
                    console.log({ err, result });
                    if (err || result.affectedRows === 0) {
                        res.status(400).json({ message: "Dislike Not Added" });
                        return;
                    }
                    res.status(200).json({ message: "dislike added" })
                }
            )
        }


    } catch (error) {
        res.status(400).json({ message: "Server Error" });
    }
}


module.exports = {
    Signin,
    Signup,
    Signout,
    ForgotPassword,
    ResetPassword,
    AddFriend,
    FetchFriends,
    DeleteFriend,
    Search,
    UserProfile,
    EditUser,
    AddPost,
    FetchPosts,
    LikeAndDislikePost,
    FetchPendingMessages,
    TopPosts,
    SendFriendRequest,
    GetRequests
}