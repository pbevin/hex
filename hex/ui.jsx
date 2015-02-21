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

  width: 600,
  height: 400,

  getInitialState: function() {
    return BoardStore.getDefaultData();
  },
  onBoardChange: function(board, player) {
    this.setState({board: board, player: player});
  },
  render: function() {
    return (
      <svg style={style.svg} width={this.width} height={this.height}>
        <g transform="translate(140 40)">
          {this.board()}
          {this.blueGoals()}
          {this.whiteGoals()}
        </g>
      </svg>
    );
  },

  board: function() {
    return this.state.board.flatten(1).toJS().map(function(cell) {
      var col;
      if (this.state.highlight && !cell.c && this.state.highlight.x == cell.x && this.state.highlight.y == cell.y) {
        // if (this.isNeighbor(this.state.highlight, cell)) {
        col = this.state.player;
      } else {
        col = cell.c;
      }

      return <Cell key={cell.x + ":" + cell.y} x={cell.x} y={cell.y} c={col} onClick={this.onClick} onMouseEnter={this.onMouseEnter} />;
    }.bind(this));
  },

  // isNeighbor: function(c1, c2) {
  //   if (!c1) return false;
  //   var n = false;
  //   c2.neighbors.forEach(function(c) {
  //     if (c.x == c1.x && c.y == c1.y) {
  //       n = true;
  //     }
  //   });
  //   return n;
  // },

  whiteGoals: function() {
    var topPoints = [];
    var bottomPoints = [];

    for (var i = 1; i < 11; i++) {
      var x = 20 * (i + Math.floor((i)/2));
      var y = (i % 4 == 0 || i % 4 == 3) ? 35 : 0;
      topPoints.push([x,y].join(","));

      var y2 = (i % 4 == 0 || i % 4 == 3) ? 312 : 277;
      bottomPoints.push([x,y2].join(","));
    }

    return (
      <g>
        <polyline stroke={color.white} strokeWidth={6} fill="none" points={topPoints.join(" ")} />
        <polyline stroke={color.white} strokeWidth={6} fill="none" points={bottomPoints.join(" ")} />
      </g>
    );
  },

  blueGoals: function() {
    var leftPoints = [];
    var rightPoints = [];

    for (var i = 0; i < 9; i++) {
      var x = (i % 2 == 0) ? 20 : 0;
      var y = i * 40 * Math.sqrt(3) / 2;
      leftPoints.push([x,y].join(","));

      var x2 = (i % 2 == 0) ? 300 : 320;
      rightPoints.push([x2,y].join(","));
    }

    return (
      <g>
        <polyline stroke={color.blue} strokeWidth={6} fill="none" points={leftPoints.join(" ")} />
        <polyline stroke={color.blue} strokeWidth={6} fill="none" points={rightPoints.join(" ")} />
      </g>
    );
    return <polyline stroke={color.white} strokeWidth={6} fill="none" points="100,0 0,100" />;
  },

  onClick: function(x, y) {
    actions.play(x, y);
  },

  onMouseEnter: function(x, y) {
    this.setState({ highlight: {x: x, y: y} });
  }
});


var Cell = React.createClass({
  // http://www.redblobgames.com/grids/hexagons/
  // flat topped
  // odd-q

  size: 40,

  render: function() {
    var w = this.size * 2;
    var h = this.size * Math.sqrt(3) / 2;
    var dx = w * 3/4;
    var dy = h * 2;
    var cx = w/2 + this.props.x * dx;
    var cy = h + this.props.y * dy;
    if (this.props.x & 1 == 1) {
      cy += dy/2;
    }

    var col = color[this.props.c || "yellow"];

    return <polygon points={this._points(cx, cy)} stroke="black" fill={col} onClick={this.onClick} onMouseEnter={this.onMouseEnter} />;
  },

  onClick: function() {
    this.props.onClick(this.props.x, this.props.y);
  },

  onMouseEnter: function() {
    this.props.onMouseEnter(this.props.x, this.props.y);
  },

  _points: function(cx, cy) {
    var size = this.size;
    return [0,1,2,3,4,5].map(function(i) {
      var angle = i * 2 * Math.PI / 6;
      var x = Math.round(cx + size * Math.cos(angle));
      var y = Math.round(cy + size * Math.sin(angle));
      return [x,y].join(",");
    }).join(" ");
  }
});

module.exports = Hex;
