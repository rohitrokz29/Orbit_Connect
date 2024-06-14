let socketIds={};

const setSocketIdOfUser=({username,socketId})=>{
    socketIds[username]=socketId
    console.log({socketIds});
}

module.exports={setSocketIdOfUser,socketIds}