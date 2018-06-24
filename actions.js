import { uuid } from './utilities/utils';

/*
 * action types
 */

export const REGISTER_DBX_ACCESS_TOKEN = 'REGISTER_DBX_ACCESS_TOKEN';
export const CYCLE_NODE_COLLAPSE = 'CYCLE_NODE_COLLAPSE';
export const UPDATE_NODE_TODO_KEYWORD = 'UPDATE_NODE_TODO_KEYWORD';
export const UPDATE_NODE_HEADLINE_TITLE = 'UPDATE_NODE_HEADLINE_TITLE';
export const ADD_NEW_NODE_PLANNING = 'ADD_NEW_NODE_PLANNING';
export const UPDATE_NODE_TIMESTAMP = 'UPDATE_NODE_TIMESTAMP';
export const UPDATE_NODE_TIMESTAMP_REP_INT = 'UPDATE_NODE_TIMESTAMP_REP_INT';
export const CLEAR_NODE_TIMESTAMP = 'CLEAR_NODE_TIMESTAMP';
export const ADD_NEW_NODE = 'ADD_NEW_NODE';
export const DELETE_NODE = 'DELETE_NODE';
export const COMPLETE_HABIT = 'COMPLETE_HABIT';
export const COMPLETE_TODO = 'COMPLETE_TODO';
export const RESET_HABIT = 'RESET_HABIT';
export const ADD_NEW_NODE_PROP_DRAWER = 'ADD_NEW_NODE_PROP_DRAWER';
export const INSERT_NEW_NODE_PROP = 'INSERT_NEW_NODE_PROP';
export const UPDATE_NODE_PROP = 'UPDATE_NODE_PROP';
export const REMOVE_NODE_PROP = 'REMOVE_NODE_PROP';
export const ADD_NEW_NODE_LOGBOOK = 'ADD_NEW_NODE_LOGBOOK';
export const INSERT_NEW_NODE_LOG_NOTE = 'INSERT_NEW_NODE_LOG_NOTE';
export const UPDATE_NODE_LOG_NOTE = 'UPDATE_NODE_LOG_NOTE';
export const REMOVE_NODE_LOG_NOTE = 'REMOVE_NODE_LOG_NOTE';
export const TOGGLE_NODE_TAG = 'TOGGLE_NODE_TAG';
export const ADD_NEW_NODE_PARAGRAPH = 'ADD_NEW_NODE_PARAGRAPH';
export const UPDATE_NODE_PARAGRAPH = 'UPDATE_NODE_PARAGRAPH';
export const UPDATE_SECTION_ITEM_INDEX = 'UPDATE_SECTION_ITEM_INDEX';

/*
 * other constants
 */

// export const VisibilityFilters = {
//   SHOW_ALL: 'SHOW_ALL',
//   SHOW_COMPLETED: 'SHOW_COMPLETED',
//   SHOW_ACTIVE: 'SHOW_ACTIVE'
// };

/*
 * action creators
 */

export function registerDbxAccessToken(token) {
  return { type: REGISTER_DBX_ACCESS_TOKEN, token };
}

export function cycleNodeCollapse(bufferID, nodeID) {
  return { type: CYCLE_NODE_COLLAPSE, bufferID, nodeID };
}

export function updateNodeTodoKeyword(bufferID, nodeID, todoKeyword) {
  return { type: UPDATE_NODE_TODO_KEYWORD, bufferID, nodeID, todoKeyword };
}

export function updateNodeHeadlineTitle(bufferID, nodeID, text) {
  return { type: UPDATE_NODE_HEADLINE_TITLE, bufferID, nodeID, text };
}

export function addNewNodePlanning(bufferID, nodeID) {
  return {
    type: ADD_NEW_NODE_PLANNING,
    bufferID,
    nodeID
  };
}

export function updateNodeTimestampRepInt(
  bufferID,
  nodeID,
  timestampType,
  repInt,
  repMin,
  repMax
) {
  return {
    type: UPDATE_NODE_TIMESTAMP_REP_INT,
    bufferID,
    nodeID,
    timestampType,
    repInt,
    repMin,
    repMax
  };
}

export function updateNodeTimestamp(
  bufferID,
  nodeID,
  timestampType,
  timestamp
) {
  return {
    type: UPDATE_NODE_TIMESTAMP,
    bufferID,
    nodeID,
    timestampType,
    timestamp
  };
}

export function clearNodeTimestamp(bufferID, nodeID, timestampType) {
  return {
    type: CLEAR_NODE_TIMESTAMP,
    bufferID,
    nodeID,
    timestampType
  };
}

export function addNewNode(bufferID, parentID = 'root', level = 1) {
  return {
    type: ADD_NEW_NODE,
    bufferID,
    parentID,
    nodeID: uuid(),
    level
  };
}

export function deleteNode(bufferID, nodeID) {
  return { type: DELETE_NODE, bufferID, nodeID };
}

export function completeHabit(bufferID, nodeID, timestampStr, noteText) {
  return { type: COMPLETE_HABIT, bufferID, nodeID, timestampStr, noteText };
}

export function completeTodo(bufferID, nodeID, timestampStr, noteText) {
  return {
    type: COMPLETE_TODO,
    bufferID,
    nodeID,
    timestampStr,
    noteText
  };
}

export function resetHabit(bufferID, nodeID, timestampStr) {
  return { type: RESET_HABIT, bufferID, nodeID, timestampStr };
}

export function addNewNodePropDrawer(bufferID, nodeID) {
  return { type: ADD_NEW_NODE_PROP_DRAWER, bufferID, nodeID };
}

export function insertNewNodeProp(bufferID, nodeID) {
  return { type: INSERT_NEW_NODE_PROP, bufferID, nodeID };
}

export function updateNodeProp(
  bufferID,
  nodeID,
  idx,
  oldPropKey,
  propKey,
  propVal
) {
  return {
    type: UPDATE_NODE_PROP,
    bufferID,
    nodeID,
    idx,
    oldPropKey,
    propKey,
    propVal
  };
}

export function removeNodeProp(bufferID, nodeID, propKey) {
  return { type: REMOVE_NODE_PROP, bufferID, nodeID, propKey };
}

export function addNewNodeLogbook(bufferID, nodeID) {
  return {
    type: ADD_NEW_NODE_LOGBOOK,
    bufferID,
    nodeID
  };
}

export function insertNewNodeLogNote(bufferID, nodeID, timestampStr) {
  return { type: INSERT_NEW_NODE_LOG_NOTE, bufferID, nodeID, timestampStr };
}

export function updateNodeLogNote(bufferID, nodeID, idx, text) {
  return {
    type: UPDATE_NODE_LOG_NOTE,
    bufferID,
    nodeID,
    idx,
    text
  };
}

export function removeNodeLogNote(bufferID, nodeID, idx) {
  return { type: REMOVE_NODE_LOG_NOTE, bufferID, nodeID, idx };
}

export function toggleNodeTag(bufferID, nodeID, tag) {
  return {
    type: TOGGLE_NODE_TAG,
    bufferID,
    nodeID,
    tag
  };
}

export function addNewNodeParagraph(bufferID, nodeID) {
  return {
    type: ADD_NEW_NODE_PARAGRAPH,
    bufferID,
    nodeID
  };
}

export function updateNodeParagraph(bufferID, nodeID, idx, text) {
  return {
    type: UPDATE_NODE_PARAGRAPH,
    bufferID,
    nodeID,
    idx,
    text
  };
}

export function updateSectionItemIndex(bufferID, nodeID, from, to) {
  return {
    type: UPDATE_SECTION_ITEM_INDEX,
    bufferID,
    nodeID,
    from,
    to
  };
}
