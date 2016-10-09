
// Clears the canvas
function clearCanvas(ctx) {
  var oldStyle = ctx.fillStyle;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, world.canvas.width, world.canvas.height);
  ctx.fillStyle = oldStyle;
};

// Draws sprite from image location
function drawSprite(ctx, image, x, y, height, width, spriteH, spriteW, frameH, frameW) {
  ctx.drawImage(image, frameW * spriteW, frameH * spriteH, spriteW, spriteH, (x - width/2), (y - height/2), width, height);
};

function drawLine(ctx, thickness, startX, startY, endX, endY) {
  world.ctx.beginPath();
  world.ctx.moveTo(startX, startY);
  world.ctx.lineTo(endX, endY);
  world.ctx.lineWidth = thickness;
  world.ctx.stroke();
}

function isOnScreen(a, world) {
  return a.x + a.w > -world.viewport.x
      && a.y + a.h > -world.viewport.y
      && a.y < -world.viewport.y + world.canvas.height
      && a.x < -world.viewport.x + world.canvas.width;
}

function updateViewPort(world) {

  var avgX = 0;
  var avgY = 0;
  var numOfActivePlayers = 0;
  for (i in world.players) {
    var player = world.players[i];
    if (player === undefined) continue;
    numOfActivePlayers++;
    avgX += -player.x + world.canvas.width/2 - player.w/2;
    avgY += -player.y + world.canvas.height/2 - player.h/2;
  }
  avgX = avgX / numOfActivePlayers;
  avgY = avgY / numOfActivePlayers;

  var overX = false;
  var overY = false;
  for (i in world.players) {
    var player = world.players[i];
    if (player === undefined) continue;
    if (-avgX > player.x || -avgX + world.canvas.width < player.x + player.w) overX = true;
    if (-avgY > player.y || -avgY + world.canvas.height < player.y + player.h) overY = true;
  }
  if (!overX) world.viewport.x = avgX;
  if (!overY) world.viewport.y = avgY;
}

function losCollision(s, e, objects) {

  // Initialize collision vector
  var collisionVector = {o: []};

  // y = mx + b
  var m = (s.y - e.y) / (e.x - s.x);
  var b = s.y - (m * s.x);

  for (i in objects) {
    var o = objects[i];
    var actualX = NaN;
    var actualY = NaN;

    // Skip if the object is not even in the right quadrant
    if (s.x < e.x && s.y > e.y && (o.x + o.w < s.x || o.y > s.y)) continue;            // Upper right quadrant
    else if (s.x > e.x && s.y < e.y && (o.x > s.x || o.y + o.h < s.y)) continue;       // Lower left quadrant
    else if (s.x > e.x && s.y > e.y && (o.x > s.x || o.y > s.y)) continue;             // Upper left quadrant
    else if (s.x < e.x && s.y < e.y && (o.x + o.w < s.x || o.y + o.h < s.y)) continue; // Lower right quadrant

    // Handle point detection different based off of the quadrant
    if (s.x < e.x && s.y > e.y) {        // Upper right quadrant
      actualY = (m * o.x) + b;
      actualX = (o.y + o.h - b) / m;
      console.log("Upper right quadrant");
    } else if (s.x > e.x && s.y < e.y) { // Lower left quadrant
      actualY = (m * o.x + o.w) + b;
      actualX = (o.y - b) / m;
      console.log("Lower left quadrant");
    } else if (s.x > e.x && s.y > e.y) { // Upper left quadrant
      actualY = (m * o.x + o.w) + b;
      actualX = (o.y + o.h - b) / m;
      console.log("Upper left quadrant");
    } else {                             // Lower right quadrant
      actualY = (m * o.x) + b;
      actualX = (o.y - b) / m;
      console.log("Lower right quadrant");
    }

    // Detect actual collision
    if (between(actualY, o.y, o.y + o.h)) {
      collisionVector.o.push(o);
      console.log("x collision : " + actualY);
    } else if (between(actualX, o.x, o.x + o.w)) {
      collisionVector.o.push(o);
      console.log("y collision : " + actualX);
    }
  }

  if (collisionVector.o.length > 0) console.log("collision");
  else console.log("no collisions");
  return collisionVector;
}

function between(value, rangeStart, rangeEnd) {
  return value >= rangeStart && value <= rangeEnd;
}

function collides(a, objects, v) {

  // Initialize collision vector
  var collisionVector = {o: []};

  // For every object to check in the collision vector
  for (i in objects) {
    var b = objects[i];
    if (a === b) continue;
    if (b.solid && collide(a, b, v)) collisionVector.o.push(b);
  }

  // For every object collided with
  var collisionFound = false;
  for (i in collisionVector.o) {
    var b = collisionVector.o[i];

    if (collideLeft(a, b, v)) {
      collisionVector.x = (b.x - a.w - a.x);
      if (collisionVector.y === undefined) collisionVector.y = v.y;
      collisionFound = true;
    } else if (collideRight(a, b, v)) {
      collisionVector.x = -(a.x - b.x - b.w);
      if (collisionVector.y === undefined) collisionVector.y = v.y;
      collisionFound = true;
    } else if (collideTop(a, b, v)) {
      if (collisionVector.x === undefined) collisionVector.x = v.x;
      collisionFound = true;
      collisionVector.y = (b.y - a.h - a.y);
    } else if (collideBottom(a, b, v)) {
      if (collisionVector.x === undefined) collisionVector.x = v.x;
      collisionFound = true;
      collisionVector.y = -(a.y - b.h - b.y);
    } else if (!collisionFound){
      collisionVector.x = v.x;
      collisionVector.y = v.y;
    }
  }

  return collisionVector;
}

function collide(a, b, v) {
  return (a.x <= b.x + b.w && a.x + a.w >= b.x && a.y <= b.y + b.h && a.y + a.h >= b.y);
}

function collideLeft(a, b, v) {
  return collide(a, b, v) && (a.x + a.w - v.x <= b.x);
}

function collideRight(a, b, v) {
  return collide(a, b, v) && (a.x - v.x >= b.x + b.w);
}

function collideTop(a, b, v) {
  return collide(a, b, v) && (a.y + a.h - v.y <= b.y);
}

function collideBottom(a, b, v) {
  return collide(a, b, v) && (a.y -v.y >= b.y + b.h);
}
