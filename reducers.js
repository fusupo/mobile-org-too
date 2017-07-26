import { combineReducers } from 'redux';

import { CYCLE_NODE_COLLAPSE } from './actions';

const OrgDrawer = require('org-parse').OrgDrawer;

///////////////////////////////////////////////////////////////////////  ORG TEXT

function orgText(state = '', action) {
  return state;
}

//////////////////////////////////////////////////////////////////////  ORG NODES

function id(state = {}, action) {
  return state;
}

function headline(state = {}, action) {
  return state;
}

function scheduled(state = {}, action) {
  return state;
}

function closed(state = {}, action) {
  return state;
}

function propDrawer(state = {}, action) {
  switch (action.type) {
    case CYCLE_NODE_COLLAPSE:
      const key = 'collapseStatus';
      console.log('foo');
      let idx = OrgDrawer.indexOfKey(state, key);
      if (idx === -1 || state.properties[idx][1] === 'collapsed') {
        return OrgDrawer.insertOrUpdate(state, [key, 'expanded']);
      } else if (state.properties[idx][1] === 'expanded') {
        return OrgDrawer.insertOrUpdate(state, [key, 'maximized']);
      } else if (state.properties[idx][1] === 'maximized') {
        return OrgDrawer.insertOrUpdate(state, [key, 'collapsed']);
      }
      break;
    default:
      return state;
      break;
  }
  return state;
}

function logbook(state = {}, action) {
  return state;
}

function opened(state = {}, action) {
  return state;
}

function body(state = '', action) {
  return state;
}

const orgNode = combineReducers({
  id,
  headline,
  scheduled,
  closed,
  propDrawer,
  logbook,
  opened,
  body
});

function orgNodes(state = {}, action) {
  switch (action.type) {
    case CYCLE_NODE_COLLAPSE:
      const nodeID = action.nodeID;
      let newNodeObj = {};
      const newNode = orgNode(state[nodeID], action);
      newNodeObj[nodeID] = newNode;
      console.log(newNode);
      const newNodes = Object.assign({}, state, newNodeObj);
      return newNodes;
      break;
    default:
      return state;
      break;
  }
  return state;
}

///////////////////////////////////////////////////////////////////////  ORG TREE

function orgTree(state = {}, action) {
  switch (action.type) {
    default:
      return state;
      break;
  }
  return state;
}

/////////////////////////////////////////////////////////////////  MOBILE ORG TOO

const mobileOrgTooApp = combineReducers({
  orgText,
  orgTree,
  orgNodes
});

export default mobileOrgTooApp;
