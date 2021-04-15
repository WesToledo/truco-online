import renderGameScreen from "./renderGameScreen.js";

export default function renderScreen(game) {
  let canvas;
  const sketch = (p) => {
    const gameScreen = new renderGameScreen(p, game);

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    p.preload = function () {
      gameScreen.preload();
    };

    p.setup = function () {
      canvas = p.createCanvas(windowWidth, windowHeight);
      gameScreen.setup();
    };

    p.draw = function () {
      gameScreen.draw();
    };

    p.mousePressed = function () {
      gameScreen.mousePressed();
    };

    p.mouseDragged = function () {
      gameScreen.mouseDragged();
    };

    p.mouseReleased = function () {
      gameScreen.mouseReleased();
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
