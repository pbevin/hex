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

module.exports = checkWinner;
