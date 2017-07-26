/*
 * action types
 */

export const CYCLE_NODE_COLLAPSE = 'CYCLE_NODE_COLLAPSE';

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