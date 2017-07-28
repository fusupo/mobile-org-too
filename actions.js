const OrgNodeUtil = require('org-parse').OrgNode;

/*
 * action types
 */

export const CYCLE_NODE_COLLAPSE = 'CYCLE_NODE_COLLAPSE';
export const UPDATE_NODE_HEADLINE_CONTENT = 'UPDATE_NODE_HEADLINE_CONTENT';
export const ADD_NEW_NODE = 'ADD_NEW_NODE';
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

export function cycleNodeCollapse(nodeID) {
  return { type: CYCLE_NODE_COLLAPSE, nodeID };
}

export function updateNodeHeadlineContent(nodeID, text) {
  return { type: UPDATE_NODE_HEADLINE_CONTENT, nodeID, text };
}

export function addNewNode() {
  return { type: ADD_NEW_NODE, nodeID: OrgNodeUtil.newNodeID() };
}

export function deleteNode(nodeID) {
  return { type: DELETE_NODE, nodeID };
}

export function completeHabit(nodeID, timestampStr) {
  return { type: COMPLETE_HABIT, nodeID, timestampStr };
}

export function resetHabit(nodeID, timestampStr) {
  return { type: RESET_HABIT, nodeID, timestampStr };
}
