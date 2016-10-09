var RL = RL || {};

RL.Actor = function (x, y, scheduler) {
  'use strict';
  this.x = x;
  this.y = y;
  this.target = {
    x: x,
    y: y
  };
  this.scheduler = scheduler;
  this.scheduler.add(this, true);
};

RL.Actor.prototype.act = function () {
  'use strict';
  RL.fov.compute(this.x, this.y, 80, this.addTarget.bind(this));
  this.moveTowardsTarget();
  this.scheduler.setDuration(2);
};

RL.Actor.prototype.addTarget = function (x, y, r, visibility) {
  'use strict';
  if (x === RL.player.x && y === RL.player.y) {
    this.target = {
      x: x,
      y: y
    };
  }
};

RL.Actor.prototype.moveTowardsTarget = function () {
  'use strict';
  if (this.target.x < this.x) {
    RL.move(this, -1, 0);
  } else if (this.target.x > this.x) {
    RL.move(this, 1, 0);
  }
  if (this.target.y > this.y) {
    RL.move(this, 0, 1);
  } else if (this.target.y < this.y) {
    RL.move(this, 0, -1);
  }
};
