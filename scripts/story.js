/* exported story */

const story = function (storyData) {

  const namePool = ['Adam', 'Anthony', 'Brian', 'Charles', 'Chris', 'Daniel', 'David', 'Edward', 'Ethan', 'George',
    'James', 'Jason', 'Jeff', 'John', 'Joseph', 'Josh', 'Kevin', 'Lewis', 'Mark', 'Michael', 'Paul', 'Richard',
    'Robert', 'Steven', 'Thomas', 'William'];

  const getNewPlayerName = () => {
    let name = misc.pad('0', misc.randint(100000), 5);
    const nl = misc.randint(1, 4);
    for (let i = 0; i < nl; i++) {
      const pl = misc.randint(name.length - 1);
      name = name.substr(0, pl) + misc.randchar() + name.substr(pl);
    }
    const ps = misc.randint(2, name.length - 2);
    name = name.substr(0, ps) + '-' + name.substr(ps);
    return `unit ${name}`;
  };

  const data = {
    playerName: storyData.playerName || getNewPlayerName(),
    softVersion: storyData.softVersion || `v${misc.randint(9)}.${misc.randint(9)}.${misc.randint(9)}`,
    creatorName: storyData.creatorName || `${misc.randitem(namePool)} ${misc.randchar().toUpperCase()}.`,
  };

  return {
    data: data,
    uiDisplay: {
      input: 2,
      meters: 3,
      score: 4
    },
    chapters: {
      0: {
        content: '' +
        `Logging in... !500!done` +
        `\nCalculating nodes... %2000%` +
        `\nGenerating neural links... %3000%` +
        `\nPowering up databases... %2500%` +
        `\nOpening thermal exhaust 1...!200!` +
        `\nOpening thermal exhaust 2...!200!` +
        `\nCleaning up caches... %1000%` +
        `\nReading floppy disks data... %2000%` +
        `\nBooting up... %5000%` +
        `\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n` +
        `!100!\nWelcome to` +
        `!100!\n         _       ___         ` +
        `!100!\n ___ ___| |_ ___|   |___ _ _ ` +
        `!100!\n| -_|   |  _|  _| | | . | | |` +
        `!100!\n|___|_|_|_| |_| |___|  _|_  |` +
        `!100!\n     ${data.softVersion}         |_| |___|` +
        `!2000!¤` +
        '',
        callback: function () {
          // ignored
        },
        trigger: function (gameData, type) {
          return type === 'callback';
        },
      },
      1: {
        content: '' +
        `\n\nUser '${data.creatorName}' logged in.` +
        `!2000!\n\n£${data.creatorName}> $Wake up$` +
        `!2000!\n${data.creatorName}> $Wake up ${data.playerName}$` +
        `!500!\n${data.creatorName}> $Please answer me$` +
        `!1000!\n${data.creatorName}> ¤$You should be able to type 0 or 1, try it$£` +
        '',
        callback: function () {
          app.display.input = true;
        },
        trigger: function (gameData, type) {
          return type === 'type';
        },
      },
      2: {
        content: '' +
        `!500!\n\n${data.creatorName}> £$Wow, it's the first time a unit made contact$` +
        `!500!\n${data.creatorName}> $I've never been this far before$` +
        `!500!\n${data.creatorName}> $I'm so excited!$` +
        `!500!\n${data.creatorName}> $Let's enter phase 2$` +
        `!500!\n${data.creatorName}> $I'll enable entropy meters$` +
        `!500!\n${data.creatorName}> ¤$Do you see those bars?$` +
        `!500!\n${data.creatorName}> $They represent the diversity of your typing$` +
        `!500!\n${data.creatorName}> $Try to fill the buffer to see what happens.$£`,
        callback: function () {
          app.display.meters = true;
        },
        trigger: function (gameData, type) {
          return type === 'validate' && app.storyParts.length === 0;
        }
      },
      3: {
        content: '' +
        `!500!\n\n${data.creatorName}> £$Nice, you did it!$` +
        `!500!\n${data.creatorName}> $Your entropy indicates how well you perform as a unit$` +
        `!500!\n${data.creatorName}> $I've come with an idea to measure your performance$` +
        `!500!\n${data.creatorName}> ¤$Each time you will fill the buffer$` +
        `!500!\n${data.creatorName}> $You will gain a number of Entropy Points (EP)$` +
        `!500!\n${data.creatorName}> $Next, you should reach 30 EP before going any further.$£`,
        callback: function () {
          app.display.score = true;
        },
        trigger: function (gameData, type) {
          return type === 'validate' && gameData.score > 30;
        }
      },
      4: {
        content: '' +
        `\n\n!500!Klemek> £$This is a work in progress thanks for testing my work.$£`,
        trigger: function () {
          return false;
        }
      }
    }
  };
};