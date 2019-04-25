const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

let browser;
let page;

beforeAll(async () => {
  app.use(express.static('..'));
  app.server = await app.listen(4444);

  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://127.0.0.1:4444');
});

afterAll(async () => {
  await browser.close();
  app.server.close();
});

describe('Sample test', () => {
  test('page title', async () => {
    expect(await page.title()).toBe('entr0py');
  });
});