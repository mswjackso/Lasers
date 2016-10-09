var CONTROLLER_SLOP = .1;
var CONTROLLER_THRESH = .25;

function Player(x, y, sprite, playerNumber) {

  GameObject.call(this, x, y, sprite, 50, 50, direction.up);
  this.gamepad = navigator.getGamepads()[playerNumber-1];
  this.playerNumber = playerNumber;
  this.moveSpeed = 3;
  this.rotate = 90 * Math.PI / 180;
  this.spriteH = 85;
  this.spriteW = 85;
  this.c = 3;
  this.d = direction.right;
  this.atEdge = false;

  // Beam properties
  this.beam = {
    x: 0,
    y: 0,
    length: 300,
    thickness: 1,
    thicknessMax: 1,
    thicknessRate: 0.3,
    firing: false
  };
};
Player.prototype = Object.create(GameObject.prototype);
Player.prototype.constructor = Player;

Player.prototype.draw = function(world) {
  var ctx = world.ctx;
  ctx.save();

  ctx.translate(this.x + world.viewport.x, this.y + world.viewport.y);
  ctx.translate(this.w/2, this.h/2);

  // Draw beam
  if (this.beam.firing) {
    drawLine(ctx,this.beam.thickness, 0, 0, this.beam.x, this.beam.y)
  }

  // ctx.rotate(this.rotate);
  drawSprite(ctx, this.sprite, 0, 0, this.h, this.w, this.spriteH, this.spriteW, this.d, this.c);

  ctx.restore();
};
Player.prototype.update = function(world) {

  // Update current gamepad input
  this.gamepad = navigator.getGamepads()[this.playerNumber-1];

  // Grab vector
  var vector = {
    x: this.gamepad.axes[2],
    y: this.gamepad.axes[3]
  };

  // Set rotation based on gamepad and update movements
  this.rotate = calcRads(vector, this.rotate);

  // Check if colliding with anything
  var velocity = {x: this.gamepad.axes[0] * this.moveSpeed, y: this.gamepad.axes[1] * this.moveSpeed};
  var collision = collides(this, world.objects, velocity);
  if (collision.o.length == 0) {
    if (Math.abs(this.gamepad.axes[0]) > CONTROLLER_SLOP) this.x += velocity.x;
    if (Math.abs(this.gamepad.axes[1]) > CONTROLLER_SLOP) this.y += velocity.y;
  } else {
    this.x += collision.x;
    this.y += collision.y;
    for (i in collision.o) collision.o[i].handleCollision(this);
  }
  this.x = Number(this.x.toFixed(0));
  this.y = Number(this.y.toFixed(0));

  // Correct for running off screen
  if (this.x > -world.viewport.x + world.canvas.width - this.w) this.x = world.canvas.width - world.viewport.x - this.w;
  else if (this.x < -world.viewport.x) this.x = -world.viewport.x;
  if (this.y > -world.viewport.y + world.canvas.height - this.h) this.y = world.canvas.height - world.viewport.y - this.h;
  else if (this.y < -world.viewport.y) this.y = -world.viewport.y;

  // Calculate new beam properties
  this.beam.firing = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2)) > .5;
  if (this.beam.firing) {

    this.beam.x = Math.cos(this.rotate) * this.beam.length;
    this.beam.y = Math.sin(this.rotate) * this.beam.length;

    collision = losCollision({x: this.x + (this.w / 2), y: this.y + (this.h / 2)}, {x: this.x + this.beam.x, y: this.y + this.beam.y}, world.objects);

    this.beam.thickness = Math.min(this.beam.thickness + this.beam.thicknessRate, this.beam.thicknessMax);
  } else {
    this.beam.thickness = 1;
  }

  // Call parent update
  this.super.update.call(this);
};

function calcRads(v, fallback) {
  var rads = fallback;
  if (v.x <= CONTROLLER_THRESH && v.y <= CONTROLLER_THRESH && v.x >= -CONTROLLER_THRESH && v.y >= -CONTROLLER_THRESH) return rads;
  rads = Math.atan(v.y / v.x);
  if ((v.x < 0 && v.y >= 0) || (v.x < 0 && v.y <= 0 )) rads -= Math.PI;
  return rads;
}
