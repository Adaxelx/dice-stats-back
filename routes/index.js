var express = require("express");
var router = express.Router();
const save = require("./save");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ message: "działa :)" });
});

module.exports = { index: router, save };
