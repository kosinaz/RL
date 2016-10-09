var RL = RL || {};
var ROT = ROT || {};

RL.Level = function (scheduler, previous) {
  'use strict';
  var digger = new ROT.Map.Digger();
  this.map = {};
  this.explored = {};
  this.enemies = [];
  digger.create(function (x, y, value) {
    if (!value && Math.random() * 100 < 1) {
      this.enemies.push(new RL.Actor(x, y, this, 4, scheduler));
    }
    this.map[x + ',' + y] = value;
  }.bind(this));
  this.rooms = digger.getRooms();
  if (previous) {
    this.entrance = {
      x: this.rooms[0].getCenter()[0],
      y: this.rooms[0].getCenter()[1],
      level: previous
    };
  }
  this.exit = {
    x: this.rooms[this.rooms.length - 1].getCenter()[0],
    y: this.rooms[this.rooms.length - 1].getCenter()[1]
  };
};
