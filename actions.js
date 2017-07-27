const OrgNodeUtil = require('org-parse').OrgNode;

/*
 * action types
 */

export const CYCLE_NODE_COLLAPSE = 'CYCLE_NODE_COLLAPSE';
export const UPDATE_NODE_HEADLINE_CONTENT = 'UPDATE_NODE_HEADLINE_CONTENT';
export const ADD_NEW_NODE = 'ADD_NEW_NODE';
export const DELETE_NODE = 'DELETE_NODE';

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
