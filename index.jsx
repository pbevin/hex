'use strict'

var React = require('react')
var HexGame = require('./hex/ui')

React.render(<HexGame boardSize="5" width="800" height="500" />, document.getElementById('app'))
