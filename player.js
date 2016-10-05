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
  this.engine.lock();
  this.scheduler.setDuration(1);
};
