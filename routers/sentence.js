const express = require("express");
const Sentences = require("../models/sentence");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router(); 

router.post('/sentences', authMiddleware,async (req, res) => {
    const { sentenceId, category,value, mean } = req.body;
  
    isExist = await Sentence.find({ sentenceId });
    if (isExist.length == 0) {
      await Sentence.create({ sentenceId,category, value, mean });
    }
    res.send({ result: "success" });
  });

  router.get("/sentences", async (req, res, next) => {
    try {
      const { category } = req.query;
      const sentences = await Sentences.find({ category }).sort("sentenceId");
      res.json({ sentences: sentences});
    } catch (err) {
      console.error(err);
      next(err);
    }
  });
  


module.exports = router;