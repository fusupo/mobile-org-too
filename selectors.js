import { createSelector } from 'reselect';
import R from 'ramda';

const getBuffers = state => state.orgBuffers;
const getNav = state => state.nav;
const getSettings = state => state.settings;

export const getAllNodes = createSelector([getBuffers], buffers => {
  return R.reduce(
    (m, bufferObj) =>
      R.concat(
        R.reduce(
          (m2, nodeObj) => R.insert(m2.length, nodeObj, m2),
          [],
          Object.values(bufferObj[1].orgNodes)
        ),
        m
      ),
    [],
    Object.entries(buffers)
  );
});

export const getCurrentRouteName = navigationState => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
};
