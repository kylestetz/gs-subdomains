var frames = new Bacon.Bus();

function raf() {
  requestAnimationFrame(raf);
  frames.push();
}
raf();

module.exports = frames;