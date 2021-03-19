var express = require("express");
var router = express.Router();
const game = require("./game");
const login = require("./login");
const fs = require("fs");
const path = require("path");

/* GET home page. */
router.get("/", function (req, res, next) {
  const dirName = path.join(__dirname, "../files");
  fs.mkdir(dirName, { recursive: true }, (err) => {
    if (err) throw err;
  });
  res.json({ message: "działa :)" });
});

module.exports = { index: router, game, login };
