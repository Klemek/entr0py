const puppeteer = require('puppeteer');
const express = require('express');
const server = express();
const fs = require('fs');

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
    await server.server.close();
  },
  visibleUI: async () => await utils.page.evaluate(() => $(':visible').toArray().filter(e => e.id).map(e => e.id))
};

module.exports = utils;