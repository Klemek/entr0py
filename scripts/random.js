/* exported random */

const random = function (randomData) {
  randomData = randomData || {};

  const maxLevel = 10;
  const maxRealSpeed = 5;

  const data = {
    type: Math.min(randomData.type || 0, fileData.length - 1),
    speed: Math.min(randomData.speed || 0, maxLevel),
    size: Math.min(randomData.size || 0, maxLevel)
  };

  const self = {
    data: data,
    buffer: '',
    maxType: fileData.length - 1,
    maxLevel: maxLevel,
    prices: {
      baseCost: 10,
      type: 0,
      speed: 0,
      size: 0
    },
    updatePrices: function () {
      const nUpgrades = data.type + data.size + data.speed;

      //TODO rebalance

      self.prices.type = data.type >= self.maxType ? -1 :
        self.prices.baseCost * Math.pow(3, data.type / 2 + nUpgrades / 6);

      self.prices.speed = data.type <= 0 || data.speed >= self.maxLevel ? -1 :
        self.prices.baseCost * Math.pow(3, data.speed / 2 + nUpgrades / 6);

      self.prices.size = data.type <= 0 || data.size >= self.maxLevel ? -1 :
        self.prices.baseCost * Math.pow(3, data.size / 2 + nUpgrades / 6);
    },
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
    upgrade: function (arg) {
      switch (arg) {
        case 'type':
          if (data.type < self.maxType)
            data.type++;
          break;
        case 'speed':
          if (data.speed < self.maxLevel)
            data.speed++;
          break;
        case 'size':
          if (data.size < self.maxLevel)
            data.size++;
          break;
      }
      self.updatePrices();
    },
    loop: function () {
      if (data.type > 0 && app.inputData)
        app.inputData(self.getNext());
      setTimeout(self.loop, 1000 / Math.pow(2, Math.min(data.speed, maxRealSpeed)));
    },
    isMaxed: function () {
      return data.type >= self.maxType && data.speed >= self.maxLevel && data.size >= self.maxLevel;
    },
    generators: fileData
  };
  return self;
};