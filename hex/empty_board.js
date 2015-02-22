function makeEmptyBoard(size) {
  let board = Immutable.List();
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      let cell = Immutable.fromJS({
        x: col,
        y: row,
        c: null,
        neighbors: linkNeighbors(row, col)
      });
      board = board.push(cell);
    }
  }

  return Immutable.fromJS(board);

  function inBounds([col, row]) {
    return (0 <= row && row < size && 0 <= col && col < size);
  }

  function linkNeighbors(row, col) {
    let neighbors = [
      [col-1, row-1], [col-1, row],
      [col, row-1], [col, row+1],
      [col+1, row], [col+1, row+1]
    ];

    return neighbors.
      filter(inBounds).
      map(([x,y]) => y * size + x );
  }
}

export default makeEmptyBoard;
