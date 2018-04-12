import { StacksOverTabs } from '../navigation/StacksOverTabs';
import { NavigationActions } from 'react-navigation';

import { DELETE_NODE, ADD_NEW_NODE } from '../actions';

const nav = (state, action) => {
  let nextState;
  switch (action.type) {
    case ADD_NEW_NODE:
      nextState = StacksOverTabs.router.getStateForAction(
        NavigationActions.navigate({
          routeName: 'NewNode',
          params: {
            bufferID: action.bufferID,
            nodeID: action.nodeID,
            isNew: true
          }
        }),
        state
      );
      break;
    case DELETE_NODE:
      nextState = StacksOverTabs.router.getStateForAction(
        NavigationActions.back(),
        state
      );
      break;
    default:
      nextState = StacksOverTabs.router.getStateForAction(action, state);
      break;
  }
  return nextState || state;
};

export default nav;
