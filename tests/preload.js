console.log('installing lolex');
window.clock = lolex.install(
  {
    shouldAdvanceTime: false,
    toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval']
  });
console.log('lolex installed',);