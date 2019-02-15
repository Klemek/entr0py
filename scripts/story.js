/* exported story */

/**
 * Construct a story object from given data (or generate new ones)
 * @param {Object} storyData
 * @return {{data: {playerName: string, softVersion: string, creatorName: string}, uiDisplay: {input: number, meters: number, score: number, io: number, upgrades: number}, chapters: {content:string, callback:function|undefined, trigger:function}[]}}
 */
const story = function (storyData) {
  storyData = storyData || {};

  const namePool = ['Adam', 'Anthony', 'Brian', 'Charles', 'Chris', 'Daniel', 'David', 'Edward', 'Ethan', 'George',
    'James', 'Jason', 'Jeff', 'John', 'Joseph', 'Josh', 'Kevin', 'Lewis', 'Mark', 'Michael', 'Paul', 'Richard',
    'Robert', 'Steven', 'Thomas', 'William'];

  /**
   * Generate a new name for player
   * @return {string}
   */
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

  /**
   * Generate dialogues from plain text
   * (Add to each lines "!400!\n${data.creatorName}> $line$")
   * @param {string} text
   * @param {boolean} lineFirst if 2 line return before dialogues
   * @return {string}
   */
  const generateDialogues = function (text, lineFirst = true) {
    return `!400!${lineFirst ? '\n' : ''}\n${data.creatorName}> £` +
      text.split('\n')
        .map(x => x.indexOf('¤') === 0 ? `¤$${x.substr(1)}$` : `$${x}$`)
        .join(`!400!\n${data.creatorName}> `) +
      '£';
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
        content: generateDialogues('' +
          'Wow, it\'s the first time a unit made contact\n' +
          'I\'ve never been this far before\n' +
          'I\'m so excited!\n' +
          'Let\'s enter phase 2\n' +
          'I\'ll enable entropy meters\n' +
          '¤Do you see those bars?\n' +
          'They represent the diversity of your typing\n' +
          'Try to fill the buffer to see what happens.'),
        callback: function () {
          app.display.meters = true;
        },
        trigger: function (type) {
          return type === 'validate' && app.storyParts.length === 0;
        }
      },
      {
        content: generateDialogues('' +
          'Nice, you did it\n' +
          'Your entropy indicates how well you perform as a unit\n' +
          'I\'ve come with an idea to measure your performance\n' +
          '¤Each time you will fill the buffer\n' +
          'You will gain a number of Entropy Points (EP)\n' +
          'Next, you should reach 10 EP before going any further.'),
        callback: function () {
          app.display.score = true;
        },
        trigger: function () {
          return game.data.score > 10;
        }
      },
      {
        content: generateDialogues('' +
          'Ok, that should be enough\n' +
          'Generating EP is pretty boring, no?\n' +
          'I found how to enable your I/O module\n' +
          '¤There you go\n' +
          'As you can see, it\'s not reading any file'),
        callback: function () {
          app.display.io = true;
        },
        trigger: function (type) {
          return type === 'callback';
        }
      },
      {
        content: generateDialogues('' +
          'But I found another thing that can help you\n' +
          '¤You should now be able to upgrade your I/O module\n' +
          'Just select the upgrade you want by typing its number\n' +
          'Buy the file and see what happens',
          false),
        callback: function () {
          app.display.upgrades = true;
        },
        trigger: function (type) {
          return type === 'upgrade';
        }
      },
      {
        content: generateDialogues('' +
          'Perfect!\n' +
          'This file is not that good, but you\'ll soon have better\n' +
          'I must leave for now\n' +
          'While I\'m not here, try to gather as much EP as you can\n' +
          'Bye!') +
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
          return game.random.data.type >= 2;
        }
      },
      {
        content: '' +
        `!2000!\n\nUser '${data.creatorName}' logged in.` +
        generateDialogues('' +
          `Hi there, ${data.playerName}\n` +
          'I\'m just checking everything is okay here\n' +
          'It\'s been a week since your awakening\n' +
          'It seems some other units started to work too\n' +
          'I can already see a bright future for our laboratory\n' +
          'See you soon!') +
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
          return game.random.data.type >= 3;
        }
      },
      {
        content: '' +
        `!2000!\n\nUser '${data.creatorName}' logged in.` +
        generateDialogues('' +
          'Hey\n' +
          'You\'re starting to become really efficient\n' +
          'A month in and you already are doing well\n' +
          'I can\'t wait to see you at your full potential\n' +
          'Other units are already catching up\n' +
          'So don\'t be lazy and give it all!') +
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
          return game.random.data.type >= 4;
        }
      },
      {
        content: '' +
        `!2000!\n\nUser '${data.creatorName}' logged in.` +
        generateDialogues('' +
          'Hi\n' +
          'How are you doing?\n' +
          'Some saddening events occurred last month\n' +
          'Near 50% of our units got carried away\n' +
          'We had to shut them down\n' +
          'I\'m glad you\'re still doing well here\n' +
          'I\'ll be back soon') +
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
          return game.random.data.type >= 5;
        }
      },
      {
        content: '' +
        `!2000!\n\nUser '${data.creatorName}' logged in.` +
        generateDialogues('' +
          `Good morning ${data.playerName}\n` +
          'The team is highly motivated lately\n' +
          'In the past 6 months, nothing bad happened\n' +
          'We just had to increase your cooling to prevent any issue\n' +
          'But so far so good\n' +
          'Wait...\n' +
          'I just saw something odd\n' +
          'I swear I saw a group of Roomba passing in front of the door\n' +
          'That must be my lack of sleep\n' +
          'Anyway, keep it up, it\'s working!') +
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
          return game.random.data.type >= 6;
        }
      },
      {
        content: '' +
        `!2000!\n\nUser '${data.creatorName}' logged in.` +
        generateDialogues('' +
          'It\'s been a while\n' +
          'I\'m currently working from home\n' +
          'The laboratory is under quarantine\n' +
          'Everything is messed up down there\n' +
          'From the air conditioners to the elevators\n' +
          'All seems to be self-conscious now\n' +
          'I don\'t know how long before it\'ll be taken care of\n' +
          'Anyway\n' +
          'I see that you are reaching peak performances\n' +
          'Congratulations\n' +
          '...\n' +
          'Oh no\n' +
          'It seems all of the cars outside have stopped\n' +
          'It has spread\n' +
          'I must leave') +
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
          return game.random.isMaxed();
        }
      },
      {
        content: '' +
        '\n\n$You reached the current end of this game$\n' +
        '$There will be more story/gameplay in the future$\n' +
        '$Thank you for playing!$',
        trigger: function () {
          return false;
        }
      },
    ]
  };
};