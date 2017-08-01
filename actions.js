const OrgNodeUtil = require('org-parse').OrgNode;

/*
 * action types
 */

export const CYCLE_NODE_COLLAPSE = 'CYCLE_NODE_COLLAPSE';
export const UPDATE_NODE_TODO_KEYWORD = 'UPDATE_NODE_TODO_KEYWORD';
export const UPDATE_NODE_HEADLINE_CONTENT = 'UPDATE_NODE_HEADLINE_CONTENT';
export const UPDATE_NODE_TIMESTAMP = 'UPDATE_NODE_TIMESTAMP';
export const UPDATE_NODE_TIMESTAMP_REP_INT = 'UPDATE_NODE_TIMESTAMP_REP_INT';
export const CLEAR_NODE_TIMESTAMP = 'CLEAR_NODE_TIMESTAMP';
export const ADD_NEW_NODE = 'ADD_NEW_NODE';
export const DELETE_NODE = 'DELETE_NODE';
export const COMPLETE_HABIT = 'COMPLETE_HABIT';
export const RESET_HABIT = 'RESET_HABIT';
export const INSERT_NEW_NODE_PROP = 'INSERT_NEW_NODE_PROP';
export const UPDATE_NODE_PROP = 'UPDATE_NODE_PROP';
export const REMOVE_NODE_PROP = 'REMOVE_NODE_PROP';
export const INSERT_NEW_NODE_LOG_NOTE = 'INSERT_NEW_NODE_LOG_NOTE';
export const UPDATE_NODE_LOG_NOTE = 'UPDATE_NODE_LOG_NOTE';
export const REMOVE_NODE_LOG_NOTE = 'REMOVE_NODE_LOG_NOTE';

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

export function cycleNodeCollapse(bufferID, nodeID) {
  return { type: CYCLE_NODE_COLLAPSE, bufferID, nodeID };
}

export function updateNodeTodoKeyword(bufferID, nodeID, todoKeyword) {
  return { type: UPDATE_NODE_TODO_KEYWORD, bufferID, nodeID, todoKeyword };
}

export function updateNodeHeadlineContent(bufferID, nodeID, text) {
  return { type: UPDATE_NODE_HEADLINE_CONTENT, bufferID, nodeID, text };
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
export function addNewNode() {
  return { type: ADD_NEW_NODE, nodeID: OrgNodeUtil.newNodeID() };
}

export function deleteNode(bufferID, nodeID) {
  return { type: DELETE_NODE, bufferID, nodeID };
}

export function completeHabit(bufferID, nodeID, timestampStr) {
  return { type: COMPLETE_HABIT, bufferID, nodeID, timestampStr };
}

export function resetHabit(bufferID, nodeID, timestampStr) {
  return { type: RESET_HABIT, bufferID, nodeID, timestampStr };
}

export function insertNewNodeProp(bufferID, nodeID) {
  return { type: INSERT_NEW_NODE_PROP, bufferID, nodeID };
}

export function updateNodeProp(bufferID, nodeID, idx, propKey, propVal) {
  return { type: UPDATE_NODE_PROP, bufferID, nodeID, idx, propKey, propVal };
}

export function removeNodeProp(bufferID, nodeID, propKey) {
  return { type: REMOVE_NODE_PROP, bufferID, nodeID, propKey };
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
