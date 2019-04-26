const utils = require('./utils.js');

const currentVersion = '1.5';

let page;
beforeAll(async () => {
  page = await utils.beforeAll();
});

afterAll(utils.afterAll);

describe('Starting page', () => {
  test('page title', async () => {
    expect(await page.title()).toBe('entr0py');
  });

  test('scripts loaded', async () => {

    expect(await page.evaluate(() => typeof window.$)).toBe('function');
    expect(await page.evaluate(() => typeof window.Vue)).toBe('function');

    //dunno why typeof doesn't work
    expect(await page.evaluate(() => window['game'] !== null)).toBe(true);
    expect(await page.evaluate(() => window['generator'] !== null)).toBe(true);
    expect(await page.evaluate(() => window['upgrades'] !== null)).toBe(true);
    expect(await page.evaluate(() => window['story'] !== null)).toBe(true);

    expect(await page.evaluate(() => typeof window.app)).toBe('object');
  });

  test('correct UI shown', async () => {
    const visible = await utils.visibleUI();
    expect(visible).toEqual(['loading']);
  });
});

describe('Fresh game', () => {
  beforeAll(async () => {
    //start Vue
    await page.evaluate(() => window.clock.runToLast());
    await page.evaluate(() => window.clock.runToLast());
  });

  //pretend for individual tests
  let gameCreated = true;
  let appInstanced = true;

  test('page title', async () => {
    expect(await page.title()).toBe('entr0py');
  });

  test('app instanced', async () => {
    expect(await page.evaluate(() => typeof window.app)).toBe('object');
    appInstanced = await page.evaluate(() => typeof app.$forceUpdate === 'function');
    expect(appInstanced).toBe(true);
  });

  test('game started', async () => {
    gameCreated = await page.evaluate(() => window['game'] !== null);
    expect(gameCreated).toBe(true);
    expect(await page.evaluate(() => typeof game.generator)).toBe('object');
    expect(await page.evaluate(() => typeof game.upgrades)).toBe('object');
    expect(await page.evaluate(() => typeof game.story)).toBe('object');
  });

  test('correct game state', async () => {
    expect(gameCreated).toBe(true);
    const gameData = await page.evaluate(() => game.data);
    expect(gameData.chapter).toBe(0);
    expect(gameData.score).toBe(0);
    expect(gameData.version).toBe(currentVersion);
    expect(gameData.genData).toEqual({
      type: 0,
      speed: 0,
      size: 0
    });
  });

  test('correct UI state', async () => {
    expect(appInstanced).toBe(true);
    expect(await page.evaluate(() => app.display)).toEqual({
      meters: false,
      input: false,
      score: false,
      io: false,
      upgrades: false
    });
  });

  test('correct UI shown', async () => {
    const visible = await utils.visibleUI();
    expect(visible).toEqual(['app', 'app_container', 'logs', 'version']);
    //TODO more defined
  });
});