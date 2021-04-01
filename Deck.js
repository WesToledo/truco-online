// function Deck() {
//   this.cards = [];
// }

// Deck.prototype.add = function (card) {
//   this.cards.push(card);
// };

// Deck.prototype.size = function () {
//   return this.cards.length;
// };

// Deck.prototype.get = function (i) {
//   return this.cards[i];
// };

// Deck.prototype.getAll = function () {
//   return this.cards;
// };

// //remove the first element of the array and returns it
// Deck.prototype.shift = function () {
//   return this.cards.shift();
// };

// Deck.prototype.update = function (i, card) {
//   console.log(i);
//   this.cards[i] = card;
// };


function Card(w, h, img, value, naipe) {
  this.v = new createVector(0, 500);
  this.width = w;
  this.height = h;

  this.img = img;
  this.value = value;
  this.naipe = naipe;
}

Card.prototype.display = function () {
  image(this.img, this.v.x, this.v.y, this.width, this.height);
};

Card.prototype.contains = function (x, y) {
  return (
    x >= this.v.x &&
    x <= this.v.x + this.width &&
    y >= this.v.y &&
    y <= this.v.y + this.height
  );
};

Card.prototype.setX = function (x) {
  this.v.x = x;
};

Card.prototype.setY = function (y) {
  this.v.y = y;
};

