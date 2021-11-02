const express = require("express");
const Sentences = require("../models/sentence");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router(); 

router.post('/sentences',async (req, res) => {
    const { sentenceId, category,value, mean } = req.body;
  
    isExist = await Sentences.find({ sentenceId });
    if (isExist.length == 0) {
      await Sentences.create({ sentenceId,category, value, mean });
    }
    res.send({ result: "success" });
  });


  router.get("/sentences", async (req, res, next) => {
    console.log("get-sentences api실행"); 
      const { category } = req.query;
      const{value}=req.query;
      console.log("value: ",value);
      //카테고리별 문장찾음
      const sentences = await Sentences.find({ category }).sort("sentenceId");
      //value값 가진 문장 찾음.
      const sentence=  await Sentences.find({value});
     
      res.json({ sentences: sentences, sentence:sentence});
  
  });
    
  module.exports = router;