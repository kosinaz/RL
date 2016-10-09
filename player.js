var RL = RL || {};

RL.Player = function (x, y, level, health, scheduler, engine) {
  'use strict';
  RL.Actor.call(this, x, y, level, health, scheduler);
  this.engine = engine;
};
RL.Player.prototype = Object.create(RL.Actor.prototype);
RL.Player.prototype.constructor = RL.Player;

RL.Player.prototype.act = function () {
  'use strict';
  this.drawExplored();
  this.fov.compute(this.x, this.y, 80, this.drawXY.bind(this));
  this.engine.lock();
  this.scheduler.setDuration(1);
};

RL.Player.prototype.moveAndUnlock = function () {
  'use strict';
  this.moveTowardsTarget();
  this.engine.unlock();
};

RL.Player.prototype.move = function (x, y) {
  'use strict';
  var i;
  if (this.level.map[x + ',' + y]) {
    return;
  }
  if (this.level.entrance) {
    if (this.level.entrance.x === x && this.level.entrance.y === y) {
      this.level = this.level.entrance.level;
      this.x = this.level.exit.x - 1;
      this.y = this.level.exit.y;
      return;
    }
  }
  if (this.level.exit.x === x && this.level.exit.y === y) {
    if (this.level.exit.level === undefined) {
      this.level.exit.level = new RL.Level(this.scheduler, this.level);
    }
    this.level = this.level.exit.level;
    this.x = this.level.entrance.x - 1;
    this.y = this.level.entrance.y;
    return;
  }
  for (i = 0; i < this.level.enemies.length; i += 1) {
    if (this.level.enemies[i].x === x && this.level.enemies[i].y === y) {
      this.level.enemies[i].hit();
      return;
    }
  }
  this.x = x;
  this.y = y;
};

RL.Player.prototype.hit = function () {
  'use strict';
  this.health -= 1;
  if (this.health < 1) {
    RL.startNewGame();
  }
};

RL.Player.prototype.drawExplored = function () {
  'use strict';
  var x, y, i;
  for (x = 0; x < 80; x += 1) {
    for (y = 0; y < 25; y += 1) {
      RL.display.draw(x, y, ' ');
      if (this.level.explored[x + ',' + y] !== undefined) {
        RL.display.draw(
          x,
          y,
          this.level.explored[x + ',' + y] ? '#' : '.',
          '#444'
        );
        if (this.level.entrance) {
          if (this.level.entrance.x === x && this.level.entrance.y === y) {
            RL.display.draw(x, y, '<', '#444');
          }
        }
        if (this.level.exit.x === x && this.level.exit.y === y) {
          RL.display.draw(x, y, '>', '#444');
        }
      }
    }
  }
  if (this.health) {
    RL.display.drawText(0, 0, this.health + ' ');
  }
};

RL.Player.prototype.drawXY = function (x, y, r, visibility) {
  'use strict';
  var i;
  this.level.explored[x + ',' + y] = this.level.map[x + ',' + y];
  for (i = 0; i < this.level.enemies.length; i += 1) {
    if (this.level.enemies[i].x === x && this.level.enemies[i].y === y) {
      RL.display.draw(x, y, String.fromCharCode(i + 97));
      return;
    }
  }
  if (this.x === x && this.y === y) {
    RL.display.draw(x, y, '@');
    return;
  }
  if (this.level.entrance) {
    if (this.level.entrance.x === x && this.level.entrance.y === y) {
      RL.display.draw(x, y, '<');
      return;
    }
  }
  if (this.level.exit.x === x && this.level.exit.y === y) {
    RL.display.draw(x, y, '>');
    return;
  }
  RL.display.draw(x, y, this.level.map[x + ',' + y] ? '#' : '.');
};
