/* exported game */

/**
 * @type {{data: *, generator: object, upgrades:object, story:object, version: string, start: function, trigger: function, save: function}}
 */
const game = (function () {
  const version = '1.5';

  //load game from cookies
  let data;
  try {
    data = JSON.parse(atob(cookies.get('data')));
    console.log(`Loaded saved data (v${data.version}) at chapter ${data.chapter} with score ${data.score.toFixed(3)}`);
    if (!misc.compareVersions('1.5', data.version)) {
      console.log('Data previous to version v1.5, wiping it');
      data = undefined;
    } else {
      data.version = version;
    }
  } catch (u) {
  }

  if (!data) {
    data = {
      storyData: {},
      genData: {},
      chapter: 0,
      score: 0,
      version: version
    };
    console.log('Starting new game');
  }

  const self = {
    data: data,
    version: version,
    /**
     * Start game and update UI
     * @param {Object} app
     */
    start: function (app) {
      console.log(`entr0py v${version}`);

      app.updateScore(data.score);

      self.generator = generator(data.genData); //see generator.js
      data.genData = self.generator.data;
      self.generator.loop(); //start generator
      app.updateGenerator(self.generator);

      self.upgrades = upgrades(data); //see upgrades.js
      self.upgrades.updatePrices();
      app.updatePrices(self.upgrades);

      self.story = story(data.storyData); //see story.js
      data.storyData = self.story.data;
      app.catchUpStory(self.story, data.chapter);
      console.log(`Starting chapter ${data.chapter}`);
      app.showStory(self.story, data.chapter);

      setInterval(self.save, 10000);
    },
    /**
     * Trigger for every small events in the game
     * @param {string} type
     * @param {*} args
     */
    trigger: function (type, ...args) {
      switch (type) {
        case 'validate':
          const buffers = args[0];
          if (buffers.length < 1)
            return;
          let delta = 0;
          buffers.forEach(function (buffer) {
            [1, 2, 4, 8].forEach(function (n) {
              delta += misc.entropy(buffer, n);
            });
          });
          app.updateScore(data.score, delta, delta / buffers.length);
          data.score += delta;
          break;
        case 'upgrade':
          const price = self.upgrades.prices[args[0]];
          if (price && data.score >= price) {
            data.score -= price;
            self.upgrades.upgrade(args[0]);
            app.updateScore(data.score);
            app.updateGenerator(self.generator);
            app.updatePrices(self.upgrades);
          }
          break;
      }

      if (self.story.chapters[data.chapter].trigger(type)) {
        data.chapter++;
        console.log(`Starting chapter ${data.chapter}`);
        app.showStory(self.story, data.chapter);
      }
    },
    /**
     * Save game into cookies
     */
    save: function () {
      cookies.set('data', btoa(JSON.stringify(data)));
      console.log(`Game saved`);
    }
  };

  return self;
})();