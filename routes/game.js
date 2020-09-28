var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const { Game } = require("../models");

router.post("/add", async (req, res) => {
  const date = new Date();
  const name = `catan-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
  try {
    await Game.insertMany([req.body]);
    res.status(200);
    res.json({ message: `Pomyślnie dodano do bazy danych gre ${name}` });
  } catch (err) {
    res.status(500);
    res.json({ message: `Nie udało się dodać do bazy danych` });
  }
});

router.get("/history/", async (req, res) => {
  const { page, pageSize } = req.query;
  const skips = (page - 1) * pageSize;
  try {
    const response = await Game.find()
      .skip(skips)
      .limit(pageSize * 1);
    res.json(response);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ message: `Nie udało się pobrać bazy danych` });
  }
});

module.exports = router;
