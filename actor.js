var RL = RL || {};
var ROT = ROT || {};

RL.Actor = function (x, y, level, health, scheduler) {
  'use strict';
  this.x = x;
  this.y = y;
  this.level = level;
  this.health = health;
  this.target = {
    x: this.x,
    y: this.y
  };
  this.fov = new ROT.FOV.PreciseShadowcasting(function (x, y) {
    return !this.level.map[x + ',' + y];
  }.bind(this));
  this.scheduler = scheduler;
  this.scheduler.add(this, true);
};

RL.Actor.prototype.act = function () {
  'use strict';
  this.fov.compute(this.x, this.y, 80, this.addTarget.bind(this));
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
    this.move(this.x - 1, this.y);
  } else if (this.target.x > this.x) {
    this.move(this.x + 1, this.y);
  }
  if (this.target.y > this.y) {
    this.move(this.x, this.y + 1);
  } else if (this.target.y < this.y) {
    this.move(this.x, this.y - 1);
  }
};

RL.Actor.prototype.move = function (x, y) {
  'use strict';
  if (this.level.map[x + ',' + y]) {
    return;
  }
  if (RL.player.x === x &&
      RL.player.y === y &&
      RL.player.level === this.level) {
    RL.player.hit();
    return;
  }
  this.x = x;
  this.y = y;
};

RL.Actor.prototype.hit = function () {
  'use strict';
  this.health -= 1;
  if (this.health < 1) {
    this.scheduler.remove(this);
    this.level.enemies.splice(this.level.enemies.indexOf(this), 1);
  }
};
