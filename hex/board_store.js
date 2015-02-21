"use strict";

var actions = require('./actions');

var emptyBoard = makeEmptyBoard();

function makeEmptyBoard() {
  var board = [];
  for (var row = 0; row < 4; row++) {
    var curRow = [];
    for (var col = 0; col < 5; col++) {
      curRow.push({x: col, y: row, c: null});
    }
    board.push(curRow);
  }

  linkNeighbors(board);

  return Immutable.fromJS(board);
}

function linkNeighbors(board) {
  var board_height = board.length;
  var board_width  = board[0].length;
  for (var row = 0; row < board_height; row++) {
    for (var col = 0; col < board_width; col++) {
      var neighbors;
      if ((col & 1) == 0) {
        neighbors = [
          [col+1, row], [col+1, row-1], [col, row-1],
          [col-1, row-1], [col-1, row], [col, row+1]
        ]
      } else {
        neighbors = [
          [col+1, row+1], [col+1, row], [col, row-1],
          [col-1, row], [col-1, row+1], [col, row+1]
        ]
      }

      var neighborCells = neighbors.map(function(p) {
        return { x: p[0], y: p[1] };
      }).filter(function(p) {
        return 0 <= p.x && p.x < board_width &&
          0 <= p.y && p.y < board_height;
      });

      board[row][col].neighbors = neighborCells;
    }
  }
}

var board = Reflux.createStore({
  listenables: actions,

  init: function() {
    this.board = emptyBoard;
    this.player = "white";
  },

  onPlay: function(x, y) {
    this.board = this.board.setIn([y, x, "c"], this.player);
    this.changePlayer();
    this.computerPlay();
    this.changePlayer();
    this.trigger(this.board, this.player);
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

  isWin: function(player) {

  },

  getDefaultData: function() {
    return {
      board: this.board,
      player: this.player
    };
  }
});

module.exports = board;
