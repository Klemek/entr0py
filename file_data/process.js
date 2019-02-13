const fs = require('fs');
const rootpath = require('path').dirname(process.argv[1]);

const misc = {
  entropy: function (data, size) {
    if (data.length < size)
      return 0;
    const p = {};
    for (let i = 0; i < data.length; i += size) {
      const subd = data.substr(i, size);
      p[subd] = (p[subd] || 0) + 1;
    }

    let e = 0;
    const dataSize = Math.floor(data.length / size);
    Object.keys(p).forEach(function (key) {
      const pi = p[key] / dataSize;
      e -= pi * Math.log2(pi);
    });

    return e;
  },
  tobin: (dec) => misc.pad('0', (dec >>> 0).toString(2), 8),
  times: (string, times) => new Array(times + 1).join(string),
  pad: (char, string, size) => (misc.times(char, size) + string).substr(-size),
  initArray: (start, end, step = 1) =>
    Array.from({length: Math.ceil((end - start + 1) / step)}, (v, i) => i * step + start),
  randchances: function (array) {
    const v = Math.random();
    let i = 0;
    let s = 0;
    while (s < v && i < array.length)
      s += array[i++];
    return i - 1;
  }
};

const files = {};

const readFile = function (fname, name) {
  if (!name)
    name = fname;

  files[name] = files[name] || {
    name: name,
    data: {},
    count: 0,
    binary: ''
  };

  let content;

  if (fname === '/dev/random') {
    console.log(`\treading fake /dev/random`);
    content = misc.initArray(0, 255).map(x => String.fromCharCode(x)).join(''); //perfect random
  } else {
    console.log(`\treading ${fname}`);
    content = fs.readFileSync(`${rootpath}/${fname}`, 'utf-8');
  }

  const file = files[name];

  content.split('').forEach(function (char) {
    file.data[char] = (file.data[char] || 0) + 1;
    file.count++;
  });

  file.binary = file.binary + content.split('').map(x => misc.tobin(x.charCodeAt(0) >>> 0)).join('');
};

console.log('reading files...');

['letter_a.txt', 'author.txt', 'pi.txt', 'english_words.csv', '/dev/random'].forEach((file) => readFile(file));
['../index.html', '../scripts/game.js', '../scripts/globals.js',
  '../scripts/random.js', '../scripts/story.js', '../scripts/ui.js'].forEach((file) => readFile(file, 'source_code.js'));
[].forEach((file) => readFile(file));

console.log('calculating data...');

const names = Object.keys(files);

const getEP = (binary) => [1, 2, 4, 8].map(n => misc.entropy(binary, n)).reduce((s, n) => s + n);

names.forEach(function (name) {
  const file = files[name];

  console.log(`\tfile ${name}`);

  const chars = Object.keys(file.data);
  chars.forEach((char) => file.data[char] /= file.count);
  file.pool = chars.join('');
  file.chances = chars.map(c => file.data[c]);

  delete file.data;

  console.log(`\t\t${file.pool.length} chars`);

  file.tep = getEP(file.binary); //theorical EP

  delete file.binary;

  console.log(`\t\t${file.tep.toFixed(3)} EP (theorical)`);


  let ep = 0;
  for (let i = 0; i < 10000; i++) {
    let buffer = '';
    while (buffer.length < 256) {
      const c = file.pool[misc.randchances(file.chances)];
      buffer += misc.tobin(c.charCodeAt(0), 8);
    }
    ep += getEP(buffer) / 10000;
  }

  file.ep = ep;

  console.log(`\t\t${file.ep.toFixed(3)} EP (practical)`);
});

files['none'] = {
  name: 'none',
  count: 0,
  tep: 0,
  ep: 0,
  pool: '',
  chances: []
};
names.push('none');

console.log('sorting data');

names.sort((n1, n2) => files[n1].ep - files[n2].ep);
const output = names.map(n => files[n]);

console.log(`writing data.json`);

fs.writeFileSync(`${rootpath}/data.json`, JSON.stringify(output, null, 2));

console.log('done');