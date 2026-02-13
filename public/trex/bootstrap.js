/* Hardening wrapper around upstream runner.
 * Keep game logic intact while reducing non-essential API surface.
 */
if (window.Runner) {
  window.Runner.prototype.loadSounds = function () {};
  window.Runner.prototype.playSound = function () {};
}

function primeRunnerScale() {
  const runner = window.Runner && window.Runner.instance_;
  if (!runner || !runner.containerEl || !runner.tRex) {
    window.requestAnimationFrame(primeRunnerScale);
    return;
  }

  // Avoid the tiny pre-start state by entering arcade layout before first jump.
  runner.activated = true;
  runner.setArcadeMode();
  runner.adjustDimensions();
  runner.containerEl.style.width = `${runner.dimensions.WIDTH}px`;
  runner.containerEl.style.height = `${runner.dimensions.HEIGHT}px`;
  runner.tRex.draw(0, 0);
}

window.requestAnimationFrame(primeRunnerScale);
