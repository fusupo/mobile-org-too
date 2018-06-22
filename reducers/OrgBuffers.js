import R from 'ramda';

//import orgNodes from './OrgNodes.js';
import orgTree from './OrgTree.js';

import {
  COMPLETE_HABIT,
  COMPLETE_TODO,
  RESET_HABIT,
  DELETE_NODE,
  ADD_NEW_NODE,
  CYCLE_NODE_COLLAPSE,
  UPDATE_NODE_TODO_KEYWORD,
  UPDATE_NODE_HEADLINE_TITLE,
  ADD_NEW_NODE_PLANNING,
  UPDATE_NODE_TIMESTAMP,
  UPDATE_NODE_TIMESTAMP_REP_INT,
  CLEAR_NODE_TIMESTAMP,
  ADD_NEW_NODE_PROP_DRAWER,
  INSERT_NEW_NODE_PROP,
  UPDATE_NODE_PROP,
  REMOVE_NODE_PROP,
  ADD_NEW_NODE_LOGBOOK,
  INSERT_NEW_NODE_LOG_NOTE,
  UPDATE_NODE_LOG_NOTE,
  REMOVE_NODE_LOG_NOTE,
  TOGGLE_NODE_TAG,
  ADD_NEW_NODE_PARAGRAPH,
  UPDATE_NODE_PARAGRAPH
} from '../actions';

const orgBuffers = (state = {}, action) => {
  let nextState;
  nextState = Object.assign({}, state);
  switch (action.type) {
    case 'addOrgBuffer':
      nextState = R.assoc(action.path, action.data, state);
      break;
    case 'removeOrgBuffer':
      nextState = R.dissoc(action.path, state);
      break;
    case DELETE_NODE:
    // nextstate[action.bufferID].orgTree = orgTree(
    //   nextState[action.bufferID].orgTree,
    //   action
    // );
    // break; is missing on purpose
    case UPDATE_NODE_TODO_KEYWORD:
    case UPDATE_NODE_HEADLINE_TITLE:
    case ADD_NEW_NODE_PLANNING:
    case UPDATE_NODE_TIMESTAMP:
    case UPDATE_NODE_TIMESTAMP_REP_INT:
    case CLEAR_NODE_TIMESTAMP:
    case COMPLETE_HABIT:
    case COMPLETE_TODO:
    case RESET_HABIT:
    case CYCLE_NODE_COLLAPSE:
    case ADD_NEW_NODE_PROP_DRAWER:
    case INSERT_NEW_NODE_PROP:
    case UPDATE_NODE_PROP:
    case REMOVE_NODE_PROP:
    case ADD_NEW_NODE_LOGBOOK:
    case INSERT_NEW_NODE_LOG_NOTE:
    case UPDATE_NODE_LOG_NOTE:
    case REMOVE_NODE_LOG_NOTE:
    case UPDATE_NODE_PARAGRAPH:
    case TOGGLE_NODE_TAG:
    case ADD_NEW_NODE_PARAGRAPH:
    // nextState[action.bufferID].orgNodes = orgNodes(
    //   nextState[action.bufferID].orgNodes,
    //   action
    // );
    // break;
    case ADD_NEW_NODE:
      // nextState[action.bufferID].orgNodes = orgNodes(
      //   nextState[action.bufferID].orgNodes,
      //   action
      // );
      nextState[action.bufferID].orgTree = orgTree(
        nextState[action.bufferID].orgTree,
        action
      );
      break;
  }
  return nextState || state;
};

export default orgBuffers;
