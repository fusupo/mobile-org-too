import {
  COMPLETE_HABIT,
  UPDATE_NODE_TIMESTAMP,
  UPDATE_NODE_TIMESTAMP_REP_INT,
  CLEAR_NODE_TIMESTAMP
} from '../actions';

const OrgTimestampUtil = require('../utilities/OrgTimestampUtil');

const Planning = (state = null, action) => {
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
};
export default Planning;
