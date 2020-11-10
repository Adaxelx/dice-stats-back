const mongoose = require("mongoose");
const { Schema } = mongoose;

const authorizationSchema = new Schema({
  token: String,
});

module.exports = mongoose.model("Authorizate", authorizationSchema);
