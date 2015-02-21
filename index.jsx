'use strict'

var React = require('react')
var HexGame = require('./hex/ui')

React.render(<HexGame boardSize="5" width="600" height="400" />, document.getElementById('app'))
