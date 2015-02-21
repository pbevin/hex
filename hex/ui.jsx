"use strict";

var Reflux = require('reflux');
var BoardStore = require('./board_store');
var actions = require('./actions')

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
  mixins: [Reflux.listenTo(BoardStore, "onBoardChange")],

  getInitialState: function() {
    return { cellSize: (this.props.height - 40) / (2 * this.props.boardSize) };
  },

  componentWillMount: function() {
    actions.init(this.props.boardSize);
  },

  onBoardChange: function(board, player) {
    this.setState({board: board, player: player});
  },

  render: function() {
    if (!this.state.board) return <svg/>;
    var dx = 280;
    var dy = 40;
    return (
      <svg style={style.svg} width={this.props.width} height={this.props.height}>
        <g transform={"translate(" + dx + " " + dy + ")"}>
          {this.board()}
          {this.goalLines()}
        </g>
      </svg>
    );
  },

  board: function() {
    return this.state.board.flatten(1).toJS().map(function(cell) {
      var col;
      if (this.state.highlight && !cell.c && this.state.highlight.x == cell.x && this.state.highlight.y == cell.y) {
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

    var w = size * 2;
    var h = size * this.props.boardSize * 2 * r32;

    for (var i = 0; i < this.props.boardSize; i++) {
      var x1 = size/2 - 3*i*size/2;
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

  onClick: function(x, y) {
    actions.play(x, y);
  },

  onMouseEnter: function(x, y) {
    this.setState({ highlight: {x: x, y: y} });
  },

  onMouseLeave: function(x, y) {
    this.setState({ highlight: null });
  }
});


var Cell = React.createClass({
  render: function() {
    var w = this.props.size * 2;
    var h = this.props.size * Math.sqrt(3) / 2;
    var dx = w * 3/4;
    var dy = h * 2;
    var cx = w/2 + this.props.x * dx - this.props.y * dx;
    var cy = h + this.props.y * dy/2 + this.props.x * dy / 2;
    var col = color[this.props.c || "yellow"];

    return (
      <polygon
        points={this._points(cx, cy)}
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
    this.props.onMouseLeave(this.props.x, this.props.y);
  },

  _points: function(cx, cy) {
    var size = this.props.size;
    return [0,1,2,3,4,5].map(function(i) {
      var angle = i * 2 * Math.PI / 6;
      var x = Math.round(cx + size * Math.cos(angle));
      var y = Math.round(cy + size * Math.sin(angle));
      return [x,y].join(",");
    }).join(" ");
  }
});

module.exports = Hex;
