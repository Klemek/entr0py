Vue.component('prog', {
  template: '' +
  '<div class="progress">' +
  '<div v-bind:style="{width:percent}"></div>' +
  '<p v-html="text"></p>' +
  '</div>',
  props: ['percent', 'text']
});

function entropy(data, size) {
  if (data.length < size)
    return 0;
  const p = {};
  for (let i = 0; i < data.length; i += size) {
    const subd = data.substr(i, size);
    p[subd] = (p[subd] || 0) + 1;
  }

  let e = 0;
  const dataSize = Math.floor(data.length / size);
  console.log('');
  Object.keys(p).forEach(function (key) {
    const pi = p[key] / dataSize;
    e -= pi * Math.log2(pi);
  });

  return e;
}

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
    content: ''
  },
  methods: {
    getPercent: function (n) {
      return (this.entropy[n] * 100 / n).toFixed(3) + '%';
    },
    getText: function (n) {
      return this.entropy[n].toFixed(3) + ' / ' + n + ' bits';
    }
  },
  computed: {},
  created: function () {
    const self = this;
    document.addEventListener('keypress', (event) => {
      if (self.data.length >= 256) {
        self.data = '';
        self.content = '';
      }
      switch (event.key) {
        case '0':
          self.data += '0';
          self.content += '0';
          break;
        case '1':
          self.data += '1';
          self.content += '1';
          break;
        default:
          return;
      }
      if (self.data.length % 8 === 0)
        self.content += ' ';
      if (self.data.length % 32 === 0)
        self.content += '<br>';
      self.steps.forEach(function (n) {
        if (self.data.length % n === 0)
          self.entropy[n] = entropy(self.data, n);
      });
    });
  }
};