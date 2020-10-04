var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const { Game } = require("../models");
const {
  diceNumbers,
  emptyDiceStats,
  emptyDiceStatsExt,
} = require("../constants/diceNumbers");

router.post("/add", async (req, res) => {
  const { throws, players, isExtension } = req.body;
  const playersArr = [...players];
  const stats = isExtension ? { ...emptyDiceStatsExt } : { ...emptyDiceStats };
  playersArr.forEach((player) => {
    if (isExtension) player.stats = { ...emptyDiceStatsExt };
    else player.stats = { ...emptyDiceStats };
  });
  throws.forEach((roll) => {
    stats[roll.value] += 1;
    playersArr.forEach((player) => {
      if (player.index === roll.player) {
        player.stats[roll.value] += 1;
      }
    });
  });

  const longestStreak = (() => {
    let number = throws[0].value;
    let streak = 0;
    let highestStreak = 0;
    let startIndex = 0;
    let highestNumber = 0;
    throws.forEach((roll, i) => {
      if (!roll.value.length) {
        if (number === roll.value) {
          streak++;
        } else {
          streak = 1;
        }
        number = roll.value;

        if (streak > highestStreak) {
          highestStreak = streak;
          highestNumber = number;
          startIndex = i - streak + 1;
        }
      }
    });
    return { diceNumber: highestNumber, streak: highestStreak, startIndex };
  })();

  const standardObject = {
    ore: [],
    grain: [],
    brick: [],
    lumber: [],
    sheep: [],
  };

  const extensionObject = {
    coin: [],
    paper: [],
    cloth: [],
  };

  let resourcesStats = {};

  let resourcesStatsPlayer = [];

  if (isExtension) {
    resourcesStats = {
      total: 0,
      ore: [],
      grain: [],
      brick: [],
      lumber: [],
      sheep: [],
      coin: [],
      paper: [],
      cloth: [],
    };
    playersArr.forEach(
      (player) =>
        (player.resourcesStats = {
          total: 0,
          ore: [],
          grain: [],
          brick: [],
          lumber: [],
          sheep: [],
          coin: [],
          paper: [],
          cloth: [],
        })
    );
  } else {
    resourcesStats = {
      total: 0,
      ore: [],
      grain: [],
      brick: [],
      lumber: [],
      sheep: [],
    };
    playersArr.forEach(
      (player) =>
        (player.resourcesStats = {
          total: 0,
          ore: [],
          grain: [],
          brick: [],
          lumber: [],
          sheep: [],
        })
    );
  }

  console.log(resourcesStats);

  throws.forEach((throwVal, i) => {
    if (typeof throwVal.value === "number") {
      playersArr.forEach((player) => {
        player.buildings.forEach((building) => {
          if (building.buildedInThrow < i + 1) {
            building.resources.forEach((resource) => {
              if (resource.value === throwVal.value) {
                console.log("xd");
                resourcesStats[resource.type].push(throwVal.value);
                player.resourcesStats[resource.type].push(throwVal.value);
                player.resourcesStats.total += 1;
                resourcesStats.total += 1;
              }
            });
          }
        });
      });
    }
  });

  const date = new Date();
  const name = `catan-${date.toLocaleString()}`;
  try {
    await Game.insertMany([
      {
        name,
        history: throws,
        stats,
        longestStreak,
        players: playersArr,
        countOfDiceRolls: isExtension ? throws.length / 2 : throws.length,
        isExtension,
        resourcesStats,
      },
    ]);
    res.status(200);
    res.json({ message: `Pomyślnie dodano do bazy danych gre ${name}` });
  } catch (err) {
    console.log(err);
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
    res.status(500);
    res.json({ message: `Nie udało się pobrać bazy danych` });
  }
});

module.exports = router;
