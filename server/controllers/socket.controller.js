const {io} = require('./server');
io.on('connection',(socket)=>{
    console.log(`socket connected :${socket.id}`);
    socket.on('disconnect',()=>{
        console.log('dicosnnected socket');
    })
    socket.on('join-room',({roomID,username})=>{
        console.log("ROOM JOINED");
        socket.join(roomID);
        io.to(roomID).emit('new-user',{username});
    })
    socket.on("send-message",({roomID,message,username})=>{
        io.to(roomID).emit("recieve-message",{message,username})
    })
})