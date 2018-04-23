import { combineReducers } from 'redux';
import R from 'ramda';

import {
  COMPLETE_HABIT,
  COMPLETE_TODO,
  ADD_NEW_NODE,
  CYCLE_NODE_COLLAPSE,
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
  return state;
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
  return state;
}

function planning(state = null, action) {
  switch (action.type) {
    case COMPLETE_HABIT:
      const newState = Object.assign({}, state, {
        scheduled: OrgTimestampUtil.calcNextRepeat(
          state.scheduled,
          action.timestampStr
        )
      });
      return newState;
      break;
    case UPDATE_NODE_TIMESTAMP:
      var targType = action.timestampType.toLowerCase();
      var nextTs = OrgTimestampUtil.clone(action.timestamp);
      nextTs.repeat = state[targType] ? state[targType].repeat : null;
      nextTs = OrgTimestampUtil.updateValue(nextTs);
      var nextState = Object.assign({}, state);
      nextState[targType] = nextTs;
      return nextState;
      break;
    case UPDATE_NODE_TIMESTAMP_REP_INT:
      var targType = action.timestampType.toLowerCase();
      var nextTs = OrgTimestampUtil.clone(state[targType]);
      var nextRep =
        action.repInt && action.repMin ? action.repInt + action.repMin : null;
      if (nextRep && action.repMax) nextRep += '/' + action.repMax;
      nextTs.repeat = nextRep;
      nextTs = OrgTimestampUtil.updateValue(nextTs);
      var nextState = Object.assign({}, state);
      nextState[targType] = nextTs;
      return nextState;
      break;
    case CLEAR_NODE_TIMESTAMP:
      var targType = action.timestampType.toLowerCase();
      var nextState = Object.assign({}, state);
      nextState[targType] = null;
      return nextState;
      break;
    default:
      return state;
      break;
  }
}
function propDrawer(state = null, action) {
  switch (action.type) {
    case COMPLETE_HABIT:
      if (state.props.LAST_REPEAT) {
        const newProps = Object.assign({}, state.props, {
          LAST_REPEAT: action.timestampStr
        });
        const newState = Object.assign({}, state, { props: newProps });
        return newState;
      } else {
        return state;
      }
      break;
    default:
      return state;
      break;
  }
}
function logbook(state = null, action) {
  switch (action.type) {
    case COMPLETE_HABIT:
      // i think I may need to deep copy this stuff
      const clonedItems = state && state.items ? state.items.slice(0) : [];
      clonedItems.unshift({
        type: 'state',
        state: '"DONE"',
        from: '"TODO"',
        timestamp: OrgTimestampUtil.parse(action.timestampStr),
        text: action.noteText || ''
      });
      const newState = Object.assign({}, state, { items: clonedItems });
      return newState;
      break;
    default:
      return state;
      break;
  }
}
function section(state = null, action) {
  switch (action.type) {
    case COMPLETE_HABIT:
      var nextChildren = state.children.map(c => {
        switch (c.type) {
          case 'org.planning':
            return planning(c, action);
            break;
          case 'org.propDrawer':
            return propDrawer(c, action);
            break;
          case 'org.logbook':
            return logbook(c, action);
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
      var nextChildren = state.children.map(c => {
        switch (c.type) {
          case 'org.planning':
            return planning(c, action);
            break;
          default:
            return c;
            break;
        }
      });
      return Object.assign({}, state, { children: nextChildren });
      break;
    default:
      return state;
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
//     case UPDATE_NODE_TODO_KEYWORD:
//       if (action.todoKeyword === 'none') {
//         return Object.assign({}, state, {
//           todoKeyword: undefined
//           // todoKeywordColor: undefined,
//         });
//       }
//       return Object.assign({}, state, {
//         todoKeyword: action.todoKeyword
//         // todoKeywordColor: action.todoKeywordColor,
//       });
//       break;
//     case UPDATE_NODE_HEADLINE_TITLE:
//       console.log(action);
//       return Object.assign({}, state, { title: action.text });
//       break;
//     case TOGGLE_NODE_TAG:
//       let tags = state.tags || [];
//       if (R.contains(action.tag, tags)) {
//         tags = R.without(action.tag, tags);
//       } else {
//         tags = R.insert(tags.length, action.tag, tags);
//       }
//       return Object.assign({}, state, { tags });
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
//     case COMPLETE_HABIT:
//       if (OrgDrawerUtil.hasKey(state, 'LAST_REAT'))
//         nextState = OrgDrawerUtil.update(state, [
//           'LAST_REPEAT',
//           action.timestampStr
//         ]);
//       break;
//     default:
//       return state;
//       break;
//   }
//   return nextState || state;
// }

// function logbook(state = { entries: [] }, action) {
//   let nextState, clonedEntries;
//   switch (action.type) {
//     case INSERT_NEW_NODE_LOG_NOTE:
//       clonedEntries =
//         state && state.entries && state.entries.length > 0
//           ? state.entries.slice(0)
//           : [];
//       clonedEntries.unshift({
//         type: 'note',
//         timestamp: action.timestampStr,
//         text: 'foo'
//       });
//       nextState = Object.assign({}, state, { entries: clonedEntries });
//       break;
//     case UPDATE_NODE_LOG_NOTE:
//       clonedEntries = state.entries.slice(0);
//       let updatedEntry = Object.assign({}, state.entries[action.idx], {
//         text: action.text
//       });
//       clonedEntries.splice(action.idx, 1, updatedEntry);
//       nextState = Object.assign({}, state, { entries: clonedEntries });
//       break;
//     case REMOVE_NODE_LOG_NOTE:
//       clonedEntries = state.entries.slice(0);
//       clonedEntries.splice(action.idx, 1);
//       nextState = Object.assign({}, state, { entries: clonedEntries });
//       break;
//     case COMPLETE_TODO:
//     case COMPLETE_HABIT:
//       // i think I may need to deep copy this stuff
//       clonedEntries = state && state.entries ? state.entries.slice(0) : [];
//       clonedEntries.unshift({
//         type: 'state',
//         state: '"DONE"',
//         from: '"TODO"',
//         timestamp: action.timestampStr,
//         text: action.noteText || ''
//       });
//       nextState = Object.assign({}, state, { entries: clonedEntries });
//       break;
//   }
//   return nextState || state;
// }

// function body(state = '', action) {
//   let nextState;
//   switch (action.type) {
//     case UPDATE_NODE_BODY:
//       nextState = action.text;
//       return nextState;
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
  section,
  children,
  parent
  // headline,
  // opened,
  // scheduled,
  // deadline,
  // closed,
  // propDrawer,
  // logbook,
  // body
});

export default orgNode;
