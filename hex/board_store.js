"use strict";

var actions = require('./actions');

var board = Reflux.createStore({
  listenables: actions,

  onPlay: function(x, y) {
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

function makeEmptyBoard(size) {
  var board = [];
  for (var row = 0; row < size; row++) {
    var curRow = [];
    for (var col = 0; col < size; col++) {
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

function checkWinner(board, player) {
  var startCells = board.
    map(function(row) { return row.first(); }).
    filter(function(cell) { return cell.get("c") == player; });

  // Start cells may be connected to each other, which will make this a bit slower
  var found = false;
  startCells.forEach(function(startCell) {
    if (findPath(board, player, startCell, Immutable.Set(), board.size - 1)) {
      found = true;
      return false;
    }
  });

  return found;

  function findPath(board, player, cell, visited, targetColumn) {
    if (cell.get("x") == targetColumn) {
      return true;
    }
    var found = false;

    cell.get("neighbors").forEach(function(neighbor) {
      var nextCell = board.getIn([neighbor.get("y"), neighbor.get("x")]);
      if (nextCell.get("c") == player) {
        if (!visited.contains(nextCell)) {
          if (findPath(board, player, nextCell, visited.add(cell), targetColumn)) {
            found = true;
            return false;  // break
          } else {
          }
        }
      }
    });
    return found;
  }
}

module.exports = board;
