var express = require("express");
var router = express.Router();
const game = require("./game");
const fs = require("fs");
const path = require("path");
const { Authorizate } = require("../models");

/* GET home page. */
router.post("/", async (req, res, next) => {
  console.log(req.body);

  const { login, password } = req.body;

  try {
    const response = await Authorizate.find({ login, password });
    if (response.length === 0) {
      res.status(400);
      res.json({ message: "User don't exist." });
    } else {
      res.status(201);
      res.json({ token: response[0]?.token });
    }
  } catch (err) {
    res.status(400);
    res.json({ message: "error" });
  }
});

module.exports = router;
