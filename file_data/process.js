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
    Array.from({length: Math.ceil((end - start + 1) / step)}, (v, i) => i * step + start)
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

  if (fname === '/dev/urandom') {
    console.log(`\treading fake /dev/urandom`);
    content = misc.initArray(120, 255).map(x => String.fromCharCode(x)).join(''); //removing entropy from perfect
  } else if (fname === '/dev/random') {
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

['letter_a.txt', 'author.txt', 'pi.txt', 'english_words.csv', 'long_story.txt'].forEach((file) => readFile(file));
['../index.html', '../scripts/game.js', '../scripts/globals.js',
  '../scripts/random.js', '../scripts/story.js', '../scripts/ui.js'].forEach((file) => readFile(file, 'source_code.js'));
[].forEach((file) => readFile(file));

console.log('calculating data...');

const names = Object.keys(files);

names.forEach(function (name) {
  const file = files[name];

  let ep = 0;
  [1, 2, 4, 8].forEach((n) => ep += misc.entropy(file.binary, n));
  file.ep = ep;

  delete file.binary;

  console.log(`\t${name}:${ep}`);

  const chars = Object.keys(file.data);
  chars.forEach((char) => file.data[char] /= file.count);
  file.pool = chars.join('');
  file.chances = chars.map(c => file.data[c]);

  delete file.data;
});

files['none'] = {
  name: 'none',
  count: 0,
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