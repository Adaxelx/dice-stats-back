const diceNumbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const emptyDiceStats = (() => {
  const object = {};
  diceNumbers.map((value) => (object[value] = 0));
  return object;
})();

const emptyDiceStatsExt = (() => {
  const object = emptyDiceStats;
  return {
    ...object,
    castle__yellow: 0,
    pirat: 0,
    castle__blue: 0,
    castle__green: 0,
  };
})();

module.exports = { diceNumbers, emptyDiceStats, emptyDiceStatsExt };
