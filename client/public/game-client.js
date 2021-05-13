function Round(players, joker, deck, trash, firtsPlayer, lastPlayer) {
  this.players = players;
  this.joker = joker;
  this.deck = deck;
  this.trash = trash;
  this.history = [];
  this.firstPlayer = firtsPlayer;
  this.lastPlayer = lastPlayer;
}

function createPlayerObject(playerId, name, imageURL, admin) {
  return { playerId, name, imageURL, admin };
}

function PlayerPlayable(name, cards, move = false) {
  this.name = name;
  this.move = move;
  this.cards = cards;
}

export default function createGameInstance() {
  const local = {
    waitList: [], // list of players waiting to join the game
    currentPlayerId: undefined,
    screen: "wait",
  };

  function addPlayerToWaitList(command) {
    const playerId = command.playerId;
    const name = command.name;
    const imageURL = command.imageURL;
    const admin = command.admin;

    local.waitList.push(createPlayerObject(playerId, name, imageURL, admin));
    return local.waitList;
  }

  function removePlayerInWaitList(command) {
    const playerId = command.playerId;

    this.local.waitList = this.local.waitList.filter(
      (player) => player.playerId !== playerId
    );
  }

  function getWaitList() {
    return this.local.waitList;
  }

  function setWaitList(waitList) {
    return (this.local.waitList = waitList);
  }

  function setScreenToRender(screen) {
    this.local.screen = screen;
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

  const state = gameDefaultState;

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

  function setCurrentPlayerId(playerId) {
    local.currentPlayerId = playerId;
  }

  function getCurrentPlayerId() {
    return local.currentPlayerId;
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

  function isEverybodyReady() {
    return !Object.keys(state.players).some(
      (playerId) => state.players[playerId].ready === false
    );
  }

  return {
    //local control
    local,
    addPlayerToWaitList,
    removePlayerInWaitList,
    getWaitList,
    setWaitList,
    setScreenToRender,
    // game stuff
    state,
    setState,
    getPlayers,
    initNewRound,
    setCurrentPlayerId,
    getCurrentPlayerId,
    addPlayer,
    removePlayer,
    isEverybodyReady,
  };
}
