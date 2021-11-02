const express = require("express");
const mongoose = require("mongoose");
const app = express();
const router = express.Router();
const sentenceRouter = require('./routers/sentence');
const userRouter = require('./routers/user');
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static("public"));
app.use("/api",[sentenceRouter]);
app.use("/api",[userRouter]);

mongoose.connect("mongodb://localhost/AUDIO", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));


app.listen(3000, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});