const puppeteer = require('puppeteer');
const express = require('express');
const server = express();
const fs = require('fs');

expect.extend({
  toBeNotEmptyString(received) {
    const pass = typeof received === 'string' && received.length > 0;
    return {
      message: () =>
        pass ? `expected '${received}' to be not string or empty` : `expected '${received}' to be string and not empty`,
      pass: pass,
    };
  },
  toBePositiveNumber(received, max = null) {
    const pass = typeof received === 'number' && received > 0 && (!max || received < max);
    return {
      message: () =>
        max ?
          (pass ?
            `expected ${received} to be not number or more than ${max} or not positive` :
            `expected ${received} to be number and positive less than ${max}`) :
          (pass ?
            `expected ${received} to be not number nor positive` :
            `expected ${received} to be number and positive`),
      pass: pass,
    };
  }
});


const utils = {
  showPageLogs: true,
  beforeAll: async () => {

    server.use(express.static('..'));
    server.server = await server.listen(4444).on('error', () => {
    });

    utils.browser = await puppeteer.launch();
    utils.page = await utils.browser.newPage();
    utils.page.on('console', msg => {
      if (!utils.showPageLogs)
        return;
      const location = msg.location();
      const file = location.url.split('/').reverse()[0];
      console.log(`console.${msg.type()} ${file}:${location.lineNumber} > ${msg.text()}`);
    });

    await utils.page.evaluateOnNewDocument(fs.readFileSync('./node_modules/lolex/lolex.js', 'utf8'));
    await utils.page.evaluateOnNewDocument(fs.readFileSync('./preload.js', 'utf8'));

    await utils.page.goto('http://127.0.0.1:4444');

    return utils.page;
  },
  afterAll: async () => {
    await utils.browser.close();
  },
  visibleUI: async () => await utils.page.evaluate(() => $(':visible').toArray().filter(e => e.id).map(e => e.id))
};

module.exports = utils;