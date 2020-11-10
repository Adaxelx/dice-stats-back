var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const { Game, Authorizate } = require("../models");
const {
  diceNumbers,
  emptyDiceStats,
  emptyDiceStatsExt,
} = require("../constants/diceNumbers");

const isValid = async (token) => {
  const tokens = await Authorizate.find();
  return tokens.map(({ token }) => token).includes(token);
};

const calculateStats = (req, res) => {
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
      if (typeof roll.value === "number") {
        if ((isExtension && !(i % 2)) || !isExtension) {
          if (number === roll.value) {
            streak++;
          } else {
            streak = 1;
          }
          number = roll.value;

          if (streak > highestStreak) {
            highestStreak = streak;
            highestNumber = number;
            startIndex = isExtension ? i / 2 - streak + 1 : i - streak + 1;
          }
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
    playersArr.forEach((player) => {
      player.resourcesStats = {
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
      player.buildings.forEach(
        (building) =>
          (building.resourcesStats = {
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
    });
  } else {
    resourcesStats = {
      total: 0,
      ore: [],
      grain: [],
      brick: [],
      lumber: [],
      sheep: [],
    };
    playersArr.forEach((player) => {
      player.resourcesStats = {
        total: 0,
        ore: [],
        grain: [],
        brick: [],
        lumber: [],
        sheep: [],
      };
      player.buildings.forEach(
        (building) =>
          (building.resourcesStats = {
            total: 0,
            ore: [],
            grain: [],
            brick: [],
            lumber: [],
            sheep: [],
          })
      );
    });
  }

  throws.forEach((throwVal, i) => {
    if (typeof throwVal.value === "number") {
      playersArr.forEach((player) => {
        player.buildings.forEach((building) => {
          if (building.buildedInThrow < i + 1) {
            building.resources.forEach((resource) => {
              if (resource.value === throwVal.value) {
                resourcesStats[resource.type].push(throwVal.value);
                player.resourcesStats[resource.type].push(throwVal.value);
                player.resourcesStats.total += 1;
                building.resourcesStats[resource.type].push(throwVal.value);
                building.resourcesStats.total += 1;
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

  return {
    date,
    name,
    history: throws,
    stats,
    longestStreak,
    players: playersArr,
    countOfDiceRolls: isExtension ? throws.length / 2 : throws.length,
    isExtension,
    resourcesStats,
  };
};

router.post("/generateStats", async (req, res) => {
  const stats = calculateStats(req, res);
  res.status(200);
  res.json(stats);
});

router.post("/add", async (req, res) => {
  if (await isValid(req.headers.authorization)) {
    const stats = calculateStats(req, res);
    try {
      const response = await Game.insertMany([stats]);
      res.status(200);
      res.json({
        message: `Successfuly added game`,
        id: response[0]._id,
      });
    } catch (err) {
      res.status(500);
      res.json({ message: `Db fail.` });
    }
  } else {
    res.status(403);
    res.json({ message: `You do not have access to this part of website.` });
  }
});

router.put("/edit/:id", async (req, res) => {
  if (await isValid(req.headers.authorization)) {
    const { id } = req.params;
    const stats = calculateStats(req, res);
    try {
      const response = await Game.findByIdAndUpdate({ _id: id }, stats);

      res.status(200);
      res.json({
        message: `Successfully edited game.`,
        id,
      });
    } catch (err) {
      res.status(500);
      res.json({ message: `Data adding fail.` });
    }
  } else {
    res.status(403);
    res.json({ message: `You do not have access to this part of website.` });
  }
});

router.get("/history/", async (req, res) => {
  if (await isValid(req.headers.authorization)) {
    const { page, pageSize } = req.query;
    const skips = (page - 1) * pageSize;

    try {
      const count = await Game.countDocuments({});

      const response = await Game.find()
        .sort({ date: -1 })
        .skip(skips)
        .limit(pageSize * 1);

      res.json({ data: response, count });
    } catch (err) {
      res.status(500);
      res.json({ message: `DB error` });
    }
  } else {
    res.status(403);
    res.json({ message: `You do not have access to this part of website.` });
  }
});

module.exports = router;
