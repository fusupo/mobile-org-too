const OrgNodeUtil = require('org-parse').OrgNode;

/*
 * action types
 */

export const CYCLE_NODE_COLLAPSE = 'CYCLE_NODE_COLLAPSE';
export const UPDATE_NODE_TODO_KEYWORD = 'UPDATE_NODE_TODO_KEYWORD';
export const UPDATE_NODE_HEADLINE_CONTENT = 'UPDATE_NODE_HEADLINE_CONTENT';
export const UPDATE_NODE_TIMESTAMP = 'UPDATE_NODE_TIMESTAMP';
export const ADD_NEW_NODE = 'ADD_NEW_NODE';
export const DELETE_NODE = 'DELETE_NODE';
export const COMPLETE_HABIT = 'COMPLETE_HABIT';
export const RESET_HABIT = 'RESET_HABIT';

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
