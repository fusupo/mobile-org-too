import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { StacksOverTabs } from './navigation/StacksOverTabs';

import R from 'ramda';

import {
  REGISTER_DBX_ACCESS_TOKEN,
  COMPLETE_HABIT,
  COMPLETE_TODO,
  RESET_HABIT,
  DELETE_NODE,
  ADD_NEW_NODE,
  CYCLE_NODE_COLLAPSE,
  UPDATE_NODE_TODO_KEYWORD,
  UPDATE_NODE_HEADLINE_CONTENT,
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
} from './actions';

const OrgDrawerUtil = require('./utilities/OrgDrawerUtil');
const OrgTimestampUtil = require('./utilities/OrgTimestampUtil');

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
    todoKeyword: undefined
    // todoKeywordColor: undefined
  },
  action
) {
  switch (action.type) {
    case ADD_NEW_NODE:
      return Object.assign({}, state, { level: action.level });
      break;
    case UPDATE_NODE_TODO_KEYWORD:
      if (action.todoKeyword === 'none') {
        return Object.assign({}, state, {
          todoKeyword: undefined
          // todoKeywordColor: undefined,
        });
      }
      return Object.assign({}, state, {
        todoKeyword: action.todoKeyword
        // todoKeywordColor: action.todoKeywordColor,
      });
      break;
    case UPDATE_NODE_HEADLINE_CONTENT:
      return Object.assign({}, state, { content: action.text });
      break;
    case TOGGLE_NODE_TAG:
      let tags = state.tags || [];
      if (R.contains(action.tag, tags)) {
        tags = R.without(action.tag, tags);
      } else {
        tags = R.insert(tags.length, action.tag, tags);
      }
      return Object.assign({}, state, { tags });
      break;
    default:
      return state;
      break;
  }
}

// SCHEDULING
function opened(state = null, action) {
  let nextState;
  if (action.timestampType === 'OPENED') {
    switch (action.type) {
      case UPDATE_NODE_TIMESTAMP:
        nextState = action.timestamp;
        break;
      case UPDATE_NODE_TIMESTAMP_REP_INT:
        nextState = Object.assign({}, state, {
          repInt: action.repInt,
          repMin: action.repMin,
          repMax: action.repMax
        });
        break;
      case CLEAR_NODE_TIMESTAMP:
        nextState = null;
        //short circuit the null check bellow
        return nextState;
        break;
    }
  }
  return nextState || state;
}

function scheduled(state = null, action) {
  let nextState;
  if (action.type === COMPLETE_HABIT) {
    nextState = OrgTimestampUtil.calcNextRepeat(state, action.timestampStr);
  } else {
    if (action.timestampType === 'SCHEDULED') {
      switch (action.type) {
        case UPDATE_NODE_TIMESTAMP:
          nextState = action.timestamp;
          break;
        case UPDATE_NODE_TIMESTAMP_REP_INT:
          nextState = Object.assign({}, state, {
            repInt: action.repInt,
            repMin: action.repMin,
            repMax: action.repMax
          });
          break;
        case CLEAR_NODE_TIMESTAMP:
          nextState = null;
          //short circuit the null check bellow
          return nextState;
          break;
      }
    }
  }
  return nextState || state;
}

function deadline(state = null, action) {
  let nextState;
  if (action.timestampType === 'DEADLINE') {
    switch (action.type) {
      case UPDATE_NODE_TIMESTAMP:
        nextState = action.timestamp;
        break;
      case UPDATE_NODE_TIMESTAMP_REP_INT:
        nextState = Object.assign({}, state, {
          repInt: action.repInt,
          repMin: action.repMin,
          repMax: action.repMax
        });
        break;
      case CLEAR_NODE_TIMESTAMP:
        nextState = null;
        //short circuit the null check bellow
        return nextState;
        break;
    }
  }
  return nextState || state;
}

function closed(state = null, action) {
  let nextState;
  if (action.timestampType === 'CLOSED') {
    switch (action.type) {
      case UPDATE_NODE_TIMESTAMP:
        nextState = action.timestamp;
        break;
      // case UPDATE_NODE_TIMESTAMP_REP_INT:
      //   nextState = Object.assign({}, state, {
      //     repInt: action.repInt,
      //     repMin: action.repMin,
      //     repMax: action.repMax
      //   });
      //   break;
      case CLEAR_NODE_TIMESTAMP:
        nextState = null;
        //short circuit the null check bellow
        return nextState;
        break;
    }
  }
  return nextState || state;
}
// END SCHEDULING

function propDrawer(state = { name: 'properties', properties: [] }, action) {
  let nextState;
  switch (action.type) {
    case CYCLE_NODE_COLLAPSE:
      const key = 'collapseStatus';
      let idx = OrgDrawerUtil.indexOfKey(state, key);
      if (idx === -1 || state.properties[idx][1] === 'collapsed') {
        nextState = OrgDrawerUtil.insertOrUpdate(state, [key, 'expanded']);
      } else if (state.properties[idx][1] === 'expanded') {
        nextState = OrgDrawerUtil.insertOrUpdate(state, [key, 'collapsed']);
      }
      // else if (state.properties[idx][1] === 'maximized') {
      //     return OrgDrawerUtil.insertOrUpdate(state, [key, 'collapsed']);
      //   }
      break;
    case UPDATE_NODE_PROP:
      const clonedProps = state.properties.slice(0);
      clonedProps.splice(action.idx, 1, [action.propKey, action.propVal]);
      nextState = Object.assign({}, state, { properties: clonedProps });
      break;
    case INSERT_NEW_NODE_PROP:
      nextState = OrgDrawerUtil.insertOrUpdate(state, ['', '']);
      break;
    case REMOVE_NODE_PROP:
      nextState = OrgDrawerUtil.remove(state, [action.propKey]);
      break;
    case COMPLETE_HABIT:
      if (OrgDrawerUtil.hasKey(state, 'LAST_REAT'))
        nextState = OrgDrawerUtil.update(state, [
          'LAST_REPEAT',
          action.timestampStr
        ]);
      break;
    default:
      return state;
      break;
  }
  return nextState || state;
}

function logbook(state = { entries: [] }, action) {
  let nextState, clonedEntries;
  switch (action.type) {
    case INSERT_NEW_NODE_LOG_NOTE:
      clonedEntries =
        state && state.entries && state.entries.length > 0
          ? state.entries.slice(0)
          : [];
      clonedEntries.unshift({
        type: 'note',
        timestamp: action.timestampStr,
        text: 'foo'
      });
      nextState = Object.assign({}, state, { entries: clonedEntries });
      break;
    case UPDATE_NODE_LOG_NOTE:
      clonedEntries = state.entries.slice(0);
      let updatedEntry = Object.assign({}, state.entries[action.idx], {
        text: action.text
      });
      clonedEntries.splice(action.idx, 1, updatedEntry);
      nextState = Object.assign({}, state, { entries: clonedEntries });
      break;
    case REMOVE_NODE_LOG_NOTE:
      clonedEntries = state.entries.slice(0);
      clonedEntries.splice(action.idx, 1);
      nextState = Object.assign({}, state, { entries: clonedEntries });
      break;
    case COMPLETE_TODO:
    case COMPLETE_HABIT:
      // i think I may need to deep copy this stuff
      clonedEntries = state && state.entries ? state.entries.slice(0) : [];
      clonedEntries.unshift({
        type: 'state',
        state: '"DONE"',
        from: '"TODO"',
        timestamp: action.timestampStr,
        text: action.noteText || ''
      });
      nextState = Object.assign({}, state, { entries: clonedEntries });
      break;
  }
  return nextState || state;
}

function body(state = '', action) {
  let nextState;
  switch (action.type) {
    case UPDATE_NODE_BODY:
      nextState = action.text;
      return nextState;
      break;
  }
  return nextState || state;
}

const orgNode = combineReducers({
  id,
  headline,
  opened,
  scheduled,
  deadline,
  closed,
  propDrawer,
  logbook,
  body
});

function orgNodes(state = {}, action) {
  let nextState;
  switch (action.type) {
    case DELETE_NODE:
      nextState = Object.assign({}, state);
      delete nextState[action.nodeID];
      break;
    case ADD_NEW_NODE:
    case COMPLETE_TODO:
    case COMPLETE_HABIT:
    case RESET_HABIT:
    case CYCLE_NODE_COLLAPSE:
    case UPDATE_NODE_TODO_KEYWORD:
    case UPDATE_NODE_HEADLINE_CONTENT:
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
      const findAndAdd = tree => {
        let newTree = { nodeID: tree.nodeID, children: [] };
        if (tree.nodeID === action.parentID) {
          let clonedKids = tree.children.slice(0);
          clonedKids.push({ nodeID: action.nodeID, children: [] });
          newTree.children = clonedKids;
          return newTree;
        } else {
          tree.children.forEach(c => {
            let newChild = findAndAdd(c);
            newTree.children.push(newChild);
          });
          return newTree;
        }
      };
      nextState = findAndAdd(state);
      break;
    case DELETE_NODE:
      const findAndDelete = tree => {
        if (tree.nodeID === action.nodeID) {
          return null;
        } else {
          let newTree = { nodeID: tree.nodeID, children: [] };
          tree.children.forEach(c => {
            let newChild = findAndDelete(c);
            if (newChild !== null) newTree.children.push(newChild);
          });
          return newTree;
        }
      };
      nextState = findAndDelete(state);
      break;
    default:
      break;
  }
  return nextState || state;
}

/////////////////////////////////////////////////////////////////////  ORG BUFFER

function orgBuffers(state = {}, action) {
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
      nextState[action.bufferID].orgTree = orgTree(
        nextState[action.bufferID].orgTree,
        action
      );
    // break; is missing on purpose
    case UPDATE_NODE_TODO_KEYWORD:
    case UPDATE_NODE_HEADLINE_CONTENT:
    case UPDATE_NODE_TIMESTAMP:
    case UPDATE_NODE_TIMESTAMP_REP_INT:
    case CLEAR_NODE_TIMESTAMP:
    case COMPLETE_HABIT:
    case COMPLETE_TODO:
    case RESET_HABIT:
    case CYCLE_NODE_COLLAPSE:
    case INSERT_NEW_NODE_PROP:
    case UPDATE_NODE_PROP:
    case REMOVE_NODE_PROP:
    case INSERT_NEW_NODE_LOG_NOTE:
    case UPDATE_NODE_LOG_NOTE:
    case REMOVE_NODE_LOG_NOTE:
    case UPDATE_NODE_BODY:
    case TOGGLE_NODE_TAG:
      nextState[action.bufferID].orgNodes = orgNodes(
        nextState[action.bufferID].orgNodes,
        action
      );
      break;
    case ADD_NEW_NODE:
      nextState[action.bufferID].orgNodes = orgNodes(
        nextState[action.bufferID].orgNodes,
        action
      );
      nextState[action.bufferID].orgTree = orgTree(
        nextState[action.bufferID].orgTree,
        action
      );
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
}

///////////////////////////////////////////////////////////////////////  SETTINGS

function settings(
  state = {
    inboxFile: { path: 'insert filepath', isFolder: false, isOk: null },
    ledgerFile: { path: 'insert filepath', isFolder: false, isOk: null },
    orgFiles: []
  },
  action
) {
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
    case 'settings:inboxFile:clear':
      nextState = Object.assign({}, state, {
        inboxFile: { path: 'insert filepath', isFolder: false, isOK: null }
      });
      break;
    case 'settings:ledgerFile:ok':
      nextState = Object.assign({}, state, {
        ledgerFile: { path: action.path, isFolder: action.isFolder, isOk: true }
      });
      break;
    case 'settings:ledgerFile:error':
      nextState = Object.assign({}, state, {
        ledgerFile: {
          path: action.path,
          isFolder: action.isFolder,
          isOk: false
        }
      });
      break;
    case 'settings:ledgerFile:clear':
      nextState = Object.assign({}, state, {
        ledgerFile: { path: 'insert filepath', isFolder: false, isOK: null }
      });
      break;
    case 'settings:toggleOrgFile':
      let nextOrgFiles;
      const { path } = action;
      const { orgFiles } = state;
      if (R.contains(path, orgFiles)) {
        nextOrgFiles = R.without(path, orgFiles);
      } else {
        nextOrgFiles = R.insert(orgFiles.length, path, orgFiles);
      }
      nextState = Object.assign({}, state, {
        orgFiles: nextOrgFiles
      });
      break;
  }

  const res = nextState || state;

  return res;
}

///////////////////////////////////////////////////////////////  DBX ACCESS TOKEN

function dbxAccessToken(state = null, action) {
  switch (action.type) {
    case REGISTER_DBX_ACCESS_TOKEN:
      return action.token;
      break;
    default:
      return state;
      break;
  }
}

/////////////////////////////////////////////////////////////////////////  LEDGER

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
      console.log(action.node.id);
      const idx = R.findIndex(n => n.id === action.node.id, state.ledgerNodes);
      console.log(idx);
      ledgerNodes = R.update(idx, action.node, state.ledgerNodes);
      nextState = Object.assign({}, state, { ledgerNodes });
      break;
  }
  return nextState || state;
}

///////////////////////////////////////////////////////////////////////////  DATA

const data = combineReducers({
  ledger
});

/////////////////////////////////////////////////////////////////  MOBILE ORG TOO

const mobileOrgTooApp = combineReducers({
  orgBuffers,
  nav,
  settings,
  dbxAccessToken,
  data
});

export default mobileOrgTooApp;
