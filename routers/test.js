//발음평가 api
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const User = require("../models/user");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();

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
router.post("/test", multipartMiddleware, async (req, res) => {
  console.log("test api 실행!");
  const { fname, sentence } = req.body;
  const data = req.files.data;
  const path = data.path;
  console.log("fname: ", fname);
  console.log("sentence: ", sentence);
  // console.log("data ", data);
  // console.log("req.files: ", req.files);
  console.log("path:", data.path);

  var fs = require("fs");
  var openApiURL = "http://aiopen.etri.re.kr:8000/WiseASR/Pronunciation"; //영어
  // var openApiURL = "http://aiopen.etri.re.kr:8000/WiseASR/PronunciationKor"; //한국어

  var access_key = "3ca4f231-0a23-4c66-b15c-8c065418f5a9";
  var languageCode = "korean";
  var script = sentence;
  // var script = "안녕하세요";
  console.log("script: ", script);
  var audioFilePath = path;
  // var audioFilePath = "./hello.wav";
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

  var request = require("request");
  var options = {
    url: openApiURL,
    body: JSON.stringify(requestJson),
    headers: { "Content-Type": "application/json; charset=UTF-8" },
  };
  request.post(options, function (error, response, body) {
    console.log("responseCode = " + response.statusCode);
    console.log("body " + body);

    const parseBody = JSON.parse(body);
    score = parseBody.return_object.score;
    console.log("score: ", score);

    // score = body.return_object["score"];
    // console.log(score);
  });
  res.send({ result: "success", score: score });
});

module.exports = router;
