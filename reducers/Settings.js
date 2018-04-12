const settings = (
  state = {
    inboxFile: { path: 'insert filepath', isFolder: false, isOk: null },
    ledgerFile: { path: 'insert filepath', isFolder: false, isOk: null },
    orgFiles: []
  },
  action
) => {
  let nextState;
  switch (action.type) {
    case 'settings:inboxFile:ok':
      nextState = Object.assign({}, state, {
        inboxFile: { path: action.path, isFolder: action.isFolder, isOk: true }
      });
      break;
    case 'settings:inboxFile:error':
      nextState = Object.assign({}, state, {
        inboxFile: { path: action.path, isFolder: action.isFolder, isOk: false }
      });
      break;
    case 'settings:inboxFile:clear':
      nextState = Object.assign({}, state, {
        inboxFile: { path: 'insert filepath', isFolder: false, isOK: null }
      });
      break;
    case 'settings:ledgerFile:ok':
      nextState = Object.assign({}, state, {
        ledgerFile: { path: action.path, isFolder: action.isFolder, isOk: true }
      });
      break;
    case 'settings:ledgerFile:error':
      nextState = Object.assign({}, state, {
        ledgerFile: {
          path: action.path,
          isFolder: action.isFolder,
          isOk: false
        }
      });
      break;
    case 'settings:ledgerFile:clear':
      nextState = Object.assign({}, state, {
        ledgerFile: { path: 'insert filepath', isFolder: false, isOK: null }
      });
      break;
    case 'settings:toggleOrgFile':
      let nextOrgFiles;
      const { path } = action;
      const { orgFiles } = state;
      if (R.contains(path, orgFiles)) {
        nextOrgFiles = R.without(path, orgFiles);
      } else {
        nextOrgFiles = R.insert(orgFiles.length, path, orgFiles);
      }
      nextState = Object.assign({}, state, {
        orgFiles: nextOrgFiles
      });
      break;
  }

  const res = nextState || state;

  return res;
};

export default settings;
