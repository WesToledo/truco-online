var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var backCardImage;

// Bottom
var bottomHeight;
var bottomY;

var cardWidth;
var cardHeight;
var cardLockedIndex;
var isCardBeingDragged = false;

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
var cardIsOverTrash = false;

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
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  backCardImage = loadImage(`cards/gray_back.png`);

  initializeDeck(["2C", "3H", "6S", "7D", "7D", "7D"]);
}

function initializeDeck(cardCodes) {
  var border = 0.05 * windowWidth;
  var spacing = floor(
    (windowWidth - 2 * border) / cardCodes.length - border / cardCodes.length
  );

  for (const [index, cardCode] of cardCodes.entries()) {
    x = border + index * spacing;

    deck.push(
      new Card(
        x,
        bottomY + (bottomHeight - cardHeight) / 2,
        cardWidth,
        cardHeight,
        loadImage(`cards/${cardCode}.png`),
        2,
        "C"
      )
    );
  }
}

function draw() {
  background(0);

  //Draw Bottom Background
  fill(255);
  noStroke();
  rectMode(CORNER);
  rect(0, bottomY, windowWidth, bottomHeight);

  // Draw center background
  rectMode(CENTER);
  rect(centerX, centerY, centerWidth, centerHeight);

  // draw trash background
  if (cardIsOverTrash) {
    rectMode(CENTER);
    fill(127);
    stroke(255, 0, 0);
    rect(trashX, trashY, trashWidth, trashHeight);
  } else {
    rectMode(CENTER);
    fill(127);
    rect(trashX, trashY, trashWidth, trashHeight);
  }

  //Draw card trash
  for (const card of trash) {
    card.display();
  }

  // draw deck background
  rectMode(CENTER);
  noStroke();
  fill(107);
  rect(deckX, deckY, deckWidth, deckHeight);

  image(
    backCardImage,
    deckX - deckWidth / 2 + (deckWidth - cardWidth) / 2,
    deckY - deckHeight / 2 + (deckHeight - cardHeight) / 2,
    cardWidth,
    cardHeight
  );

  for (const card of deck) {
    card.display();
  }
}

function mousePressed() {
  for (const [index, card] of deck.entries()) {
    if (card.contains(mouseX, mouseY)) {
      deck[index].setPreviousPosition();

      isCardBeingDragged = true;

      xOffset = mouseX - deck[index].v.x;
      yOffset = mouseY - deck[index].v.y;

      cardLockedIndex = index;
    }
  }
}

function mouseDragged() {
  card = deck[cardLockedIndex];
  if (isCardBeingDragged) {
    var x = mouseX - xOffset;
    var y = mouseY - yOffset;

    if (isOverTrash(mouseX, mouseY) && isCardBeingDragged) {
      cardIsOverTrash = true;
    } else {
      cardIsOverTrash = false;
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
  isCardOverTrash();
  isCardOverBottomBondaries();

  cardLockedIndex = undefined;
  cardIsOverTrash = false;
  isCardBeingDragged = false;
}

function isCardOverTrash() {
  if (cardIsOverTrash) {
    card = deck[cardLockedIndex];
    card.setPosition(trashX, trashY);

    trash.push(card);
    deck.splice(cardLockedIndex, 1);
  }
}

function isCardOverBottomBondaries() {
  if (isCardBeingDragged) {
    card = deck[cardLockedIndex];

    x = card.v.x;
    y = card.v.y;
    console.log(x, y);

    if (
      x >= 0 &&
      x <= windowWidth &&
      y <= bottomY &&
      y <= bottomY + bottomHeight
    ) {
      deck[cardLockedIndex].setPosition(
        card.previousPosition.x,
        card.previousPosition.y
      );
    }
  }
}

window.onresize = function () {
  // assigns new values for width and height variables
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  canvas.size(windowWidth, windowHeight);
};
