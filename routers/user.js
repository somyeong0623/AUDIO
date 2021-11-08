const express = require("express");
const router = express.Router(); 
const authMiddleware = require("../middlewares/auth-middleware");
const User = require("../models/user");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

//회원가입 검증
const postUsersSchema = Joi.object({
    nickname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  });

//회원가입 api
//회원가입 할때 해당id에대한 단어장 생성
  router.post("/users", async (req, res) => {
    try {
      const { nickname, email,password, confirmPassword,} = await postUsersSchema.validateAsync(req.body);
  
      if (password !== confirmPassword) {
        console.log("패스워드 확인란과 동일하지 않음.");
        res.status(400).send({
          errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
        });
        return;
      }
  
      const existUsers = await User.find({
        $or: [{ email }, { nickname }],
      });
      if (existUsers.length) {
        res.status(400).send({
          errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다.",
        });
        return;
      }
  
      const user = new User({ email, nickname, password });
      await user.save();

      //프론트엔드 보면 아무것도 안보내도 되지만
      //REST api 원칙에따라 created는 201라는 status code적용
      res.status(201).send({});
    } catch (err) {
      console.log(err);
      res.status(400).send({
        errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
      });
    }
  });
  
  //로그인 검증
  const postAuthSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

//로그인 api
//로그인 행위는 jwt토큰을 그때그때 생산하므로 post로 간주하자.
//GET는 body에 데이터를 실을 수 없음.(query string으로 하기엔 보안에 취약.)
  router.post("/auth", async (req, res) => {
    try {
      const { email, password } = await postAuthSchema.validateAsync(req.body);
  
      const user = await User.findOne({ email, password }).exec();
  
      if (!user) {
        res.status(400).send({
          errorMessage: "이메일 또는 패스워드가 잘못됐습니다.",
        });
        //error났으면 바로 return.
        return;
      }
      //sign을 해야 token을 만들 수 있음.
      const token = jwt.sign({ userId: user.userId }, "my-secret-key");
      res.send({
        token,
      });
    } catch (err) {
        console.log(err);
      res.status(400).send({
        errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
      });
    }
  });
  
  //유저 조회
  router.get("/users/me", authMiddleware, async (req, res) => {
    const { user } = res.locals;
    // console.log("user: ",user);
    res.send({
      user,
    });
  });

  module.exports = router;