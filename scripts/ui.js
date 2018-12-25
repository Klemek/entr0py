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
    logs: '',
    logsInput: false,
    display:{
      meters:false,
      input:false,
    },
    game:game,
    storyParts: [],
    storyChaps: []
  },
  methods: {
    getPercent: function (n) {
      return (this.entropy[n] * 100 / n).toFixed(3) + '%';
    },
    getText: function (n) {
      return this.entropy[n].toFixed(3) + ' / ' + n + ' bits';
    },
    keypress: function (event) {
      const self = this;
      if (!self.display.input)
        return;
      if (self.data.length >= 256) {
        game.trigger('validate', self.data);
        self.data = '';
        self.input = '';
      }
      switch (event.key) {
        case '0':
          self.data += '0';
          self.input += '0';
          game.trigger('type');
          break;
        case '1':
          self.data += '1';
          self.input += '1';
          game.trigger('type');
          break;
        default:
          return;
      }
      if (self.data.length % 8 === 0)
        self.input += ' ';
      if (self.data.length % 32 === 0)
        self.input += '<br>';
      self.steps.forEach(function (n) {
        if (self.data.length % n === 0)
          self.entropy[n] = misc.entropy(self.data, n);
      });
    },
    showStory: function (n) {
      const self = this;
      const chap = game.story.chapters[n];
      const start = self.storyParts.length === 0;
      self.storyParts = self.storyParts.concat(chap.content.split(/(!\d*!)|(%\d*%)|(¤)|(§)|(£)|(\$.*\$)/gm).filter(x => x));
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
              self.logs = self.logs.substr(0, self.logs.length - 3);
            self.logs += ('0' + j).substr(j === 100 ? -3 : -2) + '%';
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
            self.logs += text[j];
            if (j < text.length - 1)
              setTimeout(function () {
                typing(j + 1);
              }, misc.randint(50, 100));
            else
              self.processStoryPart(i + 1);
          };
          setTimeout(function () {
            typing(0);
          }, misc.randint(50, 100));
          return;
        case '£':
          self.logsInput = !self.logsInput;
          break;
        case '¤':
          self.storyChaps.splice(0, 1)[0].callback();
          break;
        case '§': //clear
          self.logs = '';
          break;
        default:
          self.logs += p.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
          break;
      }
      self.processStoryPart(i + 1);
    },
  },
  computed: {},
  created: function () {
    document.addEventListener('keypress', this.keypress);
    game.start(this);
  }
};