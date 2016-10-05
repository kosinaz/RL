var RL = RL || {};

RL.Actor = function (x, y, scheduler) {
  'use strict';
  this.x = x;
  this.y = y;
  this.scheduler = scheduler;
  this.scheduler.add(this, true);
};

RL.Actor.prototype.act = function () {
  'use strict';
  var x, y;
  x = Math.floor(Math.random() * 3 - 1);
  y = Math.floor(Math.random() * 3 - 1);
  RL.move(this, x, y);
  this.scheduler.setDuration(2);
};
