var express = require("express");
var router = express.Router();
const fs = require("fs");

router.post("/save", (req, res) => {
  const { gameData } = req.body;
  const date = new Date();
  fs.writeFile(
    `files/catan-${date.toLocaleDateString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    })}.json`,
    JSON.stringify(gameData),
    (err) => {
      if (err) throw err;
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
    }
  );
});

router.get("/file_names", (req, res) => {
  fs.readdir("files", (err, files) => {
    if (err) {
      res.status(500);
      res.json({ ...err, message: "coś się zjebało" });
    }
    const arrayOfFiles = [];
    files.forEach((file) => {
      arrayOfFiles.push(file);
    });
    res.status(200);
    res.json(arrayOfFiles);
  });
});

router.get("/game_stats/:fileName", (req, res) => {
  const { fileName } = req.params;
  fs.readFile(`files/${fileName}`, "utf8", (err, data) => {
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
