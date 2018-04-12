import { combineReducers } from 'redux';

function ledger(state = null, action) {
  let nextState, ledgernodes;
  switch (action.type) {
    case 'removeLedger':
      nextState = null;
      break;
    case 'addLedger':
      nextState = action.data;
      break;
    case 'ledger:addNode':
      ledgerNodes = R.insert(
        state.ledgerNodes.length,
        action.node,
        state.ledgerNodes
      );
      nextState = Object.assign({}, state, { ledgerNodes });
      break;
    case 'ledger:updateNode':
      const idx = R.findIndex(n => n.id === action.node.id, state.ledgerNodes);
      ledgerNodes = R.update(idx, action.node, state.ledgerNodes);
      nextState = Object.assign({}, state, { ledgerNodes });
      break;
  }
  return nextState || state;
}

const data = combineReducers({
  ledger
});

export default data;
