import { combineReducers } from 'redux';

import orgBuffers from './OrgBuffers';
import nav from './Nav';
import settings from './Settings';
import dbxAccessToken from './DBXAccessToken';
import data from './Data';

const mobileOrgTooApp = combineReducers({
  orgBuffers,
  nav,
  settings,
  dbxAccessToken,
  data
});

export default mobileOrgTooApp;
