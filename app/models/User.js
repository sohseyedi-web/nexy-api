const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  imageGoogle: String,
  imageGitHub: String,
});

module.exports = {
  User: mongoose.model("User", UserSchema),
};
