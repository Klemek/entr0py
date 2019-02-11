/* exported game */

const game = (function () {

  let data;
  try {
    data = JSON.parse(atob(cookies.get('data')));
    console.log(`Loaded saved data at chapter ${data.chapter} with score ${data.score.toFixed(3)}`);
  } catch (u) {
    data = {
      storyData: {},
      chapter: 0,
      score: 0
    };
    console.log('Starting new game');
  }

  const self = {
    data: data,
    start: function (app) {
      self.story = story(data.storyData); //see story.js
      data.storyData = self.story.data;
      app.updateScore(data.score);
      app.catchUpStory(self.story, data.chapter);
      console.log(`Starting chapter ${data.chapter}`);
      app.showStory(self.story, data.chapter);
    },
    trigger: function (type, ...args) {
      if (type === 'validate') {
        const inputData = args[0];
        let delta = 0;
        [1, 2, 4, 8].forEach(function (n) {
          delta += misc.entropy(inputData, n);
        });
        app.updateScore(data.score, delta);
        data.score += delta;
        self.save();
      }

      if (self.story.chapters[data.chapter].trigger(data, type)) {
        data.chapter++;
        console.log(`Starting chapter ${data.chapter}`);
        self.save();
        app.showStory(self.story, data.chapter);
      }
    },
    save: function () {
      cookies.set('data', btoa(JSON.stringify(data)));
      console.log(`Game saved (chapter:${data.chapter}/score:${data.score.toFixed(3)})`);
    }
  };

  return self;
})();