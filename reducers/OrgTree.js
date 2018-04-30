import { DELETE_NODE, ADD_NEW_NODE } from '../actions';

const orgTree = (state = {}, action) => {
  let nextState, clonedKids;
  switch (action.type) {
    case ADD_NEW_NODE:
      console.log('ADD_NEW_NODE', state, action);
      const findAndAdd = tree => {
        if (tree.type === 'org.document') {
          let newTree = { type: 'org.document', headlines: [] };
          if (action.parentID === 'root') {
            let section = tree.section && Object.assign({}, tree.section);
            let clonedKids = tree.headlines.slice(0);
            clonedKids.push({ id: action.nodeID, children: [] });
            newTree.headlines = clonedKids;
            newTree.section = section || null;

            return newTree;
          } else {
            if (tree.headlines)
              tree.headlines.forEach(c => {
                let newChild = findAndAdd(c);
                newTree.headlines.push(newChild);
              });
            return newTree;
          }
        } else {
          let newTree = { id: tree.id, children: [] };
          if (tree.id === action.parentID) {
            let clonedKids = tree.children.slice(0);
            clonedKids.push({ id: action.nodeID, children: [] });
            newTree.children = clonedKids;
            return newTree;
          } else {
            if (tree.children)
              tree.children.forEach(c => {
                let newChild = findAndAdd(c);
                newTree.children.push(newChild);
              });
            return newTree;
          }
        }
      };
      nextState = findAndAdd(state);
      console.log('NEXT STATE', nextState);
      break;
    case DELETE_NODE:
      console.log('DELETE', state, action);
      const findAndDelete = tree => {
        if (tree.type === 'org.document') {
          let newTree = { type: 'org.document', headlines: [] };
          if (action.parentID === 'root') {
            return null;
            // let section = tree.section && Object.assign({}, tree.section);
            // let clonedKids = tree.headlines.slice(0).filter((c)=>c.id !== action.nodeID);
            // newTree.headlines = clonedKids;
            // newTree.section = section || null;
            // return newTree;
          } else {
            if (tree.headlines) {
              tree.headlines.forEach(c => {
                let newChild = findAndDelete(c);
                if (newChild !== null) newTree.headlines.push(newChild);
              });
            }
            return newTree;
          }
        } else {
          if (tree.id === action.nodeID) {
            return null;
          } else {
            let newTree = { id: tree.id, children: [] };
            if (tree.children)
              tree.children.forEach(c => {
                let newChild = findAndDelete(c);
                if (newChild !== null) newTree.children.push(newChild);
              });
            return newTree;
          }
        }
      };
      nextState = findAndDelete(state);
      console.log('NEXT STATE AFTER DELETOION', nextState);
      break;
    default:
      break;
  }
  return nextState || state;
};

export default orgTree;
