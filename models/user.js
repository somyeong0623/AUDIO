const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  nickname: String,
  password: String,
  status: String,
});

//프론트엔드에서 userId 값을 참조하고있음.
UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("User", UserSchema);
