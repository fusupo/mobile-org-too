import {
  DELETE_NODE,
  ADD_NEW_NODE,
  //
  //
  COMPLETE_HABIT,
  COMPLETE_TODO,
  UPDATE_NODE_TODO_KEYWORD,
  UPDATE_NODE_HEADLINE_TITLE,
  ADD_NEW_NODE_PLANNING,
  UPDATE_NODE_TIMESTAMP,
  UPDATE_NODE_TIMESTAMP_REP_INT,
  CLEAR_NODE_TIMESTAMP,
  ADD_NEW_NODE_PROP_DRAWER,
  INSERT_NEW_NODE_PROP,
  UPDATE_NODE_PROP,
  REMOVE_NODE_PROP,
  ADD_NEW_NODE_LOGBOOK,
  INSERT_NEW_NODE_LOG_NOTE,
  UPDATE_NODE_LOG_NOTE,
  REMOVE_NODE_LOG_NOTE,
  UPDATE_NODE_PARAGRAPH,
  TOGGLE_NODE_TAG,
  ADD_NEW_NODE_PARAGRAPH,
  UPDATE_SECTION_ITEM_INDEX,
  REMOVE_SECTION_ITEM_AT_INDEX
} from '../actions';

import orgNode from './OrgNode';
import Section from './Section';

const doSomeShit = (state, action) => {
  let nextState = Object.assign({}, state);
  if (state.id && state.id === action.nodeID) {
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
  return nextState;
};

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
      break;

    case UPDATE_NODE_TIMESTAMP:
    case UPDATE_NODE_TIMESTAMP_REP_INT:
    case CLEAR_NODE_TIMESTAMP:
    case INSERT_NEW_NODE_PROP:
    case UPDATE_NODE_PROP:
    case REMOVE_NODE_PROP:
    case INSERT_NEW_NODE_LOG_NOTE:
    case UPDATE_NODE_LOG_NOTE:
    case REMOVE_NODE_LOG_NOTE:
    case UPDATE_NODE_PARAGRAPH:
    case UPDATE_SECTION_ITEM_INDEX:
    case REMOVE_SECTION_ITEM_AT_INDEX:

    case ADD_NEW_NODE_PLANNING:
    case ADD_NEW_NODE_PROP_DRAWER:
    case ADD_NEW_NODE_LOGBOOK:
    case ADD_NEW_NODE_PARAGRAPH:
      console.log(state, action);
      if (action.nodeID === null) {
        nextState = Object.assign({}, state, {
          section: Section(state.section, action)
        });
      } else {
        nextState = doSomeShit(state, action);
      }
      break;
    case COMPLETE_TODO:
    case COMPLETE_HABIT:
    case UPDATE_NODE_TODO_KEYWORD:
    case UPDATE_NODE_HEADLINE_TITLE:
    case TOGGLE_NODE_TAG:
      nextState = doSomeShit(state, action);
      break;
    default:
      break;
  }
  return nextState || state;
};

export default orgTree;
