var RL = RL || {};

window.addEventListener('load', function (e) {
  'use strict';
  window.removeEventListener('load', this);
  RL.init();
});

window.addEventListener('keypress', function (e) {
  'use strict';
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
    RL.moveEnemies();
    RL.drawExplored();
    RL.fov.compute(RL.hero.x, RL.hero.y, 80, RL.drawXY);
  }
});

window.addEventListener('mousemove', function (e) {
  'use strict';
  RL.mouse = {
    x: RL.display.eventToPosition(e)[0],
    y: RL.display.eventToPosition(e)[1]
  };
});

window.addEventListener('mousedown', function (e) {
  'use strict';

  /*
   * The mouse button has been pressed, but no action will be done,
   * until it is released, or it is held down for enough time,
   * to repeat the action over and over.
   */
  RL.timeout = setTimeout(function () {

    /*
     * If the mouse button is not released, the timeout won't be cleared,
     * and the repeat of the action will be started.
     */
    RL.mousedown = true;
    RL.interval = setInterval(function () {

      /*
       * If the mouse button is not released, the interval won't be cleared,
       * and the action will repeated over and over.
       */
      RL.moveHero();
    }, 100);
  }, 300);
});

window.addEventListener('mouseup', function (e) {
  'use strict';

  /*
   * The mouse button has been released, but no action will be performed,
   * if it was held down for enough time to start repeating the action,
   * and no further clicks will be handled to perform a new action,
   * until the cooldown time of the action is passed.
   */
  if (RL.mousedown) {

    /*
     * The action has been repeated, so the cooldown time will be applied
     * before the next action.
     */
    setTimeout(function () {

      /*
       * The cooldown time has passed, further clicks will be handled
       * to perform new actions.
       */
      RL.mousedown = false;
    }, 100);
  } else {

    /*
     * The action hasn't been repeated, so no cooldown is needed,
     * the action can be performed immediately after the release of
     * the mouse button.
     */
    RL.moveHero();
  }

  /*
   * The mouse button has been released. If it hasn't been held down for
   * enough time to start to repeat the action, the action won't be repeated,
   * only performed once. If the action has been repeated, now it will stop
   * to repeat it.
   */
  clearTimeout(RL.timeout);
  clearInterval(RL.interval);
});
