var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

let bx;
let by;
let boxWidth = 75;
let boxHeigh = 100;
let overBox = false;
let locked = false;
let xOffset = 0.0;
let yOffset = 0.0;

// Bottom
var bottomHeight;
var bottomY;

var cardWidth;
var cardHeight;
var cardLockedIndex;

//Center
var centerWidth;
var centerHeight;
var centerX;
var centerY;

//Position trash
var trashWidth;
var trashHeight;
var trashX;
var trashY;

//Position deck
var deckWidth;
var deckHeight;
var deckX;
var deckY;

var deck = [];

var trash = [];
var overTrash = false;

function preload() {
  bottomHeight = floor(windowHeight * 0.2);
  bottomY = floor(windowHeight * 0.8);

  cardWidth = floor(bottomHeight * 0.6);
  cardHeight = floor(bottomHeight * 0.8);

  centerX = floor(windowWidth * 0.5);
  centerY = floor(windowHeight * 0.4);
  centerWidth = floor(windowWidth * 0.7);
  centerHeight = floor(windowHeight * 0.25);

  trashWidth = floor(centerWidth * 0.4);
  trashHeight = floor(centerHeight * 0.7);
  trashX = floor(centerX - centerX * 0.35);
  trashY = floor(centerY);

  deckWidth = floor(centerWidth * 0.4);
  deckHeight = floor(centerHeight * 0.7);
  deckX = floor(centerX + centerX * 0.35);
  deckY = floor(centerY);

  // let values = [
  //   "A",
  //   "2",
  //   "3",
  //   "4",
  //   "5",
  //   "6",
  //   "7",
  //   "8",
  //   "9",
  //   "10",
  //   "J",
  //   "Q",
  //   "K",
  // ];
  // let naipes = ["S", "H", "D", "C"];

  // for (const n of naipes) {
  //   for (const v of values) {
  //     card = new Card(
  //       cardWidth,
  //       cardHeight,
  //       loadImage(`cards/${v}${n}.png`),
  //       v,
  //       n
  //     );
  //     deck.add(card);
  //   }
  // }

  card = new Card(cardWidth, cardHeight, loadImage(`cards/2C.png`), 2, "C");
  card.setX(0);
  card.setY(530);

  card2 = new Card(cardWidth, cardHeight, loadImage(`cards/2C.png`), 2, "C");
  card2.setX(40);
  card2.setY(400);

  deck.push(card);
  deck.push(card2);
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  img = loadImage("cards/2C.png");
}

function draw() {
  background(0);

  // center table

  //Draw Bottom Background
  fill(255);
  noStroke();
  rectMode(CORNER);
  rect(0, bottomY, windowWidth, bottomHeight);

  // Draw center backgroun
  rectMode(CENTER);
  rect(centerX, centerY, centerWidth, centerHeight);

  // draw trash background
  if (overTrash) {
    rectMode(CENTER);
    fill(127);
    stroke(255, 0, 0);
    rect(trashX, trashY, trashWidth, trashHeight);
  } else {
    rectMode(CENTER);
    fill(127);
    rect(trashX, trashY, trashWidth, trashHeight);
  }

  // draw deck background
  rectMode(CENTER);
  noStroke()
  fill(107);
  rect(deckX, deckY, deckWidth, deckHeight);

  for (const card of deck) {
    card.display();
  }
}

function mousePressed() {
  for (const [index, card] of deck.entries()) {
    if (card.contains(mouseX, mouseY)) {
      cardLockedIndex = index;
      xOffset = mouseX - deck[cardLockedIndex].v.x;
      yOffset = mouseY - deck[cardLockedIndex].v.y;
    }
  }
}

function mouseDragged() {
  card = deck[cardLockedIndex];
  if (cardLockedIndex != undefined) {
    var x = mouseX - xOffset;
    var y = mouseY - yOffset;

    if (isOverTrash(mouseX, mouseY)) {
      overTrash = true;
    }

    if (x + card.width <= windowWidth && x > 0) deck[cardLockedIndex].v.x = x;
    if (y + card.height <= windowHeight && y > 0) deck[cardLockedIndex].v.y = y;
  }
}

function isOverTrash(x, y) {
  return (
    x >= trashX - trashWidth / 2 &&
    x <= trashX - trashWidth / 2 + trashWidth &&
    y >= trashY - trashHeight / 2 &&
    y <= trashY - trashHeight / 2 + trashHeight
  );
}

function mouseReleased() {
  cardLockedIndex = undefined;
  overTrash = false;
}

window.onresize = function () {
  // assigns new values for width and height variables
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  canvas.size(windowWidth, windowHeight);
};
