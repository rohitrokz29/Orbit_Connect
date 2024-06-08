const express = require("express");
const dotenv = require("dotenv");
const mysql = require('mysql')
const { createServer, request } = require("node:http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieEncrypter = require("cookie-encrypter");
const cors = require("cors");
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
const io = new Server(listeningServer, {
  cors: { origin: process.env.ACCESS_ORIGIN },
});

app.use("/", require("./routes/user.router"));

io.on('connection', (socket) => {
  console.log(`socket connected :${socket.id}`);
})

listeningServer.listen(process.env.HOST_PORT || 3000, () => {
  console.log("Running at port 3000");


});
module.exports = { io }


