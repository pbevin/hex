'use strict'

import React from 'react';
import Hex from './hex/ui'
import actions from './hex/actions';
import BoardStore from './hex/board_store';


BoardStore.listen(function(state) {
  React.render(<Hex {...state} width="600" height="400" />,
               document.getElementById('app'))
});

actions.init(7);
