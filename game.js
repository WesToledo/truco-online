function createGame() {
  const state = {
    init: false,
    players: {
      someId: {
        name: "Wesley",
        lives: 2,
        ready: false,
      },
    },
    currentRound: 1,
    rounds: [
      {
        players: {
          someId: {
            name: "Wesley",
            cards: [],
            move: false,
          },
        },
        joker: {},
        deck: [],
        trash: [
          {
            card: "2C",
            playerId: "some id",
          },
        ],
        firstPlayer: { playerId: "some id" },
        lastPlayer: { playerId: "other id" },
      },
    ],
    currentPlayer: { playerId: playerId },
    currentRoundCartAmount: 1,
    maxCardAmount: 8,
    lastPlayerLastGame: {},
  };

  // generate deck cards
  const deck = [];
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
      deck.add(card);
    }
  }

  // shuffle deck
  var m = deck.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = deck[m];
    deck[m] = deck[i];
    deck[i] = t;
  }

  const observers = [];

  function subscribe(observerFunction) {
    observers.push(observerFunction);
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command);
    }
  }

  function init() {
    //if someone its not ready, its not init the game
    if (isEverybodyReady()) {
      // spread the cards to players
      Object.keys(state.players).forEach((playerId) => {
        state.players[playerId].cards[
          deck.splice(0, state.currentRoundCartAmount)
        ];
      });
    }
  }

  function createNewRound() {

    const playersId = Object.keys(state.players).filter(
      (playerId) => state.players[playerId].lives > 0
    );

    playersId.forEach(playersId)

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

  function calculateMaxCardAmount(numberOfPlayers) {
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

    return possibility[numberOfPlayers];
  }

  function isEverybodyReady() {
    return !Object.keys(state.players).some(
      (playerId) => state.players[playerId].ready === false
    );
  }

  function addPlayer(command) {
    const playerId = command.playerId;
    const name = command.name;

    state.players[playerId] = {
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

    delete state.players[playerId];

    notifyAll({
      type: "remove-player",
      playerId: playerId,
    });
  }

  return {
    addPlayer,
    removePlayer,
  };
}
