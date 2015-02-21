'use strict'

var React = require('react')
var HexGame = require('./hex/ui')
var actions = require('./hex/actions')

React.render(<HexGame boardSize="9" width="800" height="500" />, document.getElementById('app'))
