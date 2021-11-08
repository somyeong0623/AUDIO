const express = require("express");
const User = require("../models/user");
const Words = require("../models/word");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router(); 

// var Owlbot = require('owlbot-js');
// var client = Owlbot('59641d32a0d3eb47e6e015dad90efcf45e32eec6');
// client.define('owl').then(function(result){
//   console.log(result);
// });

//사용자 단어장에 단어 추가
router.post('/save_word',authMiddleware,async (req, res) => {

  const { word, definition } = req.body;
  console.log("word: ",word);
  console.log("definition: ",definition);
  const { user } = res.locals;
  // console.log("user: ",user);
  console.log("user['_id]: ", user['_id']);
  const userId=user['_id'];


  //현재 로그인한 userId --> (userid,word)==(현재userid, 추가하려는word) 이면 pass, 아니면 create
  isExist = await Words.find({ userId,word });
  
  if(isExist.length!==0){
    res.send({result: "fail", msg:"이미 저장된 단어입니다.", user})
    return;
  }
  else{
    await Words.create({ userId, word,definition });
    
  }
  await user.save();
  res.send({ result: "success" , msg:"저장되었습니다.",user});

});

//단어장에서 단어 삭제
router.delete('/delete_word',authMiddleware,async (req, res) => {

  const { word, definition } = req.body;
  const { user } = res.locals;
  console.log("user['_id]: ", user['_id']);
  const userId=user['_id'];

  isExist = await Words.find({ userId,word });
  
  if(isExist.length==0){
    res.send({result: "fail", msg:"저장하지 않은 단어입니다.", user})
    return;
  }
  else{
    await Words.deleteOne({ userId, word });
  }
  await user.save();
  res.send({ result: "success" , msg:"삭제되었습니다.",user});
});



//user단어장 목록 조회해서 box에 출력
router.get("/words",authMiddleware, async (req, res, next) => {
  console.log("get-word api실행"); 
  const { user } = res.locals;
  console.log("user['_id]: ", user['_id']);
  const userId=user['_id'];

  words = await Words.find({ userId});   
  console.log("words: ", words);
  res.send({words:words, user})

});


module.exports = router;