import actions from './actions';
import checkWinner from './check_winner';
import makeEmptyBoard from './empty_board';

var board = Reflux.createStore({
  listenables: actions,

  onPlay: function(x, y) {
    var id = y * this.size + x;
    var cell = this.board.get(id);
    if (cell.get("c")) return;
    this.board = this.board.update(id, cell => cell.set("c", this.player));
    this.changePlayer();
    this.computerPlay();
    this.changePlayer();
    this.findWinner();
    this.emit();
  },

  onInit: function(size) {
    this.size = size;
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
    var emptyCells = this.board.filter(cell => !cell.get("c"));
    var i = Math.random() * emptyCells.size;
    var cell = emptyCells.get(i).toJS();
    var id = cell.y * this.size + cell.x;
    this.board = this.board.update(id, cell => cell.set("c", this.player));
  },

  findWinner: function(player) {
    if (checkWinner(this.board, "white", this.size)) {
      this.winner = "white";
    }
  }
});

export default board;
