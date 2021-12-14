const express = require("express");
const mongoose = require("mongoose");
const app = express();
const router = express.Router();
const sentenceRouter = require("./routers/sentence");
const userRouter = require("./routers/user");
const wordRouter = require("./routers/word");
const testRouter = require("./routers/test");
const logRouter = require("./routers/log");
const roomRouter = require("./routers/room");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public/html"));
app.use(express.static("public"));
app.use("/api", [sentenceRouter]);
app.use("/api", [userRouter]);
app.use("/api", [wordRouter]);
app.use("/api", [testRouter]);
app.use("/api", [logRouter]);
app.use("/api", [roomRouter]);

const http = require("http");
const io = require("socket.io");

const httpServer = http.createServer(app);
const ioServer = io(httpServer);

mongoose.connect("mongodb://localhost/AUDIO", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

ioServer.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    let numOfClients = ioServer.sockets.adapter.rooms.get(roomName)?.size;
    if (numOfClients == 0 || numOfClients === undefined) {
      console.log(`${socket.id} join`, roomName);
      socket.join(roomName);
    } else if (numOfClients == 1) {
      console.log(`${socket.id} join`, roomName);
      socket.join(roomName);
      socket.to(roomName).emit("welcome");
    } else {
      socket.emit("full");
    }
  });
  socket.on("leave", (roomName) => {
    console.log(`${socket.id} leave`, roomName);
    socket.leave(roomName);
  });
  socket.on("offer", (offer, roomName) => {
    console.log("offer");
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    console.log("answer");
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    console.log("ice");
    socket.to(roomName).emit("ice", ice);
  });
});

httpServer.listen(3000, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});
