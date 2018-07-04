import { UPDATE_NODE_PARAGRAPH } from '../actions';

const Paragraph = (state = '', action) => {
  let nextState;
  switch (action.type) {
    case UPDATE_NODE_PARAGRAPH:
      nextState = { type: 'org.paragraph', value: action.text.split('\n') };
      return nextState;
      break;
  }
  return nextState || state;
};
export default Paragraph;
