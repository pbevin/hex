import actions from './actions';
import checkWinner from './check_winner';
import makeEmptyBoard from './empty_board';
import Board from './board';

var board = Reflux.createStore({
  listenables: actions,

  onPlay(x, y) {
    var cell = this.board.cellAt(y, x);
    if (cell.get("c")) return;
    this.board = this.board.takeCell(cell, this.player);
    this.changePlayer();
    this.computerPlay();
    this.changePlayer();
    this.findWinner();
    this.emit();
  },

  onInit(size) {
    this.board = new Board(makeEmptyBoard(size), size);
    this.player = "white";
    this.winner = null;
    this.emit();
  },

  emit() {
    this.trigger({ board: this.board, player: this.player, winner: this.winner });
  },

  changePlayer() {
    if (this.player == "white") {
      this.player = "blue";
    } else {
      this.player = "white";
    }
  },

  computerPlay() {
    var emptyCells = this.board.emptyCells();
    var i = Math.random() * emptyCells.size;
    var cell = emptyCells.get(i);
    this.board = this.board.takeCell(cell, this.player);
  },

  findWinner() {
    if (checkWinner(this.board, "white", this.size)) {
      this.winner = "white";
    }
  }
});

export default board;
