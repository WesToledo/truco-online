function createGame() {
  const state = {
    open: false,
    players: {
      someId: {
        name: "Wesley",
        lives: 2,
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
        firstPlayer: { idPlayer: "some id" },
        lastPlayer: { idPlayer: "other id" },
      },
    ],
    currentPlayer: { playerId: playerId },
    currentRoundCartAmount: 1,
    lastPlayerLastGame: {},
  };

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
