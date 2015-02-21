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

module.exports = makeEmptyBoard;
