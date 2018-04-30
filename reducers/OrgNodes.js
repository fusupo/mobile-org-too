import orgNode from './OrgNode';

import {
  COMPLETE_HABIT,
  COMPLETE_TODO,
  RESET_HABIT,
  DELETE_NODE,
  ADD_NEW_NODE,
  CYCLE_NODE_COLLAPSE,
  UPDATE_NODE_TODO_KEYWORD,
  UPDATE_NODE_HEADLINE_TITLE,
  UPDATE_NODE_TIMESTAMP,
  UPDATE_NODE_TIMESTAMP_REP_INT,
  CLEAR_NODE_TIMESTAMP,
  INSERT_NEW_NODE_PROP,
  UPDATE_NODE_PROP,
  REMOVE_NODE_PROP,
  INSERT_NEW_NODE_LOG_NOTE,
  UPDATE_NODE_LOG_NOTE,
  REMOVE_NODE_LOG_NOTE,
  UPDATE_NODE_BODY,
  TOGGLE_NODE_TAG
} from '../actions';

const orgNodes = (state = {}, action) => {
  let nextState;
  switch (action.type) {
    case DELETE_NODE:
      nextState = Object.assign({}, state);
      console.log(nextState, action.nodeID);
      delete nextState[action.nodeID];
      break;
    case ADD_NEW_NODE:
    case COMPLETE_TODO:
    case COMPLETE_HABIT:
    case RESET_HABIT:
    case CYCLE_NODE_COLLAPSE:
    case UPDATE_NODE_TODO_KEYWORD:
    case UPDATE_NODE_HEADLINE_TITLE:
    case UPDATE_NODE_TIMESTAMP:
    case UPDATE_NODE_TIMESTAMP_REP_INT:
    case CLEAR_NODE_TIMESTAMP:
    case INSERT_NEW_NODE_PROP:
    case UPDATE_NODE_PROP:
    case REMOVE_NODE_PROP:
    case INSERT_NEW_NODE_LOG_NOTE:
    case UPDATE_NODE_LOG_NOTE:
    case REMOVE_NODE_LOG_NOTE:
    case UPDATE_NODE_BODY:
    case TOGGLE_NODE_TAG:
      const nodeID = action.nodeID;
      let newNodeObj = {};
      const newNode = orgNode(state[nodeID], action);
      newNodeObj[nodeID] = newNode;
      nextState = Object.assign({}, state, newNodeObj);
      console.log('nextState!!', nextState);
      break;
    default:
      break;
  }
  return nextState || state;
};

export default orgNodes;
