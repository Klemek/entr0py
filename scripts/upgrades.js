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

      //TODO rebalance

      self.prices.type = data.genData.type >= self.maxLevel.type ? -1 :
        self.prices.baseCost * Math.pow(3, data.genData.type / 2 + nUpgrades / 6);

      self.prices.speed = data.genData.type <= 0 || data.genData.speed >= self.maxLevel.speed ? -1 :
        self.prices.baseCost * Math.pow(3, data.genData.speed / 2 + nUpgrades / 6);

      self.prices.size = data.genData.type <= 0 || data.genData.size >= self.maxLevel.size ? -1 :
        self.prices.baseCost * Math.pow(3, data.genData.size / 2 + nUpgrades / 6);
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
    /**
     * Test if all upgrades are at maximum value
     * @return {boolean}
     */
    isMaxed: () => misc.sum(Object.values(data.genData)) === misc.sum(Object.values(self.maxLevel))
  };
  return self;
};