import {
  COMPLETE_HABIT,
  INSERT_NEW_NODE_LOG_NOTE,
  UPDATE_NODE_LOG_NOTE,
  REMOVE_NODE_LOG_NOTE
} from '../actions';

const Logbook = (state = null, action) => {
  const getClonedItems = () => {
    return state && state.items ? state.items.slice(0) : [];
  };
  switch (action.type) {
    case COMPLETE_HABIT:
      // i think I may need to deep copy this stuff
      var clonedItems = getClonedItems();
      clonedItems.unshift({
        type: 'state',
        state: '"DONE"',
        from: '"TODO"',
        timestamp: OrgTimestampUtil.parse(action.timestampStr),
        text: action.noteText || ''
      });
      return Object.assign({}, state, { items: clonedItems });
      break;
    case INSERT_NEW_NODE_LOG_NOTE:
      var clonedItems = getClonedItems();
      clonedItems.unshift({
        type: 'note',
        timestamp: OrgTimestampUtil.parse(action.timestampStr),
        text: 'foo'
      });
      return Object.assign({}, state, { items: clonedItems });
      break;
    case UPDATE_NODE_LOG_NOTE:
      var clonedItems = getClonedItems();
      let updatedItem = Object.assign({}, state.items[action.idx], {
        text: action.text
      });
      clonedItems.splice(action.idx, 1, updatedItem);
      return Object.assign({}, state, { items: clonedItems });
      break;
    case REMOVE_NODE_LOG_NOTE:
      var clonedItems = getClonedItems();
      clonedItems.splice(action.idx, 1);
      return Object.assign({}, state, { items: clonedItems });
      break;
    default:
      return state;
      break;
  }
};
export default Logbook;
