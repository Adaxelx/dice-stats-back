const mongoose = require("mongoose");
const { Schema } = mongoose;

const gameSchema = new Schema(
  {
    name: String,
    stats: {
      2: Number,
      3: Number,
      4: Number,
      5: Number,
      6: Number,
      7: Number,
      8: Number,
      9: Number,
      10: Number,
      11: Number,
      12: Number,
    },
    history: [{ value: String || Number, player: Number }],
    countOfDiceRolls: Number,
    longestStreak: { diceNumber: Number, streak: Number, startIndex: Number },
    players: [
      {
        name: String,
        stats: {
          2: Number,
          3: Number,
          4: Number,
          5: Number,
          6: Number,
          7: Number,
          8: Number,
          9: Number,
          10: Number,
          11: Number,
          12: Number,
        },
        index: Number,
        resourcesStats: {
          ore: [Number],
          grain: [Number],
          lumber: [Number],
          brick: [Number],
          sheep: [Number],
          coin: [Number],
          paper: [Number],
          cloth: [Number],
          total: Number,
        },
        buildings: [
          {
            type: String,
            resources: [
              {
                type: String,
                value: Number,
              },
            ],
            resourcesStats: {
              ore: [Number],
              grain: [Number],
              lumber: [Number],
              brick: [Number],
              sheep: [Number],
              coin: [Number],
              paper: [Number],
              cloth: [Number],
              total: Number,
            },
            buildedInThrow: Number,
          },
        ],
      },
    ],
    isExtension: Boolean,
    resourcesStats: {
      ore: [Number],
      grain: [Number],
      lumber: [Number],
      brick: [Number],
      sheep: [Number],
      coin: [Number],
      paper: [Number],
      cloth: [Number],
      total: Number,
    },
  },
  { typeKey: "$type" }
);

module.exports = mongoose.model("Game", gameSchema);
