"use strict";

let PureRenderMixin = React.addons.PureRenderMixin
import BoardStore from './board_store';
import actions from './actions';

var color = {
  blue: "#66E",
  yellow: "#EE3",
  white: "#FFF",
  black: "#000"
};

var style = {
  svg: {
    background: color.black
  }
};

var Hex = React.createClass({
  mixins: [
    PureRenderMixin,
    Reflux.listenTo(BoardStore, "onBoardChange")
  ],

  getInitialState() {
    return { cellSize: this._findCellSize() };
  },

  componentWillMount() {
    actions.init(this.props.boardSize);
  },

  onBoardChange(state) {
    this.setState(state);
  },

  render() {
    if (!this.state.board) return <svg/>;
    var dx = this.props.width / 2;
    var dy = this.dy();
    return (
      <svg style={style.svg} width={this.props.width} height={this.props.height}>
        <g transform={"translate(" + dx + " " + dy + ")"}>
          {this.board()}
          {this.goalLines()}
          {this.winner()}
        </g>
      </svg>
    );
  },

  board() {
    return this.state.board.toJS().map(function(cell) {
      var col;

      if (this._isHighlighting(cell)) {
        col = this.state.player;
      } else {
        col = cell.c;
      }

      return (
        <Cell
          key={cell.x + ":" + cell.y}
          x={cell.x}
          y={cell.y}
          c={col}
          size={this.state.cellSize}
          onClick={this.onClick}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        />
      );
    }.bind(this));
  },

  goalLines() {
    var size = this.state.cellSize;
    var p1 = [];
    var p2 = [];
    var p3 = [];
    var p4 = [];
    var r32 = Math.sqrt(3)/2;

    var w = 0;
    var h = size * this.props.boardSize * 2 * r32;

    for (var i = 0; i < this.props.boardSize; i++) {
      var x1 = -size/2-3*i*size/2;
      var y1 = i * size * r32;
      p1.push([x1,y1].join(","));
      p2.push([w-x1,h-y1].join(","));
      p3.push([w-x1, y1].join(","));
      p4.push([x1, h-y1].join(","));

      var x2 = x1 - size/2;
      var y2 = y1 + size*r32;
      p1.push([x2,y2].join(","));
      p2.push([w-x2,h-y2].join(","));
      p3.push([w-x2, y2].join(","));
      p4.push([x2, h-y2].join(","));
    }
    p3.unshift(p1[0]);
    p4.unshift(p2[0]);

    return (
      <g>
        <polyline stroke={color.white} strokeWidth={6} fill="none" points={p1.join(" ")} />
        <polyline stroke={color.white} strokeWidth={6} fill="none" points={p2.join(" ")} />
        <polyline stroke={color.blue} strokeWidth={6} fill="none" points={p3.join(" ")} />
        <polyline stroke={color.blue} strokeWidth={6} fill="none" points={p4.join(" ")} />
      </g>
    );
  },

  winner() {
    if (!this.state.winner) {
      return;
    }

    var props = {
      x: "0",
      y: this.props.height / 2 - this.dy() + 37,
      fill: "#f09",
      fontFamily: "Verdana",
      fontSize: "100px",
      textAnchor: "middle"
    };

    return (
      <g>
        <text {...props}>YOU WIN!</text>
      </g>
    );
  },

  onClick(x, y) {
    if (this.state.winner) return;
    actions.play(x, y);
  },

  onMouseEnter(x, y) {
    this.setState({ highlight: {x: x, y: y} });
  },

  onMouseLeave() {
    this.setState({ highlight: null });
  },

  _findCellSize() {
    // Width of the diamond is 3n-1 cell radii: count cells lying exactly
    // on the major axis, and note that there is a cell radius gap between
    // each pair.
    //
    // Height of the diamond is n cell heights, and each cell height is
    // sqrt(3) times the radius.
    //
    // We want to leave a cell radius gap at the edges, so we add 2 to
    // each count.
    var n = this.props.boardSize;
    var w = this.props.width / (3 * n + 1);
    var h = this.props.height / (Math.sqrt(3) * n + 2);

    return Math.min(w, h);
  },

  dy() {
    var n = this.props.boardSize;
    var screenHeight = this.props.height;
    var diamondHeight = this.state.cellSize * Math.sqrt(3) * n;
    var dy = (screenHeight - diamondHeight) / 2;
    return dy;
  },

  _isHighlighting(cell) {
    if (this.state.winner) return false;
    if (!this.state.highlight) return false;
    if (cell.c) return false;
    return this.state.highlight.x == cell.x && this.state.highlight.y == cell.y;
  }
});


var Cell = React.createClass({
  render() {
    var size = this.props.size;
    var w = size * 2;
    var h = size * Math.sqrt(3) / 2;
    var dx = w * 3/4;
    var dy = h * 2;
    var cx = (this.props.x - this.props.y) * dx;
    var cy = h + (this.props.x + this.props.y) * dy/2;
    var col = color[this.props.c || "yellow"];

    return (
      <polygon
        points={this._points(cx, cy, size)}
        stroke="black"
        fill={col}
        onClick={this.onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      />
    );
  },

  onClick() {
    this.props.onClick(this.props.x, this.props.y);
  },

  onMouseEnter() {
    this.props.onMouseEnter(this.props.x, this.props.y);
  },

  onMouseLeave() {
    this.props.onMouseLeave();
  },

  _points(cx, cy, size) {
    return [0,1,2,3,4,5].map(function(i) {
      var angle = i * 2 * Math.PI / 6;
      var x = Math.round(cx + size * Math.cos(angle));
      var y = Math.round(cy + size * Math.sin(angle));
      return [x,y].join(",");
    }).join(" ");
  }
});

export default Hex;
