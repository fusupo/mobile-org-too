import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { StacksOverTabs } from './navigation/StacksOverTabs';

import {
  COMPLETE_HABIT,
  RESET_HABIT,
  DELETE_NODE,
  ADD_NEW_NODE,
  CYCLE_NODE_COLLAPSE,
  UPDATE_NODE_HEADLINE_CONTENT
} from './actions';

const OrgDrawerUtils = require('org-parse').OrgDrawer;
const OrgTimestampUtils = require('org-parse').OrgTimestamp;

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
  let nextState;
  switch (action.type) {
    case COMPLETE_HABIT:
      nextState = OrgTimestampUtils.calcNextRepeat(state, action.timestampStr);
      break;
  }
  return nextState || state;
}

function closed(state = null, action) {
  return state;
}

function propDrawer(state = { name: 'properties', properties: [] }, action) {
  switch (action.type) {
    case CYCLE_NODE_COLLAPSE:
      const key = 'collapseStatus';
      let idx = OrgDrawerUtils.indexOfKey(state, key);
      if (idx === -1 || state.properties[idx][1] === 'collapsed') {
        return OrgDrawerUtils.insertOrUpdate(state, [key, 'expanded']);
      } else if (state.properties[idx][1] === 'expanded') {
        return OrgDrawerUtils.insertOrUpdate(state, [key, 'collapsed']);
      }
      // else if (state.properties[idx][1] === 'maximized') {
      //     return OrgDrawerUtils.insertOrUpdate(state, [key, 'collapsed']);
      //   }
      break;
    case COMPLETE_HABIT:
      return OrgDrawerUtils.insertOrUpdate(state, [
        'LAST_REPEAT',
        action.timestampStr
      ]);
      break;
    default:
      return state;
      break;
  }
  return state;
}

function logbook(state = { entries: [] }, action) {
  let nextState;
  switch (action.type) {
    case COMPLETE_HABIT:
      // i think I may need to deep copy this stuff
      const clonedEntries = state.entries.slice(0);
      clonedEntries.unshift({
        type: 'state',
        state: '"DONE"',
        from: '"TODO"',
        timestamp: action.timestampStr
      });
      nextState = Object.assign({}, state, { entries: clonedEntries });
      break;
  }
  return nextState || state;
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
  let nextState;
  switch (action.type) {
    case DELETE_NODE:
      nextState = Object.assign({}, state);
      delete nextState[action.nodeID];
      break;
    case COMPLETE_HABIT:
    case RESET_HABIT:
    case ADD_NEW_NODE:
    case CYCLE_NODE_COLLAPSE:
    case UPDATE_NODE_HEADLINE_CONTENT:
      const nodeID = action.nodeID;
      let newNodeObj = {};
      const newNode = orgNode(state[nodeID], action);
      newNodeObj[nodeID] = newNode;
      nextState = Object.assign({}, state, newNodeObj);
      break;
    default:
      break;
  }
  return nextState || state;
}

///////////////////////////////////////////////////////////////////////  ORG TREE

function orgTree(state = {}, action) {
  let nextState, clonedKids;
  switch (action.type) {
    case ADD_NEW_NODE:
      clonedKids = state.children.slice(0);
      clonedKids.push({ nodeID: action.nodeID, children: [] });
      nextState = Object.assign({}, state, { children: clonedKids });
      break;
    case DELETE_NODE:
      clonedKids = state.children.slice(0);
      clonedKids = clonedKids.filter(n => n.nodeID !== action.nodeID);
      nextState = Object.assign({}, state, { children: clonedKids });
      break;
    default:
      break;
  }
  return nextState || state;
}

/////////////////////////////////////////////////////////////////////  ORG BUFFER

function orgBuffers(state = {}, action) {
  let nextState;
  switch (action.type) {
    case 'addOrgBuffer':
      console.log('addOrgBuffer');
      nextState = Object.assign({}, state);
      nextState[action.path] = action.data;
      break;
    case CYCLE_NODE_COLLAPSE:
      nextState = Object.assign({}, state);
      nextState[action.bufferID].orgNodes = orgNodes(
        nextState[action.bufferID].orgNodes,
        action
      );
      break;
  }
  return nextState || state;
}

////////////////////////////////////////////////////////////////////////////  NAV

function nav(state, action) {
  console.log('nav');
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
}

///////////////////////////////////////////////////////////////////////  SETTINGS

function settings(
  state = {
    inboxFile: { path: 'insert filepath', isFolder: false, isOk: null },
    orgFiles: []
  },
  action
) {
  console.log('settings');
  let nextState;
  switch (action.type) {
    case 'settings:inboxFile:ok':
      nextState = Object.assign({}, state, {
        inboxFile: { path: action.path, isFolder: action.isFolder, isOk: true }
      });
      break;
    case 'settings:inboxFile:error':
      nextState = Object.assign({}, state, {
        inboxFile: { path: action.path, isFolder: action.isFolder, isOk: false }
      });
      break;
  }

  const res = nextState || state;
  return res;
}

/////////////////////////////////////////////////////////////////  MOBILE ORG TOO

const mobileOrgTooApp = combineReducers({
  // orgText,
  // orgTree,
  // orgNodes,
  orgBuffers,
  nav,
  settings
});

export default mobileOrgTooApp;
