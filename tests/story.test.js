const utils = require('./utils.js');

let page;
beforeAll(async () => {
  page = await utils.beforeAll();
});

afterAll(utils.afterAll);

//pretend for individual tests
let loaded = true;

test('script loaded', async () => {
  loaded = await page.evaluate(() => window['story'] !== null);
  expect(loaded).toBe(true);
});

test('story check', async () => {
  expect(loaded).toBe(true);
  const story = await page.evaluate(() => story());
  expect(typeof story).toBe('object');

  const uiKeys = ['input', 'meters', 'score', 'io', 'upgrades'];
  expect(typeof story['uiDisplay']).toBe('object');
  uiKeys.forEach(key => expect(story['uiDisplay'][key]).toBePositiveNumber());

  expect(typeof story['chapters']).toBe('object');
  expect(story['chapters'].length).toBeGreaterThan(0);

  story['chapters'].forEach(chapter => expect(typeof chapter['content']).toBe('string'));

  expect(await page.evaluate(() => {
    const s = story();
    let pass = true;
    const callable = fn => fn && {}.toString.call(fn) === '[object Function]';
    s.chapters.forEach((chapter, i) => {
      if (!pass)
        return;
      if (!callable(chapter['trigger'])) {
        pass = false;
        console.log(`chapter ${i} have no trigger`);
      }
      if (chapter['content'].includes('¤') && !callable(chapter['callback'])) {
        pass = false;
        console.log(`chapter ${i} have no callback despite being declared`);
      }
    });
    return pass;
  })).toBe(true);
});


test('get new story', async () => {
  expect(loaded).toBe(true);
  const story = await page.evaluate(() => story());
  expect(typeof story).toBe('object');

  expect(typeof story['data']).toBe('object');
  expect(story['data']['playerName']).toBeNotEmptyString();
  expect(story['data']['softVersion']).toBeNotEmptyString();
  expect(story['data']['creatorName']).toBeNotEmptyString();
});

test('get story from data', async () => {
  expect(loaded).toBe(true);
  const story = await page.evaluate(() => story({
    'playerName': 'test1',
    'softVersion': 'test2',
    'creatorName': 'test3'
  }));
  expect(typeof story).toBe('object');

  expect(typeof story['data']).toBe('object');
  expect(story['data']['playerName']).toBe('test1');
  expect(story['data']['softVersion']).toBe('test2');
  expect(story['data']['creatorName']).toBe('test3');
});