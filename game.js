function createGame() {
  const state = {
    open: false,
    players: {
      someId: {
        name: "Wesley"
      }
    },
    playersLives: {
      someId: {
        count: 2,
    },
  },
    playersActives: {},
    currentRound: 1,
    rounds: [],
    countCards: 1,
    lastPlayerLastGame: {},
    currentPlayer: {},
    deck = [],
    joker = {},
    trash=[]

  };

  const round = {
    firstPlayer: {},
    countCards:1,
    playersAnswers: {},

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

  function addPlayer(command) {
    const playerId = command.playerId;
    const name = command.name;
    const lives = command.lives;
    const ready = command.ready;
  }
}
