/* exported app */

Vue.component('prog', {
  template: '' +
  '<div class="progress">' +
  '<div v-bind:style="{width:percent}"></div>' +
  '<p v-html="text"></p>' +
  '</div>',
  props: ['percent', 'text']
});

let app = {
  el: '#app',
  data: {
    steps: [1, 2, 4, 8],
    entropy: {
      1: 0,
      2: 0,
      4: 0,
      8: 0
    },
    data: '',
    input: '',
    logs: [],
    maxLogs: 15,
    logsInput: false,
    display: {
      meters: false,
      input: false,
      score: false,
      io: false,
      upgrades: false
    },
    game: game,
    storyParts: [],
    storyChaps: [],
    score: {
      value: 0,
      lastBufferAvg: 0,
      size: 1.2,
      defaultSize: 1.2,
      sizeDelta: 9,
      easeTime: 1000,
      speed: 0,
      oldscore: 0,
      useTimedAverage: false,
      lastBufferDate: undefined,
    },

    random: {
      name: 'none',
      type: 0,
      tep: 0,
      speed: 1,
      size: 1,
      prices: {
        type: -1,
        speed: -1,
        size: -1
      }
    },
    easeTimeout: {},
    elements: {}
  },
  methods: {
    formatNumber: misc.formatNumber,
    getPercent: function (n) {
      return (this.entropy[n] * 100 / n).toFixed(3) + '%';
    },
    getText: function (n) {
      return this.entropy[n].toFixed(3) + ' / ' + n + ' bits';
    },
    getSum: function () {
      return misc.formatNumber(Object.values(this.entropy).reduce((a, b) => a + b, 0));
    },
    getInput: function (data) {
      return misc
        .padLeft(' ', data, 256)
        .match(/.{32}/g)
        .map(l =>
          l.match(/.{8}/g)
            .join(' ')
            .replace(/ /g, '&nbsp;')
        ).join('<br>');
    },
    ease: function (object, key, delta, time, add = true, step = 20.0) {
      const self = this;
      clearTimeout(self.easeTimeout[key]);
      time = time / step;
      const start = object[key];
      const k = 6 * delta / Math.pow(time, 3);
      const m = (3 * delta) / (2 * time);
      const f = (x) => -k * Math.pow(x - time / 2, 2) + m;
      let i = 1;
      const loop = function () {
        if (i <= 0) {
          object[key] = start + (add ? delta : 0);
          return;
        }
        const v = f(i++);
        if (v <= 0)
          i = 0;
        else
          object[key] = (add ? object[key] : start) + v;
        self.easeTimeout[key] = setTimeout(loop, step);
      };
      loop();
    },
    keypress: function (event) {
      const self = this;
      switch (event.key) {
        case '0':
          if (self.display.input) {
            game.trigger('type');
            self.inputData('0');
          }
          return;
        case '1':
          if (self.display.input) {
            game.trigger('type');
            self.inputData('1');
          }
          return;
        case '4':
          if (self.display.upgrades && game.random.prices.type >= 0 && game.data.score > game.random.prices.type) {
            game.trigger('upgrade', 'type');
            self.flash('#u_type', game.random.prices.type && game.data.score > game.random.prices.type ? 0.15 : 0.05);
            self.score.oldscore = game.data.score;
          }
          return;
        case '5':
          if (self.display.upgrades && game.random.prices.speed >= 0 && game.data.score > game.random.prices.speed) {
            game.trigger('upgrade', 'speed');
            self.flash('#u_speed', game.random.prices.speed && game.data.score > game.random.prices.speed ? 0.15 : 0.05);
            self.score.oldscore = game.data.score;
          }
          break;
        case '6':
          if (self.display.upgrades && game.random.prices.size >= 0 && game.data.score > game.random.prices.size) {
            game.trigger('upgrade', 'size');
            self.flash('#u_size', game.random.prices.size && game.data.score > game.random.prices.size >= 0 ? 0.15 : 0.05);
            self.score.oldscore = game.data.score;
          }
          break;
        default:
          return;
      }
    },
    inputData: function (data) {
      const self = this;

      let buffers = (self.data + data).match(/.{1,256}/g);
      if (buffers.length > 1) {
        game.trigger('validate', buffers.slice(0, buffers.length - 1));
        self.flash('#buffer');
        if (!self.score.useTimedAverage) {
          if (buffers.length > 2) {
            self.score.useTimedAverage = true;
          } else {
            if (self.score.lastBufferDate) {
              const time = (new Date().getTime() - self.score.lastBufferDate) / 1000;
              self.score.speed = (game.data.score - self.score.oldscore) / time;
              if (time < 0.5)
                self.score.useTimedAverage = true;
            }
            self.score.oldscore = game.data.score;
            self.score.lastBufferDate = new Date().getTime();
          }
        }
      }


      self.data = buffers[buffers.length - 1];

      self.input = self.getInput(self.data);
      self.steps.forEach(function (n) {
        if (self.data.length % n === 0)
          self.entropy[n] = misc.entropy(self.data, n);
      });
    },
    flash: function (element, endAlpha = 0.05) {
      const self = this;
      if (!self.elements[element])
        self.elements[element] = $(element);
      if (self.elements[element])
        self.elements[element]
          .stop()
          .css('background-color', 'rgba(255, 255, 255, 0.3)')
          .animate({backgroundColor: `rgba(255, 255, 255, ${endAlpha})`}, 500,
            () => self.elements[element].css('background-color', ''));
    },
    catchUpStory: function (story, n) {
      const self = this;

      if (n <= 0)
        return;

      Object.keys(story.uiDisplay).forEach(function (element) {
        if (n >= story.uiDisplay[element])
          self.display[element] = true;
      });

      let content = '';
      for (let i = 0; i < n; i++) {
        const chap = story.chapters[i];
        content += chap.content
          .replace(/(%\d*%)/gm, '100%')
          .replace(/ /gm, '&nbsp;')
          .replace(/(!\d*!)|(¤)|(§)|(£)|(\$)/gm, '');
      }

      self.logs = new Array(self.maxLogs).concat(content.split('\n'));
      self.logs = self.logs.slice(self.logs.length - self.maxLogs, self.logs.length);
    },
    showStory: function (story, n) {
      const self = this;

      if (self.logs.length === 0)
        self.logs = new Array(self.maxLogs - 1).concat(['']);

      const chap = story.chapters[n];
      const start = self.storyParts.length === 0;
      self.storyParts = self.storyParts.concat(chap.content.split(/(!\d*!)|(%\d*%)|(¤)|(£)|(\n)|(\$.*\$)/gm).filter(x => x));
      if (chap.callback)
        self.storyChaps.push(chap);
      if (start)
        self.processStoryPart(0);
    },
    processStoryPart: function (i) {
      const self = this;
      if (i >= self.storyParts.length) {
        self.storyParts = [];
        return;
      }

      const lastLog = () => self.logs[self.logs.length - 1];
      const appendLog = (text) => Vue.set(self.logs, self.logs.length - 1, lastLog() + text);
      const replaceLog = (text) => Vue.set(self.logs, self.logs.length - 1, text);

      const p = self.storyParts[i];
      switch (p[0]) {
        case '!': //wait
          const time = parseInt(p.substr(1, p.length - 2));
          setTimeout(function () {
            self.processStoryPart(i + 1);
          }, time);
          return;
        case '%':
          const time2 = parseInt(p.substr(1, p.length - 2)) / 100.0;
          const percent = function (j) {
            if (j > 0)
              replaceLog(lastLog().substr(0, lastLog().length - 3));
            appendLog(('0' + j).substr(j === 100 ? -3 : -2) + '%');
            if (j < 100)
              setTimeout(function () {
                percent(j + 1);
              }, time2);
            else
              self.processStoryPart(i + 1);
          };
          percent(0);
          return;
        case '$': //typing
          const text = p.substr(1, p.length - 2);
          const typing = function (j) {
            appendLog(text[j]);
            if (j < text.length - 1)
              setTimeout(function () {
                typing(j + 1);
              }, misc.randint(40, 60));
            else
              self.processStoryPart(i + 1);
          };
          setTimeout(function () {
            typing(0);
          }, misc.randint(40, 60));
          return;
        case '£':
          self.logsInput = !self.logsInput;
          break;
        case '¤':
          self.storyChaps.splice(0, 1)[0].callback();
          game.trigger('callback');
          break;
        case '\n':
          self.logs = self.logs.concat(['']).slice(1);
          break;
        default:
          appendLog(p.replace(/ /g, '&nbsp;'));
          break;
      }
      self.processStoryPart(i + 1);
      self.$forceUpdate();
    },
    updateScore: function (score, delta, avgBuffer) {
      const self = this;

      if (self.score.value === 0)
        self.score.oldscore = score;
      self.score.value = score;
      self.score.size = self.score.defaultSize;

      if (avgBuffer)
        self.score.lastBufferAvg = avgBuffer;

      if (delta) {

        self.ease(self.score, 'value', delta, self.score.easeTime);
        self.ease(self.score, 'size', self.score.sizeDelta, self.score.easeTime, false);
      }
    },
    updateRandom: function (random) {
      const self = this;

      self.random = $.extend({
        name: random.generators[random.data.type].name,
        ep: random.generators[random.data.type].ep,
        prices: random.prices,
        maxLevel: random.maxLevel,
        maxType: random.maxType
      }, random.data);

      if (random.data.type < random.generators.length - 1)
        self.random.nextType = random.generators[random.data.type + 1].name;
    }
  },
  computed: {},
  mounted: function () {
    const self = this;
    $('#loading').hide();
    $('#app').show();
    document.addEventListener('keypress', self.keypress);
    self.input = self.getInput(self.data);
    game.start(this);

    setInterval(function () {
      if (self.score.useTimedAverage) {
        self.score.speed = game.data.score - self.score.oldscore;
        self.score.oldscore = game.data.score;
      }
    }, 1000);
  }
};

let fileData;
if (!$.browser.mobile) {
  $.getJSON('file_data/data.json', function (data) {
    fileData = data;
    console.log('Loaded file data');
  });

  $(document).ready(function () {
    const waitInterval = setInterval(function () {
      if (fileData) {
        clearInterval(waitInterval);
        app = new Vue(app);
      }
    }, 100);
  });
} else {
  $(document).ready(function () {
    $('#loading').hide();
    $('#mobile').show();
  });
}