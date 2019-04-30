const utils = require('./utils.js');

const maxLevel = 10;

let page;
let fileData;
beforeAll(async () => {
  page = await utils.beforeAll();
  fileData = await page.evaluate(() => fileData);
  expect(typeof fileData).toBe('object');
});

afterAll(utils.afterAll);

//pretend for individual tests
let loaded = true;

test('script loaded', async () => {
  loaded = await page.evaluate(() => window['upgrades'] !== null);
  expect(loaded).toBe(true);
  expect(await page.evaluate(() => {
    return {}.toString.call(upgrades);
  })).toBe('[object Function]');
});

test('maxLevel', async () => {
  expect(loaded).toBe(true);
  const upgrades = await page.evaluate(() => upgrades({}));
  expect(upgrades.maxLevel).toEqual({
    type: fileData.length - 1,
    speed: 10,
    size: 10
  });
});

const testUpdatePrices = async (data) => await page.evaluate((data) => {
  game.generator = {
    getCurrentGen: () => fileData[data.type],
    getNextGen: () => fileData[data.type + 1]
  };
  let tmp = upgrades({genData: data});
  tmp.updatePrices();
  return tmp.prices;
}, data);

test('updatePrices base', async () => {
  expect(loaded).toBe(true);
  const prices = await testUpdatePrices({
    type: 0,
    speed: 0,
    size: 0
  });
  expect(prices.baseCost).toBe(10);
  expect(prices.type).toBePositiveNumber();
  expect(prices.speed).toBe(-1);
  expect(prices.size).toBe(-1);
});

test('updatePrices middle', async () => {
  expect(loaded).toBe(true);
  const prices = await testUpdatePrices({
    type: 1,
    speed: 4,
    size: 2
  });
  expect(prices.baseCost).toBe(10);
  expect(prices.type).toBePositiveNumber();
  expect(prices.speed).toBePositiveNumber();
  expect(prices.size).toBePositiveNumber();
});

test('updatePrices end', async () => {
  expect(loaded).toBe(true);
  const prices = await testUpdatePrices({
    type: fileData.length - 1,
    speed: maxLevel,
    size: maxLevel
  });
  expect(prices.baseCost).toBe(10);
  expect(prices.type).toBe(-1);
  expect(prices.speed).toBe(-1);
  expect(prices.size).toBe(-1);
});

const testUpgrade = async (data) => await page.evaluate((data) => {
  game.generator = {
    getCurrentGen: () => fileData[data.type],
    getNextGen: () => fileData[data.type + 1]
  };
  window.test1 = {genData: data};
  window.test2 = upgrades(window.test1);
  window.test2.updatePrices();
  return window.test2.prices;
}, data);

test('upgrade base', async () => {
  expect(loaded).toBe(true);
  const basePrices = await testUpgrade({
    type: 0,
    speed: 0,
    size: 0
  });
  const res = await page.evaluate(() => {
    window.test2.upgrade('speed');
    return [window.test1.genData, window.test2.prices];
  });
  expect(res[0]).toEqual({
    type: 0,
    speed: 1,
    size: 0
  });
  expect(res[1]).not.toEqual(basePrices);
});

test('upgrade max', async () => {
  expect(loaded).toBe(true);
  const basePrices = await testUpgrade({
    type: 0,
    speed: maxLevel,
    size: 0
  });
  const res = await page.evaluate(() => {
    window.test2.upgrade('speed');
    return [window.test1.genData, window.test2.prices];
  });
  expect(res[0]).toEqual({
    type: 0,
    speed: maxLevel,
    size: 0
  });
  expect(res[1]).toEqual(basePrices);
});

test('count', async () => {
  expect(loaded).toBe(true);
  const count = await page.evaluate(() => {
    let tmp = upgrades({
      genData: {
        type: 3,
        speed: 2,
        size: 1
      }
    });
    return tmp.count();
  });
  expect(count).toBe(6);
});

test('isMaxed', async () => {
  expect(loaded).toBe(true);
  let isMaxed = await page.evaluate(() => {
    let tmp = upgrades({
      genData: {
        type: 3,
        speed: 2,
        size: 1
      }
    });
    return tmp.isMaxed();
  });
  expect(isMaxed).toBe(false);
  isMaxed = await page.evaluate((maxLevel) => {
    let tmp = upgrades({
      genData: {
        type: fileData.length - 1,
        speed: maxLevel,
        size: maxLevel
      }
    });
    return tmp.isMaxed();
  }, maxLevel);
  expect(isMaxed).toBe(true);
});