"use strict";

var actions = require('./actions');
var checkWinner = require('./check_winner');
var makeEmptyBoard = require('./empty_board');

var board = Reflux.createStore({
  listenables: actions,

  onPlay: function(x, y) {
    var cell = this.board.getIn([y, x]);
    if (cell.get("c")) return;
    this.board = this.board.setIn([y, x, "c"], this.player);
    this.changePlayer();
    this.computerPlay();
    this.changePlayer();
    this.findWinner();
    this.emit();
  },

  onInit: function(size) {
    this.board = makeEmptyBoard(size);
    this.player = "white";
    this.winner = null;
    this.emit();
  },

  emit: function() {
    this.trigger({ board: this.board, player: this.player, winner: this.winner });
  },

  changePlayer: function() {
    if (this.player == "white") {
      this.player = "blue";
    } else {
      this.player = "white";
    }
  },

  computerPlay: function() {
    var emptyCells = this.board.flatten(1).filter(function(cell) { return !cell.get("c"); });
    var i = Math.random() * emptyCells.size;
    var cell = emptyCells.get(i).toJS();
    this.board = this.board.setIn([cell.y, cell.x, "c"], this.player);
  },

  findWinner: function(player) {
    if (checkWinner(this.board, "white")) {
      this.winner = "white";
    }
  }
});

module.exports = board;
