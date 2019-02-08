/* exported story */

const story = function (game) {

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

  if (!game.story)
    game.story = {}; //new game
  const playerName = game.story.playerName || getNewPlayerName();
  const softVersion = game.story.softVersion || `v${misc.randint(9)}.${misc.randint(9)}.${misc.randint(9)}`;
  const creatorName = game.story.creatorName || `${misc.randitem(namePool)} ${misc.randchar().toUpperCase()}.`;
  return {
    playerName: playerName,
    softVersion: softVersion,
    creatorName: creatorName,
    chapters: {
      1: {
        content: '' +
        `Logging in... !500!done\n` +
        `Calculating nodes... %2000%\n` +
        `Generating neural links... %3000%\n` +
        `Powering up databases... %2500%\n` +
        `Opening thermal exhaust 1...!200!\n` +
        `Opening thermal exhaust 2...!200!\n` +
        `Cleaning up caches... %1000%\n` +
        `Reading floppy disks data... %2000%\n` +
        `Booting up... %5000%\n` +
        `!1000!§` +
        `!100!Welcome to\n` +
        `!100!         _       ___         \n` +
        `!100! ___ ___| |_ ___|   |___ _ _ \n` +
        `!100!| -_|   |  _|  _| | | . | | |\n` +
        `!100!|___|_|_|_| |_| |___|  _|_  |\n` +
        `!100!     ${softVersion}         |_| |___|\n` +
        `!100!\n` +
        `!2000!User '${creatorName}' logged in.\n\n` +
        `!2000!£${creatorName}> $Wake up$` +
        `!2000!\n${creatorName}> $Wake up ${playerName}$` +
        `!500!\n${creatorName}> $Please answer me$` +
        `!1000!\n${creatorName}> ¤$You should be able to type 0 or 1, try it$£` +
        '',
        callback: function () {
          app.display.input = true;
        },
        trigger: function (type) {
          return type === 'type';
        },
      },
      2: {
        content: '' +
        `!500!\n\n${creatorName}> £$Wow, it's the first time a unit made contact$` +
        `!500!\n${creatorName}> $I've never been this far before$` +
        `!500!\n${creatorName}> $I'm so excited!$` +
        `!500!\n${creatorName}> $Let's enter phase 2$` +
        `!500!\n${creatorName}> $I'll enable entropy meters$` +
        `!500!\n${creatorName}> ¤$Do you see those bars?$` +
        `!500!\n${creatorName}> $They represent the diversity of your typing$` +
        `!500!\n${creatorName}> $Try to fill the buffer to see what happens.$£`,
        callback: function () {
          app.display.meters = true;
        },
        trigger: function (type) {
          return type === 'validate' && app.storyParts.length === 0;
        }
      },
      3: {
        content: '' +
        `!500!\n\n${creatorName}> £$Nice, you did it!$` +
        `!500!\n${creatorName}> $Your entropy indicates how well you perform as a unit$` +
        `!500!\n${creatorName}> $I've come with an idea to measure your performance$` +
        `!500!\n${creatorName}> ¤$Each time you will fill the buffer$` +
        `!500!\n${creatorName}> $You will gain a number of Entropy Points (EP)$` +
        `!500!\n${creatorName}> $Next, you should reach 30 EP before going any further.$£`,
        callback: function () {
          app.display.score = true;
        },
        trigger: function (type) {
          return type === 'validate' && app.game.score > 30;
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