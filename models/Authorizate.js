const mongoose = require("mongoose");
const { Schema } = mongoose;

const authorizationSchema = new Schema({
  login: String,
  password: String,
  token: String,
});

module.exports = mongoose.model("Authorizate", authorizationSchema);
