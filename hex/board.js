class Board {
  constructor(cells, size) {
    this.cells = cells;
    this.size = size;
  }

  cellAt(row, col) {
    return this.cellById(row * this.size + col);
  }

  cellById(id) {
    return this.cells.get(id);
  }

  emptyCells() {
    return this.cells.filter(cell => !cell.get("c"));
  }

  takeCell(cell, player) {
    return this.update(cell.get("id"), cell.set("c", player));
  }

  toJS() {
    return this.cells.toJS();
  }

  filter(pred) {
    return this.cells.filter(pred);
  }

  update(id, newCell) {
    return new Board(this.cells.set(id, newCell), this.size);
  }
}

export default Board;
