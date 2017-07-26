/*
 * action types
 */

// export const ADD_NODE = 'ADD_NODE';
// export const TOGGLE_NODE = 'TOGGLE_NODE';
// export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';
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

// export function addTodo(text) {
//   return { type: ADD_TODO, text };
// }

// export function toggleTodo(index) {
//   return { type: TOGGLE_TODO, index };
// }

// export function setVisibilityFilter(filter) {
//   return { type: SET_VISIBILITY_FILTER, filter };
// }

export function cycleNodeCollapse(nodeID) {
  return { type: CYCLE_NODE_COLLAPSE, nodeID };
}
