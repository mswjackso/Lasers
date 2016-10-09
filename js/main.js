
// Global World
var world = {
  objects: [],
  players: [undefined, undefined, undefined, undefined],
  background: {},
  viewport: {x: 0, y: 0},
  controllers: navigator.getGamepads()
};

// When the document is done initialize everything
$(document).ready(init);
function init() {
  world.canvas = $("#canvas")[0];
  world.ctx = world.canvas.getContext("2d");
  world.canvas.height = 800;
  world.canvas.width = 1000;
  window.requestAnimationFrame(tick);

  world.objects.push(new Wall(0, 0, 600, 50, $("#sprite_object_wall_brick")[0]));
  // world.objects.push(new Wall(0, 300, 50, 600, $("#sprite_object_wall_brick")[0]));
  // world.objects.push(new Wall(0, 403, 50, 600, $("#sprite_object_wall_brick")[0]));
  // world.objects.push(new Wall(600, 200, 5, 5, $("#sprite_object_wall_brick")[0]));
  // world.objects.push(new Wall(650, 100, 1, 100, $("#sprite_object_wall_brick")[0]));
}

// The method called at each step
function tick() {

  clearCanvas(world.ctx);
  world.controllers = navigator.getGamepads();
  if (world.controllers[0] !== undefined && world.players[0] === undefined) world.players[0] = new Player(200, 200, $("#sprite_object_player_player0")[0], 1);
  if (world.controllers[1] !== undefined && world.players[1] === undefined) world.players[1] = new Player(200, 200, $("#sprite_object_player_player0")[0], 2);
  if (world.controllers[2] !== undefined && world.players[2] === undefined) world.players[2] = new Player(200, 200, $("#sprite_object_player_player0")[0], 3);
  if (world.controllers[3] !== undefined && world.players[3] === undefined) world.players[3] = new Player(200, 200, $("#sprite_object_player_player0")[0], 4);

  // Update and draw every item in the world
  for (object in world.objects) world.objects[object].update(world);
  for (object in world.objects) world.objects[object].draw(world);

  // Update players last
  for (player in world.players) if (world.players[player] !== undefined) world.players[player].update(world);
  for (player in world.players) if (world.players[player] !== undefined) world.players[player].draw(world);

  updateViewPort(world);

  stats.displayFps(world.ctx);
  window.requestAnimationFrame(tick);
}
