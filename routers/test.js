const express = require("express");
const User = require("../models/user");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

//post 예시
router.post("/sentences", authMiddleware, async (req, res) => {
  const { sentenceId, category, value, mean } = req.body;

  isExist = await Sentences.find({ sentenceId });
  if (isExist.length == 0) {
    await Sentences.create({ sentenceId, category, value, mean });
  }
  res.send({ result: "success" });
});

//발음평가 api test해서
router.post("/test", async (req, res) => {
  console.log("test api 실행!");
  // const { fname, sentence, data } = req.body;
  console.log("request _body : ", req.body);
  var fd = req.body.data;
  console.log("fd : ", fd);
  // console.log("sentence : ", sentence);

  var fs = require("fs");
  // var openApiURL = 'http://aiopen.etri.re.kr:8000/WiseASR/Pronunciation'; //영어
  var openApiURL = "http://aiopen.etri.re.kr:8000/WiseASR/PronunciationKor"; //한국어

  var access_key = "3ca4f231-0a23-4c66-b15c-8c065418f5a9";
  var languageCode = "korean";
  var script = "안녕하세요";
  console.log("script: ", script);
  var audioFilePath = "./hello.wav";
  var audioData;
  var audioData = fs.readFileSync(audioFilePath);
  var requestJson = {
    access_key: "3ca4f231-0a23-4c66-b15c-8c065418f5a9",
    argument: {
      language_code: languageCode,
      script: script,
      audio: audioData.toString("base64"),
    },
  };

  var request1 = require("request");
  var options = {
    url: openApiURL,
    body: JSON.stringify(requestJson),
    headers: { "Content-Type": "application/json; charset=UTF-8" },
  };
  request.post(options, function (error, response, body) {
    console.log("responseCode = " + response.statusCode);
    console.log("responseBody = " + body);
  });
});

module.exports = router;
