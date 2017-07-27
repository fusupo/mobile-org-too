import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { StacksOverTabs } from './navigation/StacksOverTabs';

import {
  ADD_NEW_NODE,
  CYCLE_NODE_COLLAPSE,
  UPDATE_NODE_HEADLINE_CONTENT
} from './actions';

const OrgDrawer = require('org-parse').OrgDrawer;

///////////////////////////////////////////////////////////////////////  ORG TEXT

function orgText(state = '', action) {
  return state;
}

//////////////////////////////////////////////////////////////////////  ORG NODES

function id(state = {}, action) {
  switch (action.type) {
    case ADD_NEW_NODE:
      return action.nodeID;
      break;
    default:
      return state;
      break;
  }
}

function headline(
  state = {
    level: 1,
    tags: [],
    content: 'new node',
    todoKeyword: undefined,
    todoKeywordColor: undefined
  },
  action
) {
  switch (action.type) {
    case UPDATE_NODE_HEADLINE_CONTENT:
      return Object.assign({}, state, { content: action.text });
      break;
    default:
      return state;
      break;
  }
}

function scheduled(state = null, action) {
  return state;
}

function closed(state = null, action) {
  return state;
}

function propDrawer(state = { name: 'properties', properties: [] }, action) {
  switch (action.type) {
    case CYCLE_NODE_COLLAPSE:
      const key = 'collapseStatus';
      let idx = OrgDrawer.indexOfKey(state, key);
      if (idx === -1 || state.properties[idx][1] === 'collapsed') {
        return OrgDrawer.insertOrUpdate(state, [key, 'expanded']);
      } else if (state.properties[idx][1] === 'expanded') {
        return OrgDrawer.insertOrUpdate(state, [key, 'collapsed']);
      }
      // else if (state.properties[idx][1] === 'maximized') {
      //     return OrgDrawer.insertOrUpdate(state, [key, 'collapsed']);
      //   }
      break;
    default:
      return state;
      break;
  }
  return state;
}

function logbook(state = { entries: [] }, action) {
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
    case ADD_NEW_NODE:
    case CYCLE_NODE_COLLAPSE:
    case UPDATE_NODE_HEADLINE_CONTENT:
      const nodeID = action.nodeID;
      let newNodeObj = {};
      const newNode = orgNode(state[nodeID], action);
      newNodeObj[nodeID] = newNode;
      return Object.assign({}, state, newNodeObj);
      break;
    default:
      return state;
      break;
  }
  return state;
}

///////////////////////////////////////////////////////////////////////  ORG TREE

function orgTree(state = {}, action) {
  let nextState;
  switch (action.type) {
    case ADD_NEW_NODE:
      let clonedKids = state.children.slice(0);
      clonedKids.push({ nodeID: action.nodeID, children: [] });
      nextState = Object.assign({}, state, { children: clonedKids });
      break;
    default:
      break;
  }
  return nextState || state;
}

////////////////////////////////////////////////////////////////////////////  NAV

function nav(state, action) {
  let nextState;
  switch (action.type) {
    case ADD_NEW_NODE:
      nextState = StacksOverTabs.router.getStateForAction(
        NavigationActions.navigate({
          routeName: 'NewNode',
          params: { nodeID: action.nodeID }
        }),
        state
      );
      break;
    default:
      nextState = StacksOverTabs.router.getStateForAction(action, state);
      break;
  }
  return nextState || state;
}

/////////////////////////////////////////////////////////////////  MOBILE ORG TOO

const mobileOrgTooApp = combineReducers({
  orgText,
  orgTree,
  orgNodes,
  nav
});

export default mobileOrgTooApp;
