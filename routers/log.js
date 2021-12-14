const express = require("express");
const User = require("../models/user");
const Log = require("../models/log");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

//사용자 log기록에 평가결과 추가
router.post("/save_result", authMiddleware, async (req, res) => {
  const { sentence, score, date } = req.body;
  console.log("sentence: ", sentence);
  console.log("date: ", date);
  const { user } = res.locals;
  const userId = user["_id"];

  //현재 로그인한 userId --> (userid,sentence)==(현재 userid, 추가하려는 sentence) 이면 pass, 아니면 create
  isExist = await Log.find({ userId, sentence });

  if (isExist.length !== 0) {
    res.send({ result: "fail", msg: "이미 저장된 문장입니다.", user });
    return;
  } else {
    await Log.create({ userId, sentence, score, date });
  }

  res.send({ result: "success", msg: "결과가 저장되었습니다.", user });
});
//user, sentence 이미 있는 조합이면 점수 및 시간 update하는거 추가

//평가기록에서 기록 삭제
router.delete("/delete_log", authMiddleware, async (req, res) => {
  const { sentence } = req.body;
  console.log("sentence : ", sentence);
  const { user } = res.locals;

  const userId = user["_id"];
  isExist = await Log.find({ userId, sentence });

  if (isExist.length == 0) {
    res.send({ result: "fail", msg: "저장하지 않은 문장입니다.", user });
    return;
  } else {
    await Log.deleteOne({ userId, sentence });
  }

  res.send({ result: "success", msg: "삭제되었습니다.", user });
});

//user의 평가 기록 조회해서 box에 출력
router.get("/get_log", authMiddleware, async (req, res, next) => {
  console.log("get_log api실행");
  const { user } = res.locals;
  console.log("user['_id]: ", user["_id"]);
  const userId = user["_id"];

  logs = await Log.find({ userId });
  console.log("logs: ", logs);
  res.send({ logs: logs, user });
});

module.exports = router;
