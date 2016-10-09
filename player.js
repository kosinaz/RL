var RL = RL || {};

RL.Player = function (x, y, scheduler, engine) {
  'use strict';
  RL.Actor.call(this, x, y, scheduler);
  this.engine = engine;
};
RL.Player.prototype = Object.create(RL.Actor.prototype);
RL.Player.prototype.constructor = RL.Player;

RL.Player.prototype.act = function () {
  'use strict';
  RL.drawExplored();
  RL.fov.compute(this.x, this.y, 80, RL.drawXY);
  this.engine.lock();
  this.scheduler.setDuration(1);
};

RL.Player.prototype.move = function () {
  'use strict';
  this.moveTowardsTarget();
  this.engine.unlock();
};
