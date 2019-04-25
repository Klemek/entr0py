const puppeteer = require('puppeteer');
const express = require('express');
const server = express();
const fs = require('fs');

let browser;
let page;

const currentVersion = '1.5';
const showPageLogs = true;


const visibleUI = async () => await page.evaluate(() => $(':visible').toArray().filter(e => e.id).map(e => e.id));

beforeAll(async () => {
  server.use(express.static('..'));
  server.server = await server.listen(4444);

  browser = await puppeteer.launch();
  page = await browser.newPage();
  if (showPageLogs)
    page.on('console', msg => {
      const location = msg.location();
      const file = location.url.split('/').reverse()[0];
      console.log(`console.${msg.type()} ${file}:${location.lineNumber} > ${msg.text()}`);
    });

  await page.evaluateOnNewDocument(fs.readFileSync('./node_modules/lolex/lolex.js', 'utf8'));
  await page.evaluateOnNewDocument(fs.readFileSync('./preload.js', 'utf8'));

  await page.goto('http://127.0.0.1:4444');
});

afterAll(async () => {
  await browser.close();
  server.server.close();
});

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
    const visible = await visibleUI();
    expect(visible).toEqual(['loading']);
  });
});

describe('Fresh game', () => {
  beforeAll(async () => {
    //start Vue
    await page.evaluate(() => window.clock.runToLast());
    await page.evaluate(() => window.clock.runToLast());
  });

  const globals = {
    gameCreated: false,
    appInstancied: false
  };

  test('page title', async () => {
    expect(await page.title()).toBe('entr0py');
  });

  test('app instanced', async () => {
    expect(await page.evaluate(() => typeof window.app)).toBe('object');
    expect(await page.evaluate(() => typeof app.$forceUpdate)).toBe('function');
    globals.appInstancied = true;
  });

  test('game started', async () => {
    expect(await page.evaluate(() => window['game'] !== null)).toBe(true);
    globals.gameCreated = true;
    expect(await page.evaluate(() => typeof game.generator)).toBe('object');
    expect(await page.evaluate(() => typeof game.upgrades)).toBe('object');
    expect(await page.evaluate(() => typeof game.story)).toBe('object');
  });

  test('correct game state', async () => {
    expect(globals.gameCreated).toBe(true);
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
    expect(globals.appInstancied).toBe(true);
    expect(await page.evaluate(() => app.display)).toEqual({
      meters: false,
      input: false,
      score: false,
      io: false,
      upgrades: false
    });
  });

  test('correct UI shown', async () => {
    const visible = await visibleUI();
    expect(visible).toEqual(['app', 'app_container', 'logs', 'version']);
  });
});