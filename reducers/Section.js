import Planning from './Planning';
import PropDrawer from './PropDrawer';
import Logbook from './Logbook';
import Paragraph from './Paragraph';

import {
  COMPLETE_HABIT,
  COMPLETE_TODO,
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
  ADD_NEW_NODE_PARAGRAPH,
  UPDATE_SECTION_ITEM_INDEX,
  REMOVE_SECTION_ITEM_AT_INDEX
} from '../actions';

const Section = (state = { type: 'org.section', children: null }, action) => {
  const removeAndReturnChild = (childType, children) => {
    let i = 0;
    let child = null;

    while (children && i < children.length) {
      if (children[i].type === childType) {
        child = children[i];
        children.splice(i, 1);
        i = children.length;
      }
      i++;
    }

    return child;
  };
  const initState = (s = null, childType = null) => {
    let ret = s
      ? Object.assign({}, s)
      : { type: 'org.section', children: null };
    ret.children = ret.children ? ret.children.slice(0) : [];

    let planning = removeAndReturnChild('org.planning', ret.children);
    let propDrawer = removeAndReturnChild('org.propDrawer', ret.children);
    let logbook = removeAndReturnChild('org.logbook', ret.children);

    if (!planning && childType === 'org.planning')
      planning = {
        type: 'org.planning',
        scheduled: null,
        deadline: null,
        closed: null
      };
    if (!propDrawer && childType === 'org.propDrawer')
      propDrawer = { type: 'org.propDrawer', props: {} };
    if (!logbook && childType === 'org.logbook')
      logbook = { type: 'org.logbook', items: [] };

    // if (!ret.children) ret.children = [];

    if (logbook) ret.children.unshift(logbook);
    if (propDrawer) ret.children.unshift(propDrawer);
    if (planning) ret.children.unshift(planning);

    // ret.children.concat(ret.children);

    return ret;
  };

  switch (action.type) {
    case UPDATE_SECTION_ITEM_INDEX:
      var nextChildren = state.children.slice(0);
      var temp = nextChildren[action.from];
      nextChildren.splice(action.from, 1);
      nextChildren.splice(action.to, 0, temp);
      return Object.assign({}, state, { children: nextChildren });
      break;
    case REMOVE_SECTION_ITEM_AT_INDEX:
      var nextChildren = state.children.slice(0);
      nextChildren.splice(action.idx, 1);
      return Object.assign({}, state, { children: nextChildren });
      break;
      break;
    case ADD_NEW_NODE_PLANNING:
      return initState(state, 'org.planning');
      break;
    case COMPLETE_TODO:
      //NO-OP
      //TODO: handle logging prop case
      return state;
      break;
    case COMPLETE_HABIT:
      var nextChildren = state.children.map(c => {
        switch (c.type) {
          case 'org.planning':
            return Planning(c, action);
            break;
          case 'org.propDrawer':
            return PropDrawer(c, action);
            break;
          case 'org.logbook':
            return Logbook(c, action);
            break;
          default:
            return c;
            break;
        }
      });
      return Object.assign({}, state, { children: nextChildren });
      break;
    case CLEAR_NODE_TIMESTAMP:
    case UPDATE_NODE_TIMESTAMP:
    case UPDATE_NODE_TIMESTAMP_REP_INT:
      state = initState(state, 'org.planning');
      var nextChildren = state.children.map(c => {
        switch (c.type) {
          case 'org.planning':
            return Planning(c, action);
            break;
          default:
            return c;
            break;
        }
      });
      return Object.assign({}, state, { children: nextChildren });
      break;
    case ADD_NEW_NODE_PROP_DRAWER:
      return initState(state, 'org.propDrawer');
      break;
    case INSERT_NEW_NODE_PROP:
      state = initState(state, 'org.propDrawer');
    case UPDATE_NODE_PROP:
    case REMOVE_NODE_PROP:
      var nextChildren = state.children.map(c => {
        switch (c.type) {
          case 'org.propDrawer':
            return PropDrawer(c, action);
            break;
          default:
            return c;
            break;
        }
      });
      return Object.assign({}, state, { children: nextChildren });
      break;
    case ADD_NEW_NODE_LOGBOOK:
      return initState(state, 'org.logbook');
      break;
    case INSERT_NEW_NODE_LOG_NOTE:
      state = initState(state, 'org.logbook');
      console.log(state);
    case UPDATE_NODE_LOG_NOTE:
    case REMOVE_NODE_LOG_NOTE:
      var nextChildren = state.children.map(c => {
        switch (c.type) {
          case 'org.logbook':
            return Logbook(c, action);
            break;
          default:
            return c;
            break;
        }
      });
      return Object.assign({}, state, { children: nextChildren });
      break;
    case ADD_NEW_NODE_PARAGRAPH:
      if (state === null) state = { type: 'org.section', children: [] };
      var nextChildren = state.children ? state.children.slice(0) : [];
      nextChildren.push({ type: 'org.paragraph', value: ['hey', 'there'] });
      // var nextState = Object.assign({}, state);
      // if (!nextState.children) {
      //   nextState.children = [];
      // } else {
      //   nextState.children = nextState.children.slice(0);
      // }
      // nextState.children.push({ type: 'org.paragraph', value: [] });
      var nextState = Object.assign({}, state, { children: nextChildren });
      return nextState;
      break;
    case UPDATE_NODE_PARAGRAPH:
      var idx = action.idx;
      var para = state.children[idx];
      var nextChildren = state.children
        .slice(0, idx)
        .concat([Paragraph(para, action)])
        .concat(state.children.slice(idx + 1));
      return Object.assign({}, state, { children: nextChildren });
      break;
    default:
      return state;
  }
};

export default Section;
