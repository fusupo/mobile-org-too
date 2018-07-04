import {
  COMPLETE_HABIT,
  INSERT_NEW_NODE_PROP,
  UPDATE_NODE_PROP,
  REMOVE_NODE_PROP
} from '../actions';

const PropDrawer = (state = null, action) => {
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
    case INSERT_NEW_NODE_PROP:
      var newProp = {};
      newProp[''] = '';
      var foo = Object.assign({}, state.props, newProp);
      var bar = Object.assign({}, state, { props: foo });
      return bar;
      break;
    case UPDATE_NODE_PROP:
      var newProp = {};
      newProp[action.propKey] = action.propVal;
      var nextProps = Object.assign({}, state.props, newProp);
      if (action.propKey !== action.oldPropKey)
        delete nextProps[action.oldPropKey];
      var nextState = Object.assign({}, state, { props: nextProps });
      return nextState;
      break;
    case REMOVE_NODE_PROP:
      var newProps = Object.assign({}, state.props);
      delete newProps[action.propKey];
      return Object.assign({}, state, { props: newProps });
      break;
    default:
      return state;
      break;
  }
};
export default PropDrawer;
