/* exported story */

const story = function (game) {

  const namePool = ['Adam', 'Anthony', 'Brian', 'Charles', 'Chris', 'Daniel', 'David', 'Edward', 'Ethan', 'George',
    'James', 'Jason', 'Jeff', 'John', 'Joseph', 'Josh', 'Kevin', 'Lewis', 'Mark', 'Michael', 'Paul', 'Richard',
    'Robert', 'Steven', 'Thomas', 'William'];

  if (!game.story)
    game.story = {}; //new game
  const playerName = game.story.playerName || `unit ${misc.pad('0', misc.randint(0, 100000), 5)}`;
  const softVersion = game.story.softVersion || `v${misc.randint(0, 9)}.${misc.randint(0, 9)}.${misc.randint(0, 9)}`;
  const creatorName = game.story.creatorName || `${misc.randitem(namePool)} ${String.fromCharCode(misc.randint(65, 91))}.`;
  return {
    playerName: playerName,
    softVersion: softVersion,
    creatorName: creatorName,
    chapters: {
      1: {
        content: '' +
        `Loggin in... !500!done\n` +
        `Calculating nodes... %2000%\n` +
        `Generating neural links... %3000%\n` +
        `Powering up databases... %2500%\n` +
        `Opening thermal exhaust 1...!200!\n` +
        `Opening thermal exhaust 2...!200!\n` +
        `Cleaning up cache... %1000%\n` +
        `Reading disk data... %2000%\n` +
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
        `!500!\n${creatorName}> $I'm so excited !$` +
        `!500!\n${creatorName}> $Let's enter phase 2$` +
        `!500!\n${creatorName}> $I'll enable entropy meters$` +
        `!500!\n${creatorName}> ¤$Do you see those bars ?$` +
        `!500!\n${creatorName}> $They represent the diversity of your typing$` +
        `!500!\n${creatorName}> $Try to fill the buffer to see what happens.$£`,
        callback: function () {
          app.display.meters = true;
        },
        trigger: function (type) {
          return app.storyParts.length === 0 && type === 'validate';
        }
      },
      3: {
        content: '\n\nThis is a work in progress thanks for testing my work.',
        trigger: function () {
          return false;
        }
      }
    }
  };
};