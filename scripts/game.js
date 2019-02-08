/* exported game */

const game = (function () {

  const self = {
    story: {},
    chapter: 1,
    score: 0,
    start: function (app) {
      app.showStory(self.chapter);
    },
    trigger: function (type, ...args) {
      if (type === 'validate') {
        const data = args[0];
        let delta = 0;
        [1, 2, 4, 8].forEach(function (n) {
          delta += misc.entropy(data, n);
        });
        app.updateScore(self.score, delta);
        self.score += delta;
      }

      if (self.story.chapters[self.chapter].trigger(type)) {
        self.chapter++;
        app.showStory(self.chapter);
      }
    }
  };

  self.story = story(self); //see story.js
  self.chapter = 1;

  return self;
})();