import { combineReducers } from 'redux';
import R from 'ramda';

import {
  COMPLETE_HABIT,
  COMPLETE_TODO,
  ADD_NEW_NODE,
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

import Section from './Section';

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

function type(state = null, action) {
  return state;
}

function stars(state = null, action) {
  return state;
}

function keyword(state = null, action) {
  switch (action.type) {
    case UPDATE_NODE_TODO_KEYWORD:
      if (action.todoKeyword === 'none') {
        return null;
      }
      return action.todoKeyword;
      break;
    default:
      return state;
      break;
  }
}

function priority(state = null, action) {
  return state;
}

function comment(state = null, action) {
  return state;
}

function title(state = null, action) {
  switch (action.type) {
    case UPDATE_NODE_HEADLINE_TITLE:
      return action.text;
      break;
    default:
      return state;
  }
}

function tags(state = null, action) {
  switch (action.type) {
    case TOGGLE_NODE_TAG:
      let tags = state ? state.slice(0) : [];
      if (R.contains(action.tag, tags)) {
        tags = R.without(action.tag, tags);
      } else {
        tags = R.insert(tags.length, action.tag, tags);
      }
      return tags;
      break;
    default:
      return state;
      break;
  }
}

function children(state = null, action) {
  return state;
}

function parent(state = null, action) {
  return state;
}

// function headline(
//   state = {
//     level: 1,
//     tags: [],
//     content: 'new node',
//     todoKeyword: undefined
//     // todoKeywordColor: undefined
//   },
//   action
// ) {
//   switch (action.type) {
//     case ADD_NEW_NODE:
//       return Object.assign({}, state, { level: action.level });
//       break;
//     default:
//       return state;
//       break;
//   }
// }

// // SCHEDULING
// function opened(state = null, action) {
//   let nextState;
//   if (action.timestampType === 'OPENED') {
//     switch (action.type) {
//       case UPDATE_NODE_TIMESTAMP:
//         nextState = action.timestamp;
//         break;
//       case UPDATE_NODE_TIMESTAMP_REP_INT:
//         nextState = Object.assign({}, state, {
//           repInt: action.repInt,
//           repMin: action.repMin,
//           repMax: action.repMax
//         });
//         break;
//       case CLEAR_NODE_TIMESTAMP:
//         nextState = null;
//         //short circuit the null check bellow
//         return nextState;
//         break;
//     }
//   }
//   return nextState || state;
// }

// function scheduled(state = null, action) {
//   let nextState;
//   if (action.type === COMPLETE_HABIT) {
//     nextState = OrgTimestampUtil.calcNextRepeat(state, action.timestampStr);
//   } else {
//     if (action.timestampType === 'SCHEDULED') {
//       switch (action.type) {
//         case UPDATE_NODE_TIMESTAMP:
//           nextState = action.timestamp;
//           break;
//         case UPDATE_NODE_TIMESTAMP_REP_INT:
//           nextState = Object.assign({}, state, {
//             repInt: action.repInt,
//             repMin: action.repMin,
//             repMax: action.repMax
//           });
//           break;
//         case CLEAR_NODE_TIMESTAMP:
//           nextState = null;
//           //short circuit the null check bellow
//           return nextState;
//           break;
//       }
//     }
//   }
//   return nextState || state;
// }

// function deadline(state = null, action) {
//   let nextState;
//   if (action.timestampType === 'DEADLINE') {
//     switch (action.type) {
//       case UPDATE_NODE_TIMESTAMP:
//         nextState = action.timestamp;
//         break;
//       case UPDATE_NODE_TIMESTAMP_REP_INT:
//         nextState = Object.assign({}, state, {
//           repInt: action.repInt,
//           repMin: action.repMin,
//           repMax: action.repMax
//         });
//         break;
//       case CLEAR_NODE_TIMESTAMP:
//         nextState = null;
//         //short circuit the null check bellow
//         return nextState;
//         break;
//     }
//   }
//   return nextState || state;
// }

// function closed(state = null, action) {
//   let nextState;
//   if (action.timestampType === 'CLOSED') {
//     switch (action.type) {
//       case UPDATE_NODE_TIMESTAMP:
//         nextState = action.timestamp;
//         break;
//       // case UPDATE_NODE_TIMESTAMP_REP_INT:
//       //   nextState = Object.assign({}, state, {
//       //     repInt: action.repInt,
//       //     repMin: action.repMin,
//       //     repMax: action.repMax
//       //   });
//       //   break;
//       case CLEAR_NODE_TIMESTAMP:
//         nextState = null;
//         //short circuit the null check bellow
//         return nextState;
//         break;
//     }
//   }
//   return nextState || state;
// }
// // END SCHEDULING

// function propDrawer(state = { name: 'properties', properties: [] }, action) {
//   let nextState;
//   switch (action.type) {
//     case CYCLE_NODE_COLLAPSE:
//       const key = 'collapseStatus';
//       let idx = OrgDrawerUtil.indexOfKey(state, key);
//       if (idx === -1 || state.properties[idx][1] === 'collapsed') {
//         nextState = OrgDrawerUtil.insertOrUpdate(state, [key, 'expanded']);
//       } else if (state.properties[idx][1] === 'expanded') {
//         nextState = OrgDrawerUtil.insertOrUpdate(state, [key, 'collapsed']);
//       }
//       // else if (state.properties[idx][1] === 'maximized') {
//       //     return OrgDrawerUtil.insertOrUpdate(state, [key, 'collapsed']);
//       //   }
//       break;
//     case UPDATE_NODE_PROP:
//       const clonedProps = state.properties.slice(0);
//       clonedProps.splice(action.idx, 1, [action.propKey, action.propVal]);
//       nextState = Object.assign({}, state, { properties: clonedProps });
//       break;
//     case INSERT_NEW_NODE_PROP:
//       nextState = OrgDrawerUtil.insertOrUpdate(state, ['', '']);
//       break;
//     case REMOVE_NODE_PROP:
//       nextState = OrgDrawerUtil.remove(state, [action.propKey]);
//       break;
//     default:
//       return state;
//       break;
//   }
//   return nextState || state;
// }

const orgNode = combineReducers({
  id,
  type,
  stars,
  keyword,
  priority,
  comment,
  title,
  tags,
  section: Section,
  children,
  parent
});

export default orgNode;
