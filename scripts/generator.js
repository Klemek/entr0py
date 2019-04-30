/* exported generator */

/**
 * Construct a "generator" object from given data (or generate new ones)
 * @param {Object} genData
 * @return {{data: {type: number, speed: number, size: number}, buffer: string, maxType: number, maxLevel: number, prices: {baseCost: number, type: number, speed: number, size: number}, updatePrices: function, getNext: function, upgrade: function, loop: function, isMaxed: function, getCurrentGen: function, getNextGen: function, generators: {name: string, count: number, tep: number, ep: number, pool: string, chances: number[]}[]}}
 */
const generator = function (genData) {
  genData = genData || {};

  const maxType = fileData.length - 1;
  const maxLevel = 10;
  const maxRealSpeed = 5;

  const data = {
    type: Math.min(genData.type || 0, maxType),
    speed: Math.min(genData.speed || 0, maxLevel),
    size: Math.min(genData.size || 0, maxLevel)
  };

  const self = {
    data: data,
    buffer: '',
    generators: fileData,
    /**
     * Get current generator values
     */
    getCurrentGen: () => self.generators[data.type],
    /**
     * Get next generator values
     */
    getNextGen: () => self.generators[data.type + 1],
    /**
     * Get the next chunk of binary from the generator
     * @return {string}
     */
    getNext: function () {
      if (data.type <= 0 || data.type > self.maxType)
        return '';
      const gen = self.generators[data.type];
      const size = Math.pow(2, data.size + Math.max(0, data.speed - maxRealSpeed));

      while (self.buffer.length < size) {
        const c = gen.pool[misc.randchances(gen.chances)];
        self.buffer += misc.tobin(c.charCodeAt(0), 8);
      }
      let output = self.buffer.substr(0, size);
      self.buffer = self.buffer.substr(size);
      return output;
    },
    /**
     * Main loop of generator
     */
    loop: function () {
      if (data.type > 0 && app.inputData)
        app.inputData(self.getNext());
      setTimeout(self.loop, 1000 / Math.pow(2, Math.min(data.speed, maxRealSpeed)));
    }
  };
  return self;
};