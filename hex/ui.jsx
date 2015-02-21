"use strict";

var Reflux = require('reflux');
var BoardStore = require('./board_store');
var actions = require('./actions')
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

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

  getInitialState: function() {
    return { cellSize: this._findCellSize() };
  },

  componentWillMount: function() {
    actions.init(this.props.boardSize);
  },

  onBoardChange: function(state) {
    this.setState(state);
  },

  render: function() {
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

  board: function() {
    return this.state.board.flatten(1).toJS().map(function(cell) {
      var col;
      if (this.state.winner) {
        col = cell.c;
      } else if (this.state.highlight && !cell.c && this.state.highlight.x == cell.x && this.state.highlight.y == cell.y) {
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

  goalLines: function() {
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

  winner: function() {
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


    var y = this.props.height / 2 - 5 - this.dy();
    return (
      <g>
        <text {...props}>YOU WIN!</text>
      </g>
    );
  },

  onClick: function(x, y) {
    if (this.state.winner) return;
    actions.play(x, y);
  },

  onMouseEnter: function(x, y) {
    this.setState({ highlight: {x: x, y: y} });
  },

  onMouseLeave: function() {
    this.setState({ highlight: null });
  },

  _findCellSize: function() {
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

  dy: function() {
    var n = this.props.boardSize;
    var screenHeight = this.props.height;
    var diamondHeight = this.state.cellSize * Math.sqrt(3) * n;
    var dy = (screenHeight - diamondHeight) / 2;
    return dy;
  }
});


var Cell = React.createClass({
  render: function() {
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

  onClick: function() {
    this.props.onClick(this.props.x, this.props.y);
  },

  onMouseEnter: function() {
    this.props.onMouseEnter(this.props.x, this.props.y);
  },

  onMouseLeave: function() {
    this.props.onMouseLeave();
  },

  _points: function(cx, cy, size) {
    return [0,1,2,3,4,5].map(function(i) {
      var angle = i * 2 * Math.PI / 6;
      var x = Math.round(cx + size * Math.cos(angle));
      var y = Math.round(cy + size * Math.sin(angle));
      return [x,y].join(",");
    }).join(" ");
  }
});

module.exports = Hex;
