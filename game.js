function Round() {
  this.players = {};
  this.joker = {};
  this.deck = [];
  this.history = [];
  this.trash = [];
  this.firstPlayer = {};
  this.lastPlayer;

  Round.prototype.addPlayer = function (playerId, cards) {
    var player = game.players[playerId];
    this.players[playerId] = new PlayerPlayable(playerId, player.name, cards);
  };
}

function createPlayerObject(playerId, name, imageURL, admin) {
  return { playerId, name, imageURL, admin };
}

function PlayerPlayable(playerId, name, cards, moved = false) {
  this.playerId = playerId;
  this.name = name;
  this.cards = cards;
  this.moved = moved;
}

function createGameInstance() {
  const server = {
    deck: [],
    waitList: [], // list of players waiting to join the game
    isGameRunning: false, // if all of players join the waiting list, then open the game
  };

  function isGameRunning() {
    return server.isGameRunning;
  }

  function addPlayerToWaitList(command) {
    const playerId = command.playerId;
    const name = command.name;
    const imageURL = command.imageURL;
    const admin = command.admin;

    server.waitList.push(createPlayerObject(playerId, name, imageURL, admin));

    notifyAll({
      type: "add-player-to-wait-list",
      playerId,
      name,
      imageURL,
      admin,
    });
  }

  function removePlayerInWaitList(command) {
    const playerId = command.playerId;

    this.server.waitList = this.server.waitList.filter(
      (player) => player.playerId != playerId
    );

    notifyAll({
      type: "remove-player-in-wait-list",
      playerId: playerId,
    });
  }

  const gameDefaultState = {
    init: false,
    players: {},
    currentRound: 1,
    rounds: [],
    currentPlayer: {
      // playerId: "playerId"
    },
    currentRoundCartAmount: 1,
    maxRoundCardAmount: 8,
    lastPlayerLastGame: {},
  };

  const game = gameDefaultState;

  //DEFAULT FUNCTIONS
  initDefaultDeck();

  const observers = [];

  function subscribe(observerFunction) {
    observers.push(observerFunction);
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command);
    }
  }

  function initDefaultDeck() {
    let cardNumbers = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];
    let cardNaipes = ["S", "H", "D", "C"];

    for (const naipe of cardNaipes) {
      for (const number of cardNumbers) {
        card = {
          number: number,
          naipe: naipe,
        };
        server.deck.push(card);
      }
    }
  }

  function getShuffledDeck() {
    var deckCopy = [...server.deck];

    // shuffle deck
    var m = deckCopy.length,
      t,
      i;

    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = deckCopy[m];
      deckCopy[m] = deckCopy[i];
      deckCopy[i] = t;
    }
    return deckCopy;
  }

  function preload() {
    //if someone its not ready, its not init the game
    if (isEverybodyReady()) {
      // spread the cards to players
      var deckShuffled = getShuffledDeck();

      Object.keys(game.players).forEach((playerId) => {
        game.players[playerId].cards[
          deckShuffled.splice(0, game.currentRoundCartAmount)
        ];
      });
    }
  }

  function createNewRound() {
    function setAllPlayersNotReady() {
      Object.keys(game.players).forEach((playerId) => {
        game.players[playerId].ready = false;
      });
    }

    setAllPlayersNotReady();

    let newRound = new Round();

    // select only the players that are playing (lives > 0)
    const playersAlivesId = Object.keys(game.players).filter(
      (playerId) => game.players[playerId].lives > 0
    );

    calculateAndSetMaxRoundCardAmount(playersAlivesId.length);
    calculateAndSetCurrentRoundCardAmount();

    playersAlivesId.forEach((playerId) => {
      newRound.addPlayer(
        playerId,
        globalDeck.splice(0, game.maxRoundCardAmount)
      );
    });

    // players: {
    //   someId: {
    //     name: "Wesley",
    //     cards: [],
    //     move: false,
    //   },
    // },
    // joker: {},
    // deck: [],
    // trash: [
    //   {
    //     card: "2C",
    //     playerId: "some id",
    //   },
    // ],
    // firstPlayer: { playerId: "some id" },
    // lastPlayer: { playerId: "other id" },
  }

  function calculateAndSetMaxRoundCardAmount(numberOfPlayers) {
    const possibility = {
      2: 3,
      3: 3,
      4: 4,
      5: 8,
      6: 6,
      7: 5,
      8: 5,
      9: 4,
      10: 4,
      11: 3,
      12: 3,
      13: 3,
      14: 2,
    };

    game.maxRoundCardAmount = possibility[numberOfPlayers];
  }

  function calculateAndSetCurrentRoundCardAmount() {
    if (game.currentRoundCartAmount >= game.maxRoundCardAmount)
      game.currentRoundCartAmount;
    else game.currentRoundCartAmount += 1;
  }

  function isEverybodyReady() {
    return !Object.keys(game.players).some(
      (playerId) => game.players[playerId].ready === false
    );
  }

  function setPlayerReady(command) {
    const playerId = command.playerId;
    game.players[playerId].ready = true;
  }

  function addPlayer(command) {
    const playerId = command.playerId;
    const name = command.name;

    game.players[playerId] = {
      name: name,
      lives: 2,
      ready: false,
    };

    notifyAll({
      type: "add-player",
      name: name,
      lives: 2,
      ready: false,
    });
  }

  function removePlayer(command) {
    const playerId = command.playerId;

    delete game.players[playerId];

    notifyAll({
      type: "remove-player",
      playerId: playerId,
    });
  }

  function resetGameState() {
    Object.assign(game, gameDefaultState);
  }

  return {
    //server
    server,
    isGameRunning,
    addPlayerToWaitList,
    removePlayerInWaitList,
    subscribe,

    //game
    game,
    addPlayer,
    removePlayer,
    resetGameState,
  };
}

module.exports = createGameInstance;
