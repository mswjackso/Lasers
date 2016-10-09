function Wall(x, y, h, w, sprite) {
  GameObject.call(this, x, y, sprite, h, w, direction.up);
};
Wall.prototype = Object.create(GameObject.prototype);
Wall.prototype.constructor = Wall;
