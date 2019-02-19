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
    dev: false,
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

    upgrades: {
      type: {
        num: 4,
        html: '',
        bonus: 0,
        price: -1
      },
      speed: {
        num: 5,
        html: 'Upgrade speed',
        bonus: 100,
        price: -1
      },
      size: {
        num: 6,
        html: 'Upgrade size',
        bonus: 100,
        price: -1
      },
    },

    num2upgrade: {
      4: 'type',
      5: 'speed',
      6: 'size'
    },

    generator: {
      name: 'none',
      type: 0,
      tep: 0,
      speed: 1,
      size: 1,
      maxLevel: {}
    },
    easeTimeout: {},
    elements: {}
  },
  methods: {
    formatNumber: misc.formatNumber,
    /**
     * Test if a specific upgrade is affordable
     * @param {Object} u - upgrade
     */
    affordable: (u) => u.price > 0 && game.data.score >= u.price,
    /**
     * Get percentage of selected entropy meter
     * @param {number} n
     * @return {string}
     */
    getPercent: function (n) {
      return (this.entropy[n] * 100 / n).toFixed(3) + '%';
    },
    /**
     * Get text of selected entropy meter
     * @param {number} n
     * @return {string}
     */
    getText: function (n) {
      return this.entropy[n].toFixed(3) + ' / ' + n + ' bits';
    },
    /**
     * Get sum of entropy meters
     * @return {string}
     */
    getSum: function () {
      return misc.formatNumber(misc.sum(Object.values(this.entropy)));
    },
    /**
     * Format data to add spaces between chunks of 8 bits and line break after 32 bits
     * @param {string} data
     * @return {string}
     */
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
    /**
     * Create an ease effect on selected property
     * @param {Object} object
     * @param {string} key - name of property to change on object
     * @param {number} delta
     * @param {number} time
     * @param {boolean} add - add or return to initial value
     * @param {number} step
     */
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
    /**
     * KeyPress event
     * @param event
     */
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
        case '5':
        case '6':
          const name = self.num2upgrade[event.key];
          if (self.display.upgrades && self.affordable(self.upgrades[name])) {
            game.trigger('upgrade', name);
            self.flash(`#u_${name}`);
            self.score.oldscore = game.data.score;
          }
          return;
        default:
          return;
      }
    },
    /**
     * Add data to buffer
     * @param {string} data - binary data
     */
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
        self.steps.forEach((n) => self.entropy[n] = 0);
      }


      self.data = buffers[buffers.length - 1];

      self.input = self.getInput(self.data);
      self.steps.forEach(function (n) {
        if (self.data.length % n === 0)
          self.entropy[n] = misc.entropy(self.data, n);
      });
    },
    /**
     * Flash effect on object
     * @param {string} selector
     */
    flash: function (selector) {
      const self = this;
      if (!self.elements[selector])
        self.elements[selector] = $(selector);
      if (self.elements[selector]) {
        self.elements[selector]
          .removeClass('flash');
        setTimeout(function () {
          self.elements[selector]
            .addClass('flash');
        }, 0);
      }
    },
    /**
     * Write the previous chapters in the logs
     * @param {Object} story
     * @param {number} chapter
     */
    catchUpStory: function (story, chapter) {
      const self = this;

      if (chapter <= 0)
        return;

      Object.keys(story.uiDisplay).forEach(function (element) {
        if (chapter >= story.uiDisplay[element])
          self.display[element] = true;
      });

      let content = '';
      for (let i = 0; i < chapter; i++) {
        const chap = story.chapters[i];
        content += chap.content
          .replace(/(%\d*%)/gm, '100%')
          .replace(/ /gm, '&nbsp;')
          .replace(/(!\d*!)|(¤)|(§)|(£)|(\$)/gm, '');
      }

      self.logs = new Array(self.maxLogs).concat(content.split('\n'));
      self.logs = self.logs.slice(self.logs.length - self.maxLogs, self.logs.length);
    },
    /**
     * Play given chapter
     * @param {Object} story
     * @param {number} chapter
     */
    showStory: function (story, chapter) {
      const self = this;

      if (self.logs.length === 0)
        self.logs = new Array(self.maxLogs - 1).concat(['']);

      const chap = story.chapters[chapter];
      const start = self.storyParts.length === 0;
      self.storyParts = self.storyParts.concat(chap.content.split(/(!\d*!)|(%\d*%)|(¤)|(£)|(\n)|(\$.*\$)/gm).filter(x => x));
      if (chap.callback)
        self.storyChaps.push(chap);
      if (start)
        self.processStoryPart(0);
    },
    /**
     * Process given story part
     * @param {number} i
     */
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
    /**
     * Update score in UI
     * @param {number} score
     * @param {number} [delta]
     * @param {number} [avgBuffer] - last buffers average value
     */
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
    /**
     * Update generator in UI (I/O & upgrades)
     * @param {Object} generator
     */
    updateGenerator: function (generator) {
      const self = this;

      const gen = generator.getCurrentGen();

      self.generator = $.extend({
        name: gen.name,
        ep: gen.ep,
        maxLevel: self.generator.maxLevel
      }, generator.data);

      let nextGen;
      if ((nextGen = generator.getNextGen())) {
        self.upgrades.type.html = `Buy <u>${nextGen.name}</u>`;
        self.upgrades.type.bonus = gen.ep === 0 ? 0 : (100 * (nextGen.ep / gen.ep - 1)).toFixed(0);
      }
    },
    updatePrices: function (upgrades) {
      const self = this;

      self.generator.maxLevel = upgrades.maxLevel;

      Object.keys(self.upgrades).forEach(function (name) {
        self.upgrades[name].price = upgrades.prices[name];
      });
    }
  },
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

/**
 * @type {{name:string,count:number,tep:number,ep:number,pool:string,chances:number[]}[]}
 */
let fileData;
if (!$.browser.mobile) {
  $.getJSON('file_data/data.json', function (data) {
    fileData = data;
    console.log('Loaded file data');
  });

  //wait until fileData is loaded before starting
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