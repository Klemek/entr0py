const utils = require('./utils.js');

let page;
beforeAll(async () => {
  page = await utils.beforeAll();
});

afterAll(utils.afterAll);

describe('Cookies', () => {
  //pretend for individual tests
  let loaded = true;

  test('script loaded', async () => {
    loaded = await page.evaluate(() => window['cookies'] !== null);
    expect(loaded).toBe(true);
  });

  test('get cookie', async () => {
    expect(loaded).toBe(true);
    expect(await page.cookies()).toEqual([]);
    await page.setCookie({
      name: 'test1',
      value: encodeURIComponent('test test')
    });
    expect(await page.evaluate(() => cookies.get('test1'))).toBe('test test');
    await page.deleteCookie({name: 'test1'});
  });

  test('set cookie', async () => {
    expect(loaded).toBe(true);
    expect(await page.cookies()).toEqual([]);
    await page.evaluate(() => cookies.set('test1', 'test test'));
    const date = await page.evaluate(() => Date.now() / 1000);
    await page.evaluate(() => cookies.set('test2', 'test', 5));
    await page.evaluate(() => cookies.set('test2', 'test2', 6));
    let cs = {};
    (await page.cookies()).forEach(c => cs[c.name] = c);
    expect(Object.keys(cs).length).toBe(2);
    expect(cs['test1']).toBeDefined();
    expect(cs['test1'].value).toBe('test%20test');
    expect(cs['test1'].expires).toBe(-1);
    expect(cs['test2']).toBeDefined();
    expect(cs['test2'].value).toBe('test2');
    expect(Math.round(cs['test2'].expires)).toBe(Math.round(date + 6 * 60 * 60 * 24));
    await page.deleteCookie({name: 'test1'}, {name: 'test2'});
  });

  test('delete cookie', async () => {
    expect(loaded).toBe(true);
    expect(await page.cookies()).toEqual([]);
    await page.setCookie(
      {
        name: 'test1',
        value: 'test1'
      },
      {
        name: 'test2',
        value: 'test2'
      });
    await page.evaluate(() => cookies.delete('test1'));
    expect((await page.cookies()).length).toEqual(1);
    await page.deleteCookie({name: 'test2'});
  });

  test('clear cookies', async () => {
    expect(loaded).toBe(true);
    expect(await page.cookies()).toEqual([]);
    await page.setCookie(
      {
        name: 'test1',
        value: 'test1'
      },
      {
        name: 'test2',
        value: 'test2'
      });
    await page.evaluate(() => cookies.clear());
    expect(await page.cookies()).toEqual([]);
  });
});

describe('Miscellaneous', () => {
  //pretend for individual tests
  let loaded = true;

  test('script loaded', async () => {
    loaded = await page.evaluate(() => window['misc'] !== null);
    expect(loaded).toBe(true);
  });

  test('entropy', async () => {
    expect(loaded).toBe(true);
    expect(await page.evaluate(() => misc.entropy('0000', 1))).toBe(0);
    expect(await page.evaluate(() => misc.entropy('0011', 1))).toBe(1);
    expect(await page.evaluate(() => misc.entropy('00000000', 2))).toBe(0);
    expect(await page.evaluate(() => misc.entropy('00010001', 2))).toBe(1);
    expect(await page.evaluate(() => misc.entropy('00011011', 2))).toBe(2);
  });

  test('tobin', async () => {
    expect(loaded).toBe(true);
    expect(await page.evaluate(() => misc.tobin(0, 8))).toBe('00000000');
    expect(await page.evaluate(() => misc.tobin(5, 6))).toBe('000101');
  });

  test('randint', async () => {
    expect(loaded).toBe(true);
    expect(await page.evaluate(() => misc.randint(0, 0))).toBe(0);
    expect(await page.evaluate(() => {
      let val;
      for (let i = 0; i < 1000; i++) {
        val = misc.randint(-5, 5);
        if (val < -5 || val >= 5)
          return false;
      }
      return true;
    })).toBe(true);
  });

  test('randchar', async () => {
    expect(loaded).toBe(true);
    expect(await page.evaluate(() => {
      for (let i = 0; i < 1000; i++)
        if (!/^[a-z]$/.test(misc.randchar()))
          return false;
      return true;
    })).toBe(true);
  });

  test('randitem', async () => {
    expect(loaded).toBe(true);
    expect(await page.evaluate(() => misc.randitem([123]))).toBe(123);
    expect(await page.evaluate(() => {
      let arr = [4, 3, 2, 1];
      for (let i = 0; i < 1000; i++)
        if (!arr.includes(misc.randitem(arr)))
          return false;
      return true;
    })).toBe(true);
  });

  test('randchances', async () => {
    expect(loaded).toBe(true);
    expect(await page.evaluate(() => misc.randchances([0, 1, 0]))).toBe(1);
    expect(await page.evaluate(() => {
      let arr = [0.4, 0.3, 0.2, 0.1];
      let res = [0, 0, 0, 0];
      for (let i = 0; i < 1000; i++)
        res[misc.randchances(arr)]++;
      return res.map(n => Math.round(n / 100));
    })).toEqual([4, 3, 2, 1]);
  });

  test('times', async () => {
    expect(loaded).toBe(true);
    expect(await page.evaluate(() => misc.times('abc', 0))).toBe('');
    expect(await page.evaluate(() => misc.times('', 10))).toBe('');
    expect(await page.evaluate(() => misc.times('abc', 3))).toBe('abcabcabc');
  });

  test('pad', async () => {
    expect(loaded).toBe(true);
    expect(await page.evaluate(() => misc.pad('0', 'abcd', 4))).toBe('abcd');
    expect(await page.evaluate(() => misc.pad('0', '', 4))).toBe('0000');
    expect(await page.evaluate(() => misc.pad('0', 'ab', 4))).toBe('00ab');
  });

  test('padLeft', async () => {
    expect(loaded).toBe(true);
    expect(await page.evaluate(() => misc.padLeft('0', 'abcd', 4))).toBe('abcd');
    expect(await page.evaluate(() => misc.padLeft('0', '', 4))).toBe('0000');
    expect(await page.evaluate(() => misc.padLeft('0', 'ab', 4))).toBe('ab00');
  });

  test('formatNumber', async () => {
    expect(loaded).toBe(true);
    expect(await page.evaluate(() => misc.formatNumber(12.345))).toBe('12.35');
    expect(await page.evaluate(() => misc.formatNumber(1234567.89))).toBe('1,234,568');
  });

  test('compareVersions', async () => {
    expect(loaded).toBe(true);
    expect(await page.evaluate(() => misc.compareVersions('12.32.50', '12.32.50'))).toBe(true);
    expect(await page.evaluate(() => misc.compareVersions('12.32.50', '12.32.51'))).toBe(true);
    expect(await page.evaluate(() => misc.compareVersions('12.32.50', '12.33.50'))).toBe(true);
    expect(await page.evaluate(() => misc.compareVersions('12.32.50', '12.32.49'))).toBe(false);
    expect(await page.evaluate(() => misc.compareVersions('12.32.50', '12.31.50'))).toBe(false);
    expect(await page.evaluate(() => misc.compareVersions('12.32.50', '12.32.5'))).toBe(false);
    expect(await page.evaluate(() => misc.compareVersions('12.32.50', '12.32'))).toBe(false);
    expect(await page.evaluate(() => misc.compareVersions('12.33', '12.32.51'))).toBe(false);
    expect(await page.evaluate(() => misc.compareVersions('12.32.50', '12.33'))).toBe(true);
  });

  test('sum', async () => {
    expect(loaded).toBe(true);
    expect(await page.evaluate(() => misc.sum([]))).toBe(0);
    expect(await page.evaluate(() => misc.sum([23, 45, -12]))).toBe(56);
  });
});


describe('File data', () => {
  //pretend for individual tests
  let loaded = true;

  const sum = (array) => array.reduce((s, k) => s + k, 0);

  test('script loaded', async () => {
    loaded = await page.evaluate(() => window['fileData'] !== null);
    expect(loaded).toBe(true);
  });

  test('data loaded', async () => {
    expect(loaded).toBe(true);
    const fileData = await page.evaluate(() => fileData);
    expect(fileData).toBeDefined();
    expect(fileData.length).toBeGreaterThan(1);
    expect(fileData[0]).toEqual({
      'name': 'none',
      'count': 0,
      'tep': 0,
      'ep': 0,
      'pool': '',
      'chances': []
    });
    for (let i = 1; i < fileData.length; i++) {
      utils.notEmpty(fileData[i]['name']);
      utils.notZero(fileData[i]['count']);
      utils.notZero(fileData[i]['tep'], 15);
      utils.notZero(fileData[i]['ep'], 15);
      utils.notEmpty(fileData[i]['pool']);
      expect(typeof fileData[i]['chances']).toBe('object');
      expect(fileData[i]['chances'].length).toBeGreaterThan(0);
      expect(sum(fileData[i]['chances'])).toBeCloseTo(1, 4);
    }
  });
});