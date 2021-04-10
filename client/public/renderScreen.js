export default function renderScreen() {
  const sketch = (p) => {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    var backCardImage;

    //Global
    var sectionWeight;

    //CIRCLE
    var circleX;
    var circleY;
    var circleCoordinates = [];
    var circleDiameter;

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

    p.preload = function () {
      //GLOBAL
      sectionWeight = p.floor(windowHeight * 0.1);

      //TOP SECTION
      topHeight = sectionWeight;
      topY = 0;

      //BOTTOM SECTION
      bottomWidth = windowWidth;
      bottomHeight = p.floor(windowHeight * 0.2);
      bottomX = 0;
      bottomY = p.floor(windowHeight * 0.8);

      //RIGHT SECTION
      rightWidth = sectionWeight;
      rightHeight = windowHeight - bottomHeight - topHeight;
      rightX = p.floor(windowWidth - rightWidth);
      rightY = p.floor(topHeight);

      //LEFT SECTION
      leftWidth = sectionWeight;
      leftHeight = windowHeight - bottomHeight - topHeight;
      leftX = 0;
      leftY = topHeight;

      //CIRCLE
      circleX = p.floor(rightX + (windowWidth - rightX) / 2);
      circleY = rightHeight - 100;

      circleDiameter = p.floor(sectionWeight - sectionWeight * 0.2);

      //CARD SECTION
      cardWidth = p.floor(bottomHeight * 0.6);
      cardHeight = p.floor(bottomHeight * 0.85);

      //CENTER SECTION
      centerX = p.floor(windowWidth * 0.5);
      centerY = p.floor(windowHeight * 0.4);
      centerWidth = p.floor(windowWidth * 0.7);
      centerHeight = p.floor(windowHeight * 0.25);

      // TRASH SECTION
      trashWidth = p.floor(cardWidth + cardWidth * 0.5);
      trashHeight = p.floor(cardHeight + cardHeight * 0.5);
      trashX = p.floor(centerX);
      trashY = p.floor(centerY);

      for (let i = 1; i <= 4; i++) {
        var x = circleX;
        var c = p.ceil((rightY + rightHeight) / 5);
        var y = p.floor(circleDiameter / 2 + i * c);

        console.log({ x: x, y: y });

        circleCoordinates.push({ x: x, y: y });
      }
    };

    p.setup = function () {
      p.createCanvas(windowWidth, windowHeight);
      backCardImage = p.loadImage(`cards/gray_back.png`);

      initializeDeck(["2C", "3H"]);
    };

    function initializeDeck(cardCodes) {
      var border = 0.05 * windowWidth;
      var spacing = p.floor(
        (windowWidth - 2 * border) / cardCodes.length -
          border / cardCodes.length
      );

      for (const [index, cardCode] of cardCodes.entries()) {
        var x = border + index * spacing;

        deck.push(
          new Card(
            p,
            x,
            bottomY + (bottomHeight - cardHeight) / 2,
            cardWidth,
            cardHeight,
            p.loadImage(`cards/${cardCode}.png`),
            2,
            "C"
          )
        );
      }
    }

    p.draw = function () {
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
      p.point(rightX + rightWidth / 2, rightY + rightHeight / 2);

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

      for (const card of trash) {
        card.display();
      }

      // CARDS
      for (const card of deck) {
        card.display();
      }

      // console.table(circleCoordinates);

      p.fill(255);
      p.noStroke();
      for (const { x, y } of circleCoordinates) {
        p.circle(x, y, circleDiameter);
      }
    };

    p.mousePressed = function () {
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

    p.mouseDragged = function () {
      var card = deck[cardLockedIndex];
      if (isCardBeingDragged) {
        var x = p.mouseX - xOffset;
        var y = p.mouseY - yOffset;

        if (isOverTrash(p.mouseX, p.mouseY) && isCardBeingDragged) {
          cardIsOverTrash = true;
        } else {
          cardIsOverTrash = false;
        }

        if (x + card.width <= windowWidth && x > 0)
          deck[cardLockedIndex].v.x = x;
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

    p.mouseReleased = function () {
      isCardOverBottomBondaries();
      isCardOverTrash();

      cardLockedIndex = undefined;
      cardIsOverTrash = false;
      isCardBeingDragged = false;
    };

    function isCardOverTrash() {
      if (cardIsOverTrash) {
        var card = deck[cardLockedIndex];
        card.setPosition(
          trashX - trashWidth / 2 + (trashWidth - cardWidth) / 2,
          trashY - trashHeight / 2 + (trashHeight - cardHeight) / 2
        );

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
  };

  const asd = new p5(sketch);
  return { asd };
}
