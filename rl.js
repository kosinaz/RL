var ROT = ROT || {};
var RL = {};

RL.init = function () {
  'use strict';
  RL.display = new ROT.Display();
  document.body.appendChild(RL.display.getContainer());
  RL.display.setOptions({
    fontSize: RL.display.computeFontSize(window.innerWidth, window.innerHeight)
  });
  RL.startNewGame();
};

RL.startNewGame = function () {
  'use strict';
  RL.scheduler = new ROT.Scheduler.Action();
  RL.engine = new ROT.Engine(RL.scheduler);
  RL.level = 0;
  RL.levels = [];
  RL.levels[RL.level] = new RL.Level(RL.scheduler);
  RL.player = new RL.Player(
    RL.levels[RL.level].rooms[0].getCenter()[0],
    RL.levels[RL.level].rooms[0].getCenter()[1],
    RL.levels[RL.level],
    10,
    RL.scheduler,
    RL.engine
  );
  RL.engine.start();
};
