import Card from "./Card.js";

export default function renderGameScreen(p, game) {
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  //Global
  var lateralSectionsWeight;

  //CIRCLE
  var avatarCoordinates = [];
  var avatarDiameter;

  //Top
  var topHeight;
  var topY;

  // Bottom
  var bottomHeight;
  var bottomWidth;
  var bottomX;
  var bottomY;

  // Right
  var rightWidth;
  var rightHeight;
  var rightX;
  var rightY;

  // Left
  var leftWidth;
  var leftHeight;
  var leftX;
  var leftY;

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

  // draggable
  var xOffset;
  var yOffset;

  var deck = [];

  var trash = [];
  var cardIsOverTrash = false;

  renderGameScreen.prototype.preload = function () {
    this.setPositionElements(windowWidth, windowHeight);

    const players = game.getPlayers();
    const playersId = Object.keys(players);

    const amountPlayers = playersId.length;

    var rightPlayersId;
    var centerPlayersId;
    var leftPlayersId;

    switch (true) {
      case amountPlayers > 3:
        const aux = amountPlayers % 3;
        rightPlayersId = playersId.splice(0, aux);
        centerPlayersId = playersId.splice(0, playersId.length - aux);
        leftPlayersId = playersId.splice(0, playersId.length);
        break;
      case amountPlayers === 3:
        rightPlayersId = playersId.splice(0, 1);
        centerPlayersId = playersId.splice(0, 1);
        leftPlayersId = playersId.splice(0, 1);
        break;
      case amountPlayers === 2:
        rightPlayersId = playersId.splice(0, 1);
        centerPlayersId = [];
        leftPlayersId = playersId.splice(0, 1);
        break;
      case amountPlayers === 1:
        rightPlayersId = [];
        centerPlayersId = [];
        leftPlayersId = [];
        break;
      default:
        break;
    }

    var lateralSpacing = p.ceil(rightHeight / (rightPlayersId.length + 1));

    // CIRCLES RIGHT
    for (const [index, playerId] of rightPlayersId.entries()) {
      var x = rightX + rightWidth / 2;
      var y = p.floor(
        avatarDiameter + (index + 1) * lateralSpacing + avatarDiameter / 4
      );

      avatarCoordinates.push({
        x: x,
        y: y,
        img: p.loadImage(players[playerId].imgUrl),
      });
    }

    // CIRCLES LEFT
    for (const [index, playerId] of leftPlayersId.entries()) {
      var x = leftWidth / 2;
      var y = p.floor(
        avatarDiameter + (index + 1) * lateralSpacing + avatarDiameter / 4
      );

      avatarCoordinates.push({
        x: x,
        y: y,
        img: p.loadImage(players[playerId].imgUrl),
      });
    }

    // CIRCLES CENTER
    var spacing = windowWidth / (centerPlayersId.length + 1);
    for (const [index, playerId] of centerPlayersId.entries()) {
      var y = topHeight / 2;
      var x = p.floor((index + 1) * spacing);

      avatarCoordinates.push({
        x: x,
        y: y,
        img: p.loadImage(players[playerId].imgUrl),
      });
    }
  };

  renderGameScreen.prototype.setPositionElements = function () {
    //GLOBAL
    lateralSectionsWeight = p.floor(windowHeight * 0.1);

    //TOP SECTION
    topHeight = lateralSectionsWeight;
    topY = 0;

    //BOTTOM SECTION
    bottomWidth = windowWidth;
    bottomHeight = p.floor(windowHeight * 0.2);
    bottomX = 0;
    bottomY = p.floor(windowHeight * 0.8);

    //RIGHT SECTION
    rightWidth = lateralSectionsWeight;
    rightHeight = windowHeight - bottomHeight - topHeight;
    rightX = windowWidth - rightWidth;
    rightY = p.floor(topHeight);

    //LEFT SECTION
    leftWidth = lateralSectionsWeight;
    leftHeight = windowHeight - bottomHeight - topHeight;
    leftX = 0;
    leftY = topHeight;

    avatarDiameter = p.floor(
      lateralSectionsWeight - lateralSectionsWeight * 0.2
    );

    //CARD SECTION
    cardWidth = p.floor(bottomHeight * 0.6);
    cardHeight = p.floor(bottomHeight * 0.85);

    //CENTER SECTION
    centerX = p.floor(windowWidth * 0.5);
    centerY = p.floor(windowHeight * 0.4);
    centerWidth = p.floor(windowWidth * 0.7);
    centerHeight = p.floor(windowHeight * 0.25);

    // TRASH SECTION
    trashWidth = p.ceil(cardWidth + cardWidth * 0.5);
    trashHeight = p.ceil(cardHeight + cardHeight * 0.5);
    trashX = p.ceil(centerX);
    trashY = p.ceil(centerY);
  };

  renderGameScreen.prototype.setup = function () {
    // p.createCanvas(windowWidth, windowHeight);

    initializeDeck(["2C", "3H", "3H", "3H", "3H"]);
  };

  function initializeDeck(cardCodes) {
    var lateralBorder = 0.05 * windowWidth;

    // var spacing = p.floor(
    //   (windowWidth - 2 * lateralBorder) / cardCodes.length -
    //     lateralBorder / cardCodes.length
    // );

    var spacing = (windowWidth - 2 * lateralBorder) / (cardCodes.length + 1);

    for (const [index, cardCode] of cardCodes.entries()) {
      var x = p.floor((index + 1) * spacing + cardWidth / 4);
      var y = bottomY + bottomHeight / 2;

      deck.push(
        new Card(
          p,
          x,
          y,
          cardWidth,
          cardHeight,
          p.loadImage(`cards/${cardCode}.png`),
          2,
          "C"
        )
      );
    }
  }

  renderGameScreen.prototype.draw = function () {
    p.background(p.color("green"));

    // TOP
    p.fill(1, 99, 15);
    p.noStroke();
    p.rectMode(p.CORNER);
    p.rect(0, topY, windowWidth, topHeight);

    // BOTTOM
    p.fill(29, 87, 38);
    p.noStroke();
    p.rectMode(p.CORNER);
    p.rect(bottomX, bottomY, bottomWidth, bottomHeight);

    // RIGHT
    p.fill(1, 99, 15);
    p.noStroke();
    p.rectMode(p.CORNER);
    p.rect(rightX, rightY, rightWidth, rightHeight);

    p.stroke("white");
    p.strokeWeight(10);
    //p.point(rightX + rightWidth / 2, rightY + rightHeight / 2);

    // LEFT
    p.fill(1, 99, 15);
    p.noStroke();
    p.rectMode(p.CORNER);
    p.rect(leftX, leftY, leftWidth, leftHeight);

    // //CIRCLE
    // p.fill(255);
    // p.noStroke();
    // p.circle(circleX, circleY, circleDiameter);

    // Draw center background
    // rectMode(CENTER);
    // rect(centerX, centerY, centerWidth, centerHeight);

    // TRASH
    p.fill(1, 99, 15);
    if (cardIsOverTrash) {
      p.strokeWeight(3);
      p.stroke(255);
      p.fill(15, 77, 24);
    }
    p.rectMode(p.CENTER);
    p.rect(trashX, trashY, trashWidth, trashHeight);

    // console.table(circleCoordinates);

    p.fill(255);
    p.noStroke();
    for (const { x, y, img } of avatarCoordinates) {
      //p.circle(x, y, circleDiameter);

      p.image(img, x, y, avatarDiameter, avatarDiameter);
      p.imageMode(p.CENTER);
    }

    for (const card of trash) {
      p.rectMode(p.CORNER);
      card.display();
    }

    // CARDS
    for (const card of deck) {
      p.rectMode(p.CENTER);
      card.display();
    }
  };

  renderGameScreen.prototype.mousePressed = function () {
    for (const [index, card] of deck.entries()) {
      if (card.contains(p.mouseX, p.mouseY)) {
        deck[index].setPreviousPosition();

        isCardBeingDragged = true;

        xOffset = p.mouseX - deck[index].v.x;
        yOffset = p.mouseY - deck[index].v.y;

        cardLockedIndex = index;
      }
    }
  };

  renderGameScreen.prototype.mouseDragged = function () {
    var card = deck[cardLockedIndex];
    if (isCardBeingDragged) {
      var x = p.mouseX - xOffset;
      var y = p.mouseY - yOffset;

      if (isOverTrash(p.mouseX, p.mouseY) && isCardBeingDragged) {
        cardIsOverTrash = true;
      } else {
        cardIsOverTrash = false;
      }

      if (x + card.width <= windowWidth && x > 0) deck[cardLockedIndex].v.x = x;
      if (y + card.height <= windowHeight && y > 0)
        deck[cardLockedIndex].v.y = y;
    }
  };

  function isOverTrash(x, y) {
    return (
      x >= trashX - trashWidth / 2 &&
      x <= trashX - trashWidth / 2 + trashWidth &&
      y >= trashY - trashHeight / 2 &&
      y <= trashY - trashHeight / 2 + trashHeight
    );
  }

  renderGameScreen.prototype.mouseReleased = function () {
    isCardOverBottomBondaries();
    isCardOverTrash();

    cardLockedIndex = undefined;
    cardIsOverTrash = false;
    isCardBeingDragged = false;
  };

  function isCardOverTrash() {
    if (cardIsOverTrash) {
      var card = deck[cardLockedIndex];
      card.setPosition(trashX, trashY);

      trash.push(card);
      deck.splice(cardLockedIndex, 1);
    }
  }

  function isCardOverBottomBondaries() {
    if (isCardBeingDragged) {
      var card = deck[cardLockedIndex];

      var x = card.v.x;
      var y = card.v.y;

      if (
        x >= 0 &&
        x <= windowWidth &&
        y - card.height / 2 <= bottomY &&
        y <= bottomY + bottomHeight
      ) {
        deck[cardLockedIndex].setPosition(
          card.previousPosition.x,
          card.previousPosition.y
        );
      }
    }
  }
}
