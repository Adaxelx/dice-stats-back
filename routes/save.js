var express = require("express");
var router = express.Router();
const fs = require("fs");

router.post("/save", (req, res) => {
  const { gameData } = req.body;
  const date = new Date();
  fs.writeFile(
    `files/catan-${date.toLocaleDateString("pl-PL")}.json`,
    JSON.stringify(gameData),
    (err) => {
      if (err) throw err;
      res.status(200);
      res.json({
        message: `Poprawnie zapisano plik catan-${date.toLocaleDateString(
          "pl-PL"
        )}`,
      });
    }
  );
});

module.exports = router;
