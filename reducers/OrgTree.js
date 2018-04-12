import { DELETE_NODE, ADD_NEW_NODE } from '../actions';

const orgTree = (state = {}, action) => {
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
};

export default orgTree;
