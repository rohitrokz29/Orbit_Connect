const { database } = require("../database/database");

let socketIds = {};

const setSocketIdOfUser = ({ username, socketId }) => {
    socketIds[username] = socketId
    console.log({ socketIds });
}

const removeSocketIdOfUser = ({ username }) => {
    delete socketIds[username];
    console.log({ socketIds });
}

const sendPending = async ({ message, sender, to, timeStamp }) => {
    try {
        await database.query(
            'INSERT INTO pending VALUES (?,?,?,?);', [sender, to, message, timeStamp],
            (err, result) => {
                if (err || result?.affectedRows !== 1) {
                    isError = true;
                    throw new Error("Error");
                }
            }
        )
    } catch (error) {
        return true;
    }


}
module.exports = {
    socketIds,
    setSocketIdOfUser,
    removeSocketIdOfUser,
    sendPending
}