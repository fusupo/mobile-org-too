import {
  DELETE_NODE,
  ADD_NEW_NODE,
  //
  //
  COMPLETE_HABIT,
  COMPLETE_TODO,
  UPDATE_NODE_TODO_KEYWORD,
  UPDATE_NODE_HEADLINE_TITLE,
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
} from '../actions';

import orgNode from './OrgNode';

const orgTree = (state = {}, action) => {
  let nextState, clonedKids;
  switch (action.type) {
    case ADD_NEW_NODE:
      if (state.type === 'org.document') {
        if (action.parentID === 'root') {
          var nextHeadlines = state.headlines.slice(0);
          nextHeadlines.push({
            id: action.nodeID,
            stars: action.level,
            children: null,
            comment: false,
            keyword: null,
            priority: null,
            section: null,
            tags: null,
            title: '',
            type: 'org.headline'
          });
          nextState = Object.assign({}, state, { headlines: nextHeadlines });
        } else {
          var nextHeadlines = state.headlines.map(hl => orgTree(hl, action));
          nextState = Object.assign({}, state, { headlines: nextHeadlines });
        }
      } else {
        nextState = Object.assign({}, state);
        if (action.parentID === 'root') {
          console.log('THIS SHOULD NOT BE HAPPENING');
        } else if (action.parentID === state.id) {
          nextState.children = nextState.children || [];
          nextState.children.push({
            id: action.nodeID,
            stars: action.level,
            children: null,
            comment: false,
            keyword: null,
            priority: null,
            section: null,
            tags: null,
            title: '',
            type: 'org.headline'
          });
        } else {
          var nextChildren = state.children
            ? state.children.map(c => orgTree(c, action))
            : null;
          nextState.children = nextChildren;
        }
      }
      break;

    case DELETE_NODE:
      console.log('DELETE', state, action);
      if (state.type === 'org.document') {
        var nextHeadlines = state.headlines.reduce((m, hl) => {
          if (hl.id !== action.nodeID) m.push(orgTree(hl, action));
          console.log(m);
          return m;
        }, []);
        console.log(nextHeadlines);
        nextState = Object.assign({}, state, { headlines: nextHeadlines });
      } else {
        if (state.children) {
          var nextChildren = state.children.reduce((m, c) => {
            if (c.id !== action.nodeID) m.push(orgTree(c, action));
            return m;
          }, []);
          nextState = Object.assign({}, state, { children: nextChildren });
        } else {
          nextState = Object.assign({}, state);
        }
      }

      // const findAndDelete = tree => {
      //   if (tree.type === 'org.document') {
      //     let newTree = { type: 'org.document', headlines: [] };
      //     if (action.parentID === 'root') {
      //       return null;
      //       // let section = tree.section && Object.assign({}, tree.section);
      //       // let clonedKids = tree.headlines.slice(0).filter((c)=>c.id !== action.nodeID);
      //       // newTree.headlines = clonedKids;
      //       // newTree.section = section || null;
      //       // return newTree;
      //     } else {
      //       if (tree.headlines) {
      //         tree.headlines.forEach(c => {
      //           let newChild = findAndDelete(c);
      //           if (newChild !== null) newTree.headlines.push(newChild);
      //         });
      //       }
      //       return newTree;
      //     }
      //   } else {
      //     if (tree.id === action.nodeID) {
      //       return null;
      //     } else {
      //       let newTree = { id: tree.id, children: [] };
      //       if (tree.children)
      //         tree.children.forEach(c => {
      //           let newChild = findAndDelete(c);
      //           if (newChild !== null) newTree.children.push(newChild);
      //         });
      //       return newTree;
      //     }
      //   }
      // };
      // nextState = findAndDelete(state);
      // console.log('NEXT STATE AFTER DELETOION', nextState);
      break;

    case COMPLETE_HABIT:
    case UPDATE_NODE_TODO_KEYWORD:
    case UPDATE_NODE_HEADLINE_TITLE:
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
      nextState = Object.assign({}, state);
      if (state.id === action.nodeID) {
        nextState = orgNode(state, action);
      } else {
        var kids = state.headlines || state.children;
        var nextKids = null;
        if (kids) {
          nextKids = kids.map(k => {
            return orgTree(k, action);
          });
        }
        state.type === 'org.document'
          ? (nextState.headlines = nextKids)
          : (nextState.children = nextKids);
      }
      break;
    default:
      break;
  }
  return nextState || state;
};

export default orgTree;
