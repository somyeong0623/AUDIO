const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Status = require("../models/status");
const Room = require("../models/room");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth-middleware");

//room 생성 - 원어민만 생성할 수 있음.
router.post("/make_room", authMiddleware, async (req, res) => {
  console.log("make_room api실행");
  const { user } = res.locals;
  const status = user["status"];
  const host = user["nickname"];
  console.log("host: ", host);
  console.log("status: ", status);

  const exist_room = await Room.find({ host }).exec();
  console.log("exist_room: ", exist_room);
  if (status == "general") {
    console.log("원어민이 아님");
    res.status(400).send({
      msg: "원어민만 방을 생성 할 수 있습니다.",
    });
    return;
  }
  if (exist_room.length) {
    console.log("이미 방 생성함");
    res.status(400).send({
      msg: "이미 생성한 방이 존재합니다.",
    });
    return;
  }

  const room = new Room({ host });
  await room.save();
  res.send({ result: "success", msg: "방이 생성되었습니다." });
});

//room 입장
router.post("/join", authMiddleware, async (req, res) => {
  try {
    const { user } = res.locals;
    const email = user["email"];
    console.log("email: ", email);
    const status = await Status.findOne({ email });
    console.log("status: ", status);

    if (status.roomIn === false) {
      await Status.updateOne({ email }, { roomIn: true });
      res.send(false);
    } else {
      res.send(true);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

//room 퇴장
router.post("/leave", authMiddleware, async (req, res) => {
  try {
    const { user } = res.locals;
    const email = user["email"];
    console.log("email: ", email);
    const status = await Status.findOne({ email });
    console.log("status: ", status);

    if (status.roomIn === true) {
      await Status.updateOne({ email }, { roomIn: false });
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

//room_list
router.get("/room_list", async (req, res, next) => {
  console.log("get-natives api실행");
  const rooms = await Room.find();
  res.json({ rooms: rooms });
});

module.exports = router;
