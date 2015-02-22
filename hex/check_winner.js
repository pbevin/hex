function checkWinner(board, player) {
  let startCells = board.filter(cell => cell.get("x") == 0 && cell.get("c") == player);
  // Start cells may be connected to each other, which will make this a bit slower
  return startCells.some(startCell => {
    return findPath(board, player, startCell, Immutable.Set(), board.size - 1);
  });

  function findPath(board, player, cell, visited, targetColumn) {
    if (cell.get("x") == targetColumn) {
      return true;
    }

    return cell.get("neighbors").some(function(neighbor) {
      var nextCell = board.cellById(neighbor);
      if (nextCell.get("c") == player) {
        if (!visited.contains(nextCell)) {
          if (findPath(board, player, nextCell, visited.add(cell), targetColumn)) {
            return true;  // break
          }
        }
      }
      return false;
    });
  }
}

export default checkWinner;
