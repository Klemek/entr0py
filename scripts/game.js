/* exported game */

const game = (function () {

  const self = {
    story:{},
    chapter:1,
    start:function(app){
      app.showStory(self.chapter);
    }
  };

  self.story = story(self); //see story.js

  self.chapter = 1;

  return self;
})();