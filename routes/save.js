var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");

router.post("/save", (req, res) => {
  const { gameData } = req.body;
  const date = new Date();
  const dateParsed = date.toLocaleDateString("en-US");
  const dirName = path.join(
    __dirname,
    `/../files/catan-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}.json`
  );
  fs.writeFile(dirName, JSON.stringify(gameData), (err) => {
    if (err) {
      res.status(500);
      res.json({ ...err, message: "coś się zjebało" });
    }
    res.status(200);
    res.json({
      message: `Poprawnie zapisano plik catan-${date.toLocaleDateString(
        "pl-PL",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )}`,
    });
  });
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
