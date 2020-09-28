const mongoose = require("mongoose");
const { Schema } = mongoose;

const gameSchema = new Schema({
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

  history: [Number],
  countOfDiceRolls: Number,
  longestStreak: { diceNumber: Number, streak: Number },
  players: [Number],
});

module.exports = mongoose.model("Game", gameSchema);
