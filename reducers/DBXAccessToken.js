import { REGISTER_DBX_ACCESS_TOKEN } from '../actions';

const dbxAccessToken = (state = null, action) => {
  switch (action.type) {
    case REGISTER_DBX_ACCESS_TOKEN:
      return action.token;
      break;
    default:
      return state;
      break;
  }
};

export default dbxAccessToken;
