var ROT = ROT || {};
var RL = {};
window.addEventListener('load', function (e) {
  'use strict';
  window.removeEventListener('load', this);
  RL.init();
});

window.addEventListener('keypress', function (e) {
  'use strict';
  var x, y, i;
  if (RL.hero) {
    if (e.keyCode === 97) {
      RL.move(RL.hero, -1, 0);
    } else if (e.keyCode === 100) {
      RL.move(RL.hero, 1, 0);
    } else if (e.keyCode === 115) {
      RL.move(RL.hero, 0, 1);
    } else if (e.keyCode === 119) {
      RL.move(RL.hero, 0, -1);
    }
    for (i = 0; i < RL.enemies.length; i += 1) {
      x = Math.floor(Math.random() * 3 - 1);
      y = 0;
      if (x === 0) {
        y = Math.floor(Math.random() * 3 - 1);
      }
      RL.move(RL.enemies[i], x, y);
    }
    RL.drawMap();
  }
});

RL.init = function () {
  'use strict';
  RL.display = new ROT.Display();
  document.body.appendChild(RL.display.getContainer());
  RL.generateMap();
  RL.drawMap();
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

RL.drawMap = function () {
  'use strict';
  var x, y, i;
  for (x = 0; x < 80; x += 1) {
    for (y = 0; y < 25; y += 1) {
      RL.display.draw(x, y, RL.map[x + ',' + y] ? '#' : '.');
    }
  }
  for (i = 0; i < RL.enemies.length; i += 1) {
    RL.display.draw(RL.enemies[i].x, RL.enemies[i].y, '€');
  }
  RL.display.draw(RL.hero.x, RL.hero.y, '@');
};

RL.move = function (actor, x, y) {
  'use strict';
  var i;
  if (!(RL.map[(actor.x + x) + ',' + (actor.y + y)])) {
    for (i = 0; i < RL.enemies.length; i += 1) {
      if (RL.hero.x === actor.x + x && RL.hero.y === actor.y + y) {
        return;
      }
      if (RL.enemies[i].x === actor.x + x && RL.enemies[i].y === actor.y + y) {
        return;
      }
    }
    actor.x += x;
    actor.y += y;
  }
};
