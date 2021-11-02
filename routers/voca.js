const express = require("express");
const words = require("../models/word");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router(); 

//
router.get("/workds", async (req, res, next) => {
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

odule.exports = router;