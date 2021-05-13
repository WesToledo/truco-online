import renderGameScreen from "./render-game-screen.js";

export default function renderScreen(game) {
  const sketch = (p) => {
    const currentPlayerId = game.getCurrentPlayerId();

    const gameScreen = new renderGameScreen(p, game);

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    p.preload = function () {
      if (game.local.screen === "game") gameScreen.preload();
    };

    p.setup = function () {
      if (game.local.screen === "game") {
        p.createCanvas(windowWidth, windowHeight);
        gameScreen.setup();
      }
    };

    p.draw = function () {
      // if (!game.state.players[currentPlayerId].ready) {
      //   // render screen to say he's ready
      // }
      // if (!game.isEverybodyReady()) {
      //   // render wait page
      // } else {
      // }
      if (game.local.screen === "game") gameScreen.draw();
    };

    p.mousePressed = function () {
      if (game.local.screen === "game") gameScreen.mousePressed();
    };

    p.mouseDragged = function () {
      if (game.local.screen === "game") gameScreen.mouseDragged();
    };

    p.mouseReleased = function () {
      if (game.local.screen === "game") gameScreen.mouseReleased();
    };

    window.onresize = function () {
      console.log("resize");
      // assigns new values for width and height variables
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      p.resizeCanvas(windowWidth, windowHeight);
    };
  };

  // eslint-disable-next-line no-undef
  const rendered = new p5(sketch);
  return { rendered };
}
