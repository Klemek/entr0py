/* exported upgrades */

/**
 * Construct an upgrades object from given data
 * @param {Object} data
 * @return {{maxLevel: {type: number, speed: number, size: number}, prices: {baseCost: number, type: number, speed: number, size: number}, updatePrices: Function, upgrade: Function, isMaxed: Function}}
 */
const upgrades = function (data) {
  const self = {
    maxLevel: {
      type: fileData.length - 1,
      speed: 10,
      size: 10
    },
    prices: {
      baseCost: 10,
      type: 0,
      speed: 0,
      size: 0
    },
    /**
     * Update each parameter prices
     */
    updatePrices: function () {
      const nUpgrades = misc.sum(Object.values(data.genData));

      const nextGen = game.generator.getNextGen();
      const currGen = game.generator.getCurrentGen();
      const typeBonus = currGen.ep ? (nextGen ? nextGen.ep : 0) / currGen.ep : 1;

      const price = (n, bonus = 2) => self.prices.baseCost * bonus / 6 * Math.pow(3, n + nUpgrades / 8);

      self.prices.type = data.genData.type >= self.maxLevel.type ? -1 : price(data.genData.type, typeBonus);
      self.prices.speed = data.genData.type <= 0 || data.genData.speed >= self.maxLevel.speed ? -1 :
        price(data.genData.speed);
      self.prices.size = data.genData.type <= 0 || data.genData.size >= self.maxLevel.size ? -1 :
        price(data.genData.size);
    },
    /**
     * Upgrade a parameter by its name then update prices
     * @param {string} arg
     */
    upgrade: function (arg) {
      switch (arg) {
        case 'type':
        case 'speed':
        case 'size':
          if (data.genData[arg] < self.maxLevel[arg])
            data.genData[arg]++;
          break;
      }
      self.updatePrices();
    },
    count: () => misc.sum(Object.values(data.genData)),
    /**
     * Test if all upgrades are at maximum value
     * @return {boolean}
     */
    isMaxed: () => misc.sum(Object.values(data.genData)) === misc.sum(Object.values(self.maxLevel))
  };
  return self;
};