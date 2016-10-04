var ROT = ROT || {};
var RL = {};

RL.init = function () {
  'use strict';
  RL.display = new ROT.Display();
  document.body.appendChild(RL.display.getContainer());
  RL.display.setOptions({
    fontSize: RL.display.computeFontSize(window.innerWidth, window.innerHeight)
  });
  RL.fov = new ROT.FOV.PreciseShadowcasting(function (x, y) {
    return !RL.map[x + ',' + y];
  });
  RL.explored = [];
  RL.generateMap();
  RL.fov.compute(RL.hero.x, RL.hero.y, 80, RL.drawXY);
};

RL.generateMap = function () {
  'use strict';
  var digger = new ROT.Map.Digger();
  RL.map = [];
  RL.enemies = [];
  digger.create(function (x, y, value) {
    if (!value && Math.random() * 100 < 1) {
      RL.enemies.push({
        x: x,
        y: y
      });
    }
    RL.map[x + ',' + y] = value;
  });
  RL.hero = {
    x: 40,
    y: 12
  };
};

RL.move = function (actor, x, y) {
  'use strict';
  var i;
  if (!(RL.map[(actor.x + x) + ',' + (actor.y + y)])) {
    if (RL.hero.x === actor.x + x && RL.hero.y === actor.y + y) {
      return;
    }
    for (i = 0; i < RL.enemies.length; i += 1) {
      if (RL.enemies[i].x === actor.x + x && RL.enemies[i].y === actor.y + y) {
        return;
      }
    }
    actor.x += x;
    actor.y += y;
  }
};

RL.moveHero = function () {
  'use strict';
  if (RL.hero) {
    if (RL.mouse.x < RL.hero.x) {
      RL.move(RL.hero, -1, 0);
    } else if (RL.mouse.x > RL.hero.x) {
      RL.move(RL.hero, 1, 0);
    }
    if (RL.mouse.y > RL.hero.y) {
      RL.move(RL.hero, 0, 1);
    } else if (RL.mouse.y < RL.hero.y) {
      RL.move(RL.hero, 0, -1);
    }
    RL.moveEnemies();
    RL.drawExplored();
    RL.fov.compute(RL.hero.x, RL.hero.y, 80, RL.drawXY);
  }
};

RL.moveEnemies = function () {
  'use strict';
  var i, x, y;
  for (i = 0; i < RL.enemies.length; i += 1) {
    x = Math.floor(Math.random() * 3 - 1);
    y = Math.floor(Math.random() * 3 - 1);
    RL.move(RL.enemies[i], x, y);
  }
};

RL.drawExplored = function () {
  'use strict';
  var x, y, i;
  for (x = 0; x < 80; x += 1) {
    for (y = 0; y < 25; y += 1) {
      if (RL.explored[x + ',' + y] !== undefined) {
        RL.display.draw(x, y, RL.explored[x + ',' + y] ? '#' : '.', '#888');
      }
    }
  }
};

RL.drawXY = function (x, y, r, visibility) {
  'use strict';
  var i;
  RL.explored[x + ',' + y] = RL.map[x + ',' + y];
  for (i = 0; i < RL.enemies.length; i += 1) {
    if (RL.enemies[i].x === x && RL.enemies[i].y === y) {
      RL.display.draw(x, y, String.fromCharCode(i + 97));
      return;
    }
  }
  if (RL.hero.x === x && RL.hero.y === y) {
    RL.display.draw(RL.hero.x, RL.hero.y, '@');
    return;
  }
  RL.display.draw(x, y, RL.map[x + ',' + y] ? '#' : '.');
};
