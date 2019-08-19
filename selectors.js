import { createSelector } from 'reselect';

import OrgDocUtil from './utilities/OrgDocUtil';
import OrgNodeUtil from './utilities/OrgNodeUtil';

import R from 'ramda';

const orgParse = require('org-parse');
const parse = orgParse.parse;

export const defaultSettings = parse(`
* Org Files
:PROPERTIES:
:inbox:    /org/inbox.org
:files:    undefined
:END:
* Todo Keywords
:PROPERTIES:
:none:     #fff
:PROJ:     #f00
:TODO:     #ff56a3
:END:
`);


const getBuffers = state => state.orgBuffers;
const getNav = state => state.nav;
//const getSettings = state => state.settings;

export const getFlattenedBufferObj = state => {
  // given org.document tree, returns flattened object where keys are node ids
  // and values are org-node objects
  let obj = {};
  const kids = state.headlines || state.children;

  if (state.type !== 'org.document') obj[state.id] = state;

  if (kids) {
    obj = kids.reduce(
      (m, v) => Object.assign({}, m, getFlattenedBufferObj(v)),
      obj
    );
  }

  return obj;
};

export const getNode = (state, bufferID, nodeID) =>
  getFlattenedBufferObj(state.orgBuffers[bufferID].orgTree)[nodeID];

export const getAllNodes = createSelector([getBuffers], buffers => {
  return R.reduce(
    (m, bufferObj) =>
      R.concat(
        R.reduce(
          (m2, nodeObj) => R.insert(m2.length, nodeObj, m2),
          [],
          Object.values(getFlattenedBufferObj(bufferObj[1].orgTree))
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

export const getAllTags = createSelector([getBuffers], buffers =>
  R.uniq(
    Object.values(buffers).reduce(
      (m, v) =>
        m.concat(
          Object.values(getFlattenedBufferObj(v.orgTree)).reduce(
            (m2, v2) => m2.concat(v2.tags || []),
            []
          )
        ),
      []
    )
  )
);

export const getSettings = state => {
  const bufferEntry = Object.entries(state.orgBuffers).find(([k, v]) => {
    return k.endsWith('settings.org');
  });
  if(!bufferEntry)return defaultSettings;
  const settings = bufferEntry[1].orgTree;
  return settings;
};

export const getTodoKeywordSettings = state => {
  const settings = getSettings(state);
  if(!settings)return {};
  const todoKeywords = OrgDocUtil.findHeadlineWithTitle(
    settings,
    'Todo Keywords'
  );
  const todoKeywordsProps = OrgNodeUtil.getPropDrawer(todoKeywords);
  return todoKeywordsProps.props;
};
