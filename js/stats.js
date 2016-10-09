var stats = {
  fps: 0.0,
  frame: 0,
  displayFps: function (ctx) {

    this.frame++;

    var oldFont = ctx.font;
    var oldStyle = ctx.fillStyle;

    ctx.font = "20px Georgia";
    ctx.fillStyle = "black";
    ctx.fillText("FPS: " + stats.fps, 10, 20);

    ctx.font = oldFont;
    ctx.fillStyle = oldStyle;
  }
};

stats.fpsTimer = window.setInterval(function() {
  stats.fps = stats.frame;
  stats.frame = 0;
}, 1000);
