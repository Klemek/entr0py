const utils = require('./utils.js');

const maxSpeed = 10;
const maxRealSpeed = 5;

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
  loaded = await page.evaluate(() => window['generator'] !== null);
  expect(loaded).toBe(true);
  expect(await page.evaluate(() => {
    return {}.toString.call(generator);
  })).toBe('[object Function]');
});

test('init:new', async () => {
  expect(loaded).toBe(true);
  const generator = await page.evaluate(() => generator());
  expect(typeof generator).toBe('object');

  expect(typeof generator['data']).toBe('object');
  expect(generator['data']['type']).toBe(0);
  expect(generator['data']['speed']).toBe(0);
  expect(generator['data']['size']).toBe(0);
});

test('init:from data', async () => {
  expect(loaded).toBe(true);
  const generator = await page.evaluate(() => generator({
    'type': 1,
    'speed': 2,
    'size': 3
  }));
  expect(typeof generator).toBe('object');

  expect(typeof generator['data']).toBe('object');
  expect(generator['data']['type']).toBe(1);
  expect(generator['data']['speed']).toBe(2);
  expect(generator['data']['size']).toBe(3);
});

test('fileData', async () => {
  expect(loaded).toBe(true);
  expect(await page.evaluate(() => generator().generators)).toEqual(fileData);
});

test('getCurrentGen/getNextGen', async () => {
  expect(loaded).toBe(true);
  await page.evaluate(() => {
    window.test = generator();
  });

  expect(await page.evaluate(() => window.test.getCurrentGen())).toEqual(fileData[0]);
  expect(await page.evaluate(() => window.test.getNextGen())).toEqual(fileData[1]);

  await page.evaluate(() => {
    window.test.data.type = 3;
  });

  expect(await page.evaluate(() => window.test.getCurrentGen())).toEqual(fileData[3]);
  expect(await page.evaluate(() => window.test.getNextGen())).toEqual(fileData[4]);
});

test('getNext', async () => {
  expect(loaded).toBe(true);
  await page.evaluate(() => {
    window.test = generator();
  });

  expect(await page.evaluate(() => window.test.getNext())).toBe('');

  await page.evaluate(() => {
    window.test.data.type = 1; //only a
    window.test.data.size = 4; //bytes
  });

  expect(await page.evaluate(() => window.test.getNext())).toBe('0110000101100001'); //aa
});

test('loop', async () => {
  expect(loaded).toBe(true);
  await page.evaluate(() => {
    app = undefined; //cancel Vue
    window.clock.runToLast();
    window.clock.runToLast();
    app = {
      buffer: [],
      inputData: data => {
        app.buffer.push(data);
      }
    };
    window.test = generator({
      type: 0,
      size: 2,
      speed: 0
    });
    window.test.loop();
  });

  expect(await page.evaluate(() => app.buffer)).toEqual([]);

  await page.evaluate(() => window.clock.tick(10000));

  expect(await page.evaluate(() => app.buffer)).toEqual([]);

  await page.evaluate(() => {
    window.test.data.type = 1;
    window.clock.tick(2000);
  });

  expect(await page.evaluate(() => app.buffer)).toEqual(['0110', '0001']);

  let res;
  const process = (speed) => {
    app.buffer = [];
    window.test.data.speed = speed;
    window.clock.tick(5000);
    return [app.buffer.length, app.buffer[0].length];
  };
  for (let speed = 1; speed <= maxSpeed; speed++) {
    res = await page.evaluate(process, speed);
    if (speed <= maxRealSpeed) {
      expect(res[0] / 5).toBeCloseTo(Math.pow(2, speed), 0);
      expect(res[1]).toBe(4);
    } else {
      expect(res[0] / 5).toBeCloseTo(32, 0);
      expect(res[1]).toBe(Math.pow(2, 2 + speed - maxRealSpeed));
    }
  }
});