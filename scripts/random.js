/* exported random */

const random = function (randomData) {
  randomData = randomData || {};

  const data = {
    type: randomData.type || 0,
    speed: randomData.speed || 1,
    size: randomData.size || 1
  };

  const self = {
    data: data,
    buffer: '',
    prices: {
      baseCost: 10,
      type: 0,
      speed: 0,
      size: 0
    },
    updatePrices: function () {
      const nSpeed = Math.log2(data.speed);
      const nSize = Math.log2(data.size);

      self.prices.speed = data.type <= 0 ? -1 : self.prices.baseCost * Math.pow(3, 2 * nSpeed / 3 + (data.type + nSize) / 6);
      self.prices.size = data.type <= 0 ? -1 : self.prices.baseCost * Math.pow(3, 2 * nSize / 3 + (data.type + nSpeed) / 6);
      self.prices.type = data.type >= self.generators.length - 1 ? -1 :
        self.prices.baseCost * Math.pow(3, 2 * data.type / 3 + (nSize + nSpeed) / 6);
    },
    getNext: function () {
      if (data.type <= 0 || data.type >= self.generators.length)
        return '';
      const gen = self.generators[data.type];
      while (self.buffer.length < data.size) {
        const c = gen.pool[misc.randchances(gen.chances)];
        self.buffer += misc.tobin(c.charCodeAt(0), 8); //lowercase chars
      }
      let output = self.buffer.substr(0, data.size);
      self.buffer = self.buffer.substr(data.size);
      return output;
    },
    upgrade: function (arg) {
      switch (arg) {
        case 'type':
          if (data.type < self.generators.length - 1)
            data.type++;
          break;
        case 'speed':
          data.speed *= 2;
          break;
        case 'size':
          data.size *= 2;
          break;
      }
      self.updatePrices();
    },
    loop: function () {
      if (data.type > 0 && app.inputData)
        app.inputData(self.getNext());
      setTimeout(self.loop, 1000 / data.speed);
    },
    generators: fileData
  };
  return self;
};