var ROT = ROT || {};
var RL = {};

RL.init = function () {
  'use strict';
  RL.display = new ROT.Display();
  document.body.appendChild(RL.display.getContainer());
  RL.display.setOptions({
    fontSize: RL.display.computeFontSize(window.innerWidth, window.innerHeight)
  });
  RL.digger = new ROT.Map.Digger();
  RL.fov = new ROT.FOV.PreciseShadowcasting(function (x, y) {
    return !RL.current.map[x + ',' + y];
  });
  RL.level = 0;
  RL.levels = [];
  RL.levels[RL.level] = {};
  RL.current = RL.levels[RL.level];
  RL.generateMap();
  RL.fov.compute(RL.hero.x, RL.hero.y, 80, RL.drawXY);
};

RL.changeLevel = function (level) {
  'use strict';
  RL.level = level;
  if (RL.levels[RL.level]) {
    RL.current = RL.levels[RL.level];
    RL.hero = {
      x: RL.current.rooms[0].getCenter()[0],
      y: RL.current.rooms[0].getCenter()[1]
    };
  } else {
    RL.levels[RL.level] = {};
    RL.current = RL.levels[RL.level];
    RL.generateMap();
  }
  RL.fov.compute(RL.hero.x, RL.hero.y, 80, RL.drawXY);
};

RL.generateMap = function () {
  'use strict';
  RL.current.map = [];
  RL.current.explored = [];
  RL.current.enemies = [];
  RL.digger.create(function (x, y, value) {
    if (!value && Math.random() * 100 < 1) {
      RL.current.enemies.push({
        x: x,
        y: y
      });
    }
    RL.current.map[x + ',' + y] = value;
  });
  RL.current.rooms = RL.digger.getRooms();
  RL.hero = {
    x: RL.current.rooms[0].getCenter()[0],
    y: RL.current.rooms[0].getCenter()[1]
  };
  RL.current.exit = {
    x: RL.current.rooms[RL.current.rooms.length - 1].getCenter()[0],
    y: RL.current.rooms[RL.current.rooms.length - 1].getCenter()[1],
    level: Math.floor(Math.random() * 10)
  };
};

RL.move = function (actor, x, y) {
  'use strict';
  var i;
  if (RL.hero.x === RL.current.exit.x && RL.hero.y === RL.current.exit.y) {
    RL.changeLevel(RL.current.exit.level);
  }
  if (!(RL.current.map[(actor.x + x) + ',' + (actor.y + y)])) {
    if (RL.hero.x === actor.x + x && RL.hero.y === actor.y + y) {
      return;
    }
    for (i = 0; i < RL.current.enemies.length; i += 1) {
      if (RL.current.enemies[i].x === actor.x + x &&
          RL.current.enemies[i].y === actor.y + y) {
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
  for (i = 0; i < RL.current.enemies.length; i += 1) {
    x = Math.floor(Math.random() * 3 - 1);
    y = Math.floor(Math.random() * 3 - 1);
    RL.move(RL.current.enemies[i], x, y);
  }
};

RL.drawExplored = function () {
  'use strict';
  var x, y, i;
  for (x = 0; x < 80; x += 1) {
    for (y = 0; y < 25; y += 1) {
      RL.display.draw(x, y, ' ');
      if (RL.current.explored[x + ',' + y] !== undefined) {
        RL.display.draw(
          x,
          y,
          RL.current.explored[x + ',' + y] ? '#' : '.',
          '#444'
        );
        if (RL.current.exit.x === x && RL.current.exit.y === y) {
          RL.display.draw(x, y, '>', '#444');
        }
      }
    }
  }
};

RL.drawXY = function (x, y, r, visibility) {
  'use strict';
  var i;
  RL.current.explored[x + ',' + y] = RL.current.map[x + ',' + y];
  for (i = 0; i < RL.current.enemies.length; i += 1) {
    if (RL.current.enemies[i].x === x && RL.current.enemies[i].y === y) {
      RL.display.draw(x, y, String.fromCharCode(i + 97));
      return;
    }
  }
  if (RL.hero.x === x && RL.hero.y === y) {
    RL.display.draw(RL.hero.x, RL.hero.y, '@');
    return;
  }
  if (RL.current.exit.x === x && RL.current.exit.y === y) {
    RL.display.draw(x, y, '>');
    return;
  }
  RL.display.draw(x, y, RL.current.map[x + ',' + y] ? '#' : '.');
};
