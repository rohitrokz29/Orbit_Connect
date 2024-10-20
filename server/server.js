const express = require("express");
const dotenv = require("dotenv");
const mysql = require('mysql')
const { createServer, request } = require("node:http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieEncrypter = require("cookie-encrypter");
const cors = require("cors");
const { setSocketIdOfUser, socketIds, removeSocketIdOfUser, sendPending } = require("./controllers/socket.controller");
dotenv.config();
// dotenv.config({ path: __dirname + "./.env" });
const app = express();

console.log({ user: process.env.MYSQL_USER });
app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.ACCESS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_ENCRYPT_SECRET.toString()));
app.use(cookieEncrypter(process.env.COOKIE_ENCRYPT_SECRET.toString()));

app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.ACCESS_ORIGIN.toString()
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const listeningServer = createServer(app);

app.use("/", require("./routes/user.router"));
const io = new Server(listeningServer, {
  cors: { origin: process.env.ACCESS_ORIGIN },
});

io.on('connection', (socket) => {
  const username = socket.handshake.query.signedinUser;
  console.log({ username, "socketId": socket.id });
  setSocketIdOfUser({ username, socketId: socket.id });
  console.log({ socketIds });
  socket.on('disconnect', () => {
    removeSocketIdOfUser({ username })
    console.log(`dicosnnected socket ${{ username, "socketId": socket.id }}`);

  })

  socket.on('check-online', ({ check, from }) => {

    io.to(socketIds[from]).emit('check-online', { check, status: socketIds[check] ? true : false });
  })

  socket.on("send-message", ({ message, sender, to, timeStamp }) => {
    console.log({ message, sender, to, timeStamp });
    if (socketIds[to]) {
      try {
        io.to(socketIds[to]).emit("recieve-message", { message, sender, timeStamp })
      } catch (error) {
        const result = sendPending({ message, to, sender, timeStamp });
        if (result) {
          io.to(socketIds[sender]).emit('error', 'Message not Sent , Some Error Occured');

        }

      }
    } else {
      const result = sendPending({ message, to, sender, timeStamp });
      if (result) {
        io.to(socketIds[sender]).emit('error', 'Message not Sent , Some Error Occured');
      }

    }
  })
})

listeningServer.listen(process.env.HOST_PORT || 3000, () => {
  console.log("Running at port 3000");


});


