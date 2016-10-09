var direction = {
  right: 0,
  left: 1,
  down: 2,
  up: 3,
  up_left: 4,
  down_left: 5,
  up_right: 6,
  down_right: 7
};

function GameObject(x, y, sprite, h, w, d) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
  this.h = h;
  this.w = w;
  this.d = d;
  this.solid = true;
  this.super = GameObject.prototype;
};
GameObject.prototype.draw = function(world) {
  if (!isOnScreen(this, world)) return;
  var ctx = world.ctx;
  ctx.drawImage(this.sprite, this.x + world.viewport.x, this.y + world.viewport.y, this.w, this.h);
};
GameObject.prototype.update = function(world) {
};
GameObject.prototype.handleCollision = function(that) {
};
