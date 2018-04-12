import { combineReducers } from 'redux';
import R from 'ramda';

import {
  COMPLETE_HABIT,
  COMPLETE_TODO,
  ADD_NEW_NODE,
  CYCLE_NODE_COLLAPSE,
  UPDATE_NODE_TODO_KEYWORD,
  UPDATE_NODE_HEADLINE_CONTENT,
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

const OrgDrawerUtil = require('../utilities/OrgDrawerUtil');
const OrgTimestampUtil = require('../utilities/OrgTimestampUtil');

function id(state = {}, action) {
  switch (action.type) {
    case ADD_NEW_NODE:
      return action.nodeID;
      break;
    default:
      return state;
      break;
  }
}

function headline(
  state = {
    level: 1,
    tags: [],
    content: 'new node',
    todoKeyword: undefined
    // todoKeywordColor: undefined
  },
  action
) {
  switch (action.type) {
    case ADD_NEW_NODE:
      return Object.assign({}, state, { level: action.level });
      break;
    case UPDATE_NODE_TODO_KEYWORD:
      if (action.todoKeyword === 'none') {
        return Object.assign({}, state, {
          todoKeyword: undefined
          // todoKeywordColor: undefined,
        });
      }
      return Object.assign({}, state, {
        todoKeyword: action.todoKeyword
        // todoKeywordColor: action.todoKeywordColor,
      });
      break;
    case UPDATE_NODE_HEADLINE_CONTENT:
      return Object.assign({}, state, { content: action.text });
      break;
    case TOGGLE_NODE_TAG:
      let tags = state.tags || [];
      if (R.contains(action.tag, tags)) {
        tags = R.without(action.tag, tags);
      } else {
        tags = R.insert(tags.length, action.tag, tags);
      }
      return Object.assign({}, state, { tags });
      break;
    default:
      return state;
      break;
  }
}

// SCHEDULING
function opened(state = null, action) {
  let nextState;
  if (action.timestampType === 'OPENED') {
    switch (action.type) {
      case UPDATE_NODE_TIMESTAMP:
        nextState = action.timestamp;
        break;
      case UPDATE_NODE_TIMESTAMP_REP_INT:
        nextState = Object.assign({}, state, {
          repInt: action.repInt,
          repMin: action.repMin,
          repMax: action.repMax
        });
        break;
      case CLEAR_NODE_TIMESTAMP:
        nextState = null;
        //short circuit the null check bellow
        return nextState;
        break;
    }
  }
  return nextState || state;
}

function scheduled(state = null, action) {
  let nextState;
  if (action.type === COMPLETE_HABIT) {
    nextState = OrgTimestampUtil.calcNextRepeat(state, action.timestampStr);
  } else {
    if (action.timestampType === 'SCHEDULED') {
      switch (action.type) {
        case UPDATE_NODE_TIMESTAMP:
          nextState = action.timestamp;
          break;
        case UPDATE_NODE_TIMESTAMP_REP_INT:
          nextState = Object.assign({}, state, {
            repInt: action.repInt,
            repMin: action.repMin,
            repMax: action.repMax
          });
          break;
        case CLEAR_NODE_TIMESTAMP:
          nextState = null;
          //short circuit the null check bellow
          return nextState;
          break;
      }
    }
  }
  return nextState || state;
}

function deadline(state = null, action) {
  let nextState;
  if (action.timestampType === 'DEADLINE') {
    switch (action.type) {
      case UPDATE_NODE_TIMESTAMP:
        nextState = action.timestamp;
        break;
      case UPDATE_NODE_TIMESTAMP_REP_INT:
        nextState = Object.assign({}, state, {
          repInt: action.repInt,
          repMin: action.repMin,
          repMax: action.repMax
        });
        break;
      case CLEAR_NODE_TIMESTAMP:
        nextState = null;
        //short circuit the null check bellow
        return nextState;
        break;
    }
  }
  return nextState || state;
}

function closed(state = null, action) {
  let nextState;
  if (action.timestampType === 'CLOSED') {
    switch (action.type) {
      case UPDATE_NODE_TIMESTAMP:
        nextState = action.timestamp;
        break;
      // case UPDATE_NODE_TIMESTAMP_REP_INT:
      //   nextState = Object.assign({}, state, {
      //     repInt: action.repInt,
      //     repMin: action.repMin,
      //     repMax: action.repMax
      //   });
      //   break;
      case CLEAR_NODE_TIMESTAMP:
        nextState = null;
        //short circuit the null check bellow
        return nextState;
        break;
    }
  }
  return nextState || state;
}
// END SCHEDULING

function propDrawer(state = { name: 'properties', properties: [] }, action) {
  let nextState;
  switch (action.type) {
    case CYCLE_NODE_COLLAPSE:
      const key = 'collapseStatus';
      let idx = OrgDrawerUtil.indexOfKey(state, key);
      if (idx === -1 || state.properties[idx][1] === 'collapsed') {
        nextState = OrgDrawerUtil.insertOrUpdate(state, [key, 'expanded']);
      } else if (state.properties[idx][1] === 'expanded') {
        nextState = OrgDrawerUtil.insertOrUpdate(state, [key, 'collapsed']);
      }
      // else if (state.properties[idx][1] === 'maximized') {
      //     return OrgDrawerUtil.insertOrUpdate(state, [key, 'collapsed']);
      //   }
      break;
    case UPDATE_NODE_PROP:
      const clonedProps = state.properties.slice(0);
      clonedProps.splice(action.idx, 1, [action.propKey, action.propVal]);
      nextState = Object.assign({}, state, { properties: clonedProps });
      break;
    case INSERT_NEW_NODE_PROP:
      nextState = OrgDrawerUtil.insertOrUpdate(state, ['', '']);
      break;
    case REMOVE_NODE_PROP:
      nextState = OrgDrawerUtil.remove(state, [action.propKey]);
      break;
    case COMPLETE_HABIT:
      if (OrgDrawerUtil.hasKey(state, 'LAST_REAT'))
        nextState = OrgDrawerUtil.update(state, [
          'LAST_REPEAT',
          action.timestampStr
        ]);
      break;
    default:
      return state;
      break;
  }
  return nextState || state;
}

function logbook(state = { entries: [] }, action) {
  let nextState, clonedEntries;
  switch (action.type) {
    case INSERT_NEW_NODE_LOG_NOTE:
      clonedEntries =
        state && state.entries && state.entries.length > 0
          ? state.entries.slice(0)
          : [];
      clonedEntries.unshift({
        type: 'note',
        timestamp: action.timestampStr,
        text: 'foo'
      });
      nextState = Object.assign({}, state, { entries: clonedEntries });
      break;
    case UPDATE_NODE_LOG_NOTE:
      clonedEntries = state.entries.slice(0);
      let updatedEntry = Object.assign({}, state.entries[action.idx], {
        text: action.text
      });
      clonedEntries.splice(action.idx, 1, updatedEntry);
      nextState = Object.assign({}, state, { entries: clonedEntries });
      break;
    case REMOVE_NODE_LOG_NOTE:
      clonedEntries = state.entries.slice(0);
      clonedEntries.splice(action.idx, 1);
      nextState = Object.assign({}, state, { entries: clonedEntries });
      break;
    case COMPLETE_TODO:
    case COMPLETE_HABIT:
      // i think I may need to deep copy this stuff
      clonedEntries = state && state.entries ? state.entries.slice(0) : [];
      clonedEntries.unshift({
        type: 'state',
        state: '"DONE"',
        from: '"TODO"',
        timestamp: action.timestampStr,
        text: action.noteText || ''
      });
      nextState = Object.assign({}, state, { entries: clonedEntries });
      break;
  }
  return nextState || state;
}

function body(state = '', action) {
  let nextState;
  switch (action.type) {
    case UPDATE_NODE_BODY:
      nextState = action.text;
      return nextState;
      break;
  }
  return nextState || state;
}

const orgNode = combineReducers({
  id,
  headline,
  opened,
  scheduled,
  deadline,
  closed,
  propDrawer,
  logbook,
  body
});

export default orgNode;
