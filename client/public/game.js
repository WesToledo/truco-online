function Round(players, joker, deck, trash, firtsPlayer, lastPlayer) {
  this.players = players;
  this.joker = joker;
  this.deck = deck;
  this.trash = trash;
  this.history = [];
  this.firstPlayer = firtsPlayer;
  this.lastPlayer = lastPlayer;
}

function PlayerObject(name, imgUrl, lives = 2, ready = false) {
  this.name = name;
  this.imgUrl = imgUrl;
  this.lives = lives;
  this.ready = ready;
}

function PlayerPlayable(name, cards, move = false) {
  this.name = name;
  this.move = ready;
  this.cards = cards;
}

export default function createGame() {
  const state = {
    init: false,
    players: {},
    currentRound: 1,
    rounds: [],
    currentPlayer: { playerId: "playerId" },
    currentRoundCartAmount: 1,
    maxRoundCardAmount: 8,
    lastPlayerLastGame: {},
  };

  const globalDeck = [];

  const observers = [];

  function subscribe(observerFunction) {
    observers.push(observerFunction);
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command);
    }
  }

  function setState(newState) {
    Object.assign(state, newState);
  }

  function setCurrentPlayer(playerId) {
    this.state.currentPlayer = playerId;
  }

  function getPlayers() {
    return this.state.players;
  }

  function init() {}

  function initNewRound(round) {
    let newRound = new Round(round);

    this.state.rounds.push(newRound);
  }

  function addPlayer(command) {
    const playerId = command.playerId;
    const name = command.name;
    const imgUrl = command.imgUrl;

    state.players[playerId] = new PlayerObject(name, imgUrl);

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
    state,
    setState,
    getPlayers,
    initNewRound,
    setCurrentPlayer,
    addPlayer,
    removePlayer,
  };
}
