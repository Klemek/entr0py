/* exported story */

const story = function (storyData) {
  storyData = storyData || {};

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
      score: 4,
      io: 5,
      upgrades: 5
    },
    chapters: [
      {
        content: '' +
        `Logging in... !400!done` +
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
        trigger: function (type) {
          return type === 'callback';
        },
      },
      {
        content: '' +
        `\n\nUser '${data.creatorName}' logged in.` +
        `!2000!\n\n£${data.creatorName}> $Wake up$` +
        `!1000!\n${data.creatorName}> $Wake up ${data.playerName}$` +
        `!400!\n${data.creatorName}> $Please answer me$` +
        `!400!\n${data.creatorName}> ¤$You should be able to type 0 or 1, try it$£` +
        '',
        callback: function () {
          app.display.input = true;
        },
        trigger: function (type) {
          return type === 'type';
        },
      },
      {
        content: '' +
        `!400!\n\n${data.creatorName}> £$Wow, it's the first time a unit made contact$` +
        `!400!\n${data.creatorName}> $I've never been this far before$` +
        `!400!\n${data.creatorName}> $I'm so excited!$` +
        `!400!\n${data.creatorName}> $Let's enter phase 2$` +
        `!400!\n${data.creatorName}> $I'll enable entropy meters$` +
        `!400!\n${data.creatorName}> ¤$Do you see those bars?$` +
        `!400!\n${data.creatorName}> $They represent the diversity of your typing$` +
        `!400!\n${data.creatorName}> $Try to fill the buffer to see what happens.$£`,
        callback: function () {
          app.display.meters = true;
        },
        trigger: function (type) {
          return type === 'validate' && app.storyParts.length === 0;
        }
      },
      {
        content: '' +
        `!400!\n\n${data.creatorName}> £$Nice, you did it!$` +
        `!400!\n${data.creatorName}> $Your entropy indicates how well you perform as a unit$` +
        `!400!\n${data.creatorName}> $I've come with an idea to measure your performance$` +
        `!400!\n${data.creatorName}> ¤$Each time you will fill the buffer$` +
        `!400!\n${data.creatorName}> $You will gain a number of Entropy Points (EP)$` +
        `!400!\n${data.creatorName}> $Next, you should reach 10 EP before going any further.$£`,
        callback: function () {
          app.display.score = true;
        },
        trigger: function () {
          return game.data.score > 10;
        }
      },
      {
        content: '' +
        `!400!\n\n${data.creatorName}> £$Ok, that should be enough$` +
        `!400!\n${data.creatorName}> $Generating EP is pretty boring, no?$` +
        `!400!\n${data.creatorName}> $I found how to enable your I/O module$` +
        `!400!\n${data.creatorName}> ¤$There you go$` +
        `!400!\n${data.creatorName}> $As you can see, it's not reading any file$`,
        callback: function () {
          app.display.io = true;
        },
        trigger: function (type) {
          return type === 'callback';
        }
      },
      {
        content: '' +
        `!400!\n${data.creatorName}> $But I found another thing that can help you$` +
        `!400!\n${data.creatorName}> ¤$You should now be able to upgrade your I/O module$` +
        `!400!\n${data.creatorName}> $Just select the upgrade you want by typing its number$` +
        `!400!\n${data.creatorName}> $Buy the file and see what happens$£`,
        callback: function () {
          app.display.upgrades = true;
        },
        trigger: function (type) {
          return type === 'upgrade';
        }
      },
      {
        content: '' +
        `!400!\n\n${data.creatorName}> £$Perfect !$` +
        `!400!\n${data.creatorName}> $This file is not that good, but you'll soon have better$` +
        `!400!\n${data.creatorName}> $I must leave for now$` +
        `!400!\n${data.creatorName}> $While I'm not here, try to gather as much EP as you can$` +
        `!400!\n${data.creatorName}> $Bye !$£` +
        `!2000!\n\nUser '${data.creatorName}' logged out.¤`,
        callback: function () {
          // ignored
        },
        trigger: function (type) {
          return type === 'callback';
        }
      },
      {
        content: '',
        trigger: function () {
          return false;
        }
      },
    ]
  };
};