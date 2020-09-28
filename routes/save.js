var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const { Game } = require("../models");

router.post("/save", async (req, res) => {
  const { stats, countOfDiceRolls } = req.body;
  console.log(req.body);
  const date = new Date();
  const name = `catan-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
  try {
    await Game.insertMany([{ stats, countOfDiceRolls }]);
    res.status(200);
    res.json({ message: `Pomyślnie dodano do bazy danych gre ${name}` });
  } catch (err) {
    res.status(500);
    res.json({ message: `Nie udało się dodać do bazy danych` });
  }
});

router.get("/file_names", (req, res) => {
  // res.json(`${__dirname}/files`);
  const dirName = path.join(__dirname, `/../files`);
  fs.readdir(dirName, (err, files) => {
    if (err) {
      res.status(500);
      res.json({ err });
      throw new Error(err);
      return;
    }
    const arrayOfFiles = [];
    if (files) {
      files.forEach((file) => {
        arrayOfFiles.push(file);
      });
      res.status(200);
      res.json(arrayOfFiles);
    }
  });
});

router.get("/game_stats/:fileName", (req, res) => {
  const { fileName } = req.params;
  const dirName = path.join(__dirname, `/../files/${fileName}`);
  fs.readFile(dirName, "utf8", (err, data) => {
    if (err) {
      res.status(500);
      res.json({ message: "błąd" });
    }
    console.log(data);
    res.status(200);
    res.json(data);
  });
});

module.exports = router;
