'use strict'

var React = require('react')
var HexGame = require('./hex/ui')
var actions = require('./hex/actions')

React.render(<HexGame boardSize="9" width="600" height="400" />, document.getElementById('app'))
