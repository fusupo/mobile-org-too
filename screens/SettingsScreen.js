import React from 'react';
import { connect } from 'react-redux';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import CheckBox from 'react-native-check-box';

import { doCloudUpload } from '../main';
import DropboxDataSource from '../utilities/DropboxDataSource';

import Tree from '../components/Tree';

import Ionicons from 'react-native-vector-icons/Ionicons';
import R from 'ramda';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class FileNameInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: 'Useless Placeholder'
    };
  }
  componentDidMount() {
    if (this.props.file === undefined) {
    } else {
      this.setState({ text: this.props.file.path });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.file && nextProps.file.path) {
      this.setState({ text: nextProps.file.path });
    }
  }
  render() {
    let borderColor;
    switch (this.props.isOk) {
      case null:
        borderColor = 'grey';
        break;
      case true:
        borderColor = 'green';
        break;
      case false:
        borderColor = 'red';
        break;
    }
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TextInput
          style={{
            borderColor,
            borderWidth: 4,
            flex: 1
          }}
          onChangeText={text => this.setState({ text })}
          onEndEditing={() => this.props.onEndEditing(this.state.text)}
          value={this.state.text}
        />
        <Button
          onPress={this.props.onClearFilePress}
          title="X"
          color="#841584"
          style={{ flex: 1 }}
        />
      </View>
    );
  }
}

class FileNameInputList extends React.Component {
  render() {
    const { dbxds, orgFiles, onNodeCheckPress } = this.props;
    return (
      <ScrollView style={{ borderColor: '#000', borderWidth: 1 }}>
        <Tree
          title={'home'}
          path={''}
          type={'branch'}
          getHasKids={(path, cbk) => {
            dbxds.filesListFolderAsync(path).then(res => {
              cbk(res.entries.length > 0);
            });
          }}
          getItems={(path, cbk) => {
            dbxds.filesListFolderAsync(path).then(res => {
              cbk(
                res.entries.map(r => {
                  return {
                    title: r.name,
                    path: r.path_lower,
                    type: r['.tag'] === 'folder' ? 'branch' : 'leaf'
                  };
                })
              );
            });
          }}
          renderLeafItem={(title, path, type, hasKids) => {
            const isChecked = R.contains(path, orgFiles);
            const selectable = path.endsWith('.org');
            return (
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 10 * path.split('/').length
                }}>
                <CheckBox
                  isChecked={isChecked}
                  style={selectable ? {} : { opacity: 0.25 }}
                  onClick={() => {
                    if (selectable) onNodeCheckPress(path, orgFiles, dbxds);
                  }}
                /><Text style={{ flex: 1 }}>{title}</Text>
              </View>
            );
          }}
          renderBranchItem={(
            title,
            path,
            type,
            hasKids,
            isCollapsed,
            onToggleCollapse
          ) => {
            let pref;
            let textStyle = { fontWeight: 'bold' };
            if (hasKids) {
              if (isCollapsed) {
                pref = '⤷';
              } else {
                pref = '↓';
              }
            } else {
              pref = '⇢';
            }
            return (
              <TouchableHighlight
                style={{ marginLeft: 10 * path.split('/').length }}
                onPress={onToggleCollapse}>
                <Text style={textStyle}>{pref + ' ' + title}</Text>
              </TouchableHighlight>
            );
          }}
        />
      </ScrollView>
    );
  }
}

class SettingsScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'settings'
  });

  constructor(props) {
    super(props);
    this.state = {
      showSpinner: false,
      showError: false,
      error: 'some error text here'
    };
  }

  render() {
    if (this.props.screenProps.currRoute !== 'SettingsTab') return null;

    const {
      dbxds,
      inboxFile,
      ledgerFile,
      orgFiles,
      onNodeCheckPress,
      onClearInboxPress,
      onClearLedgerPress,
      tryUpdateInboxFile,
      tryUpdateLedgerFile
    } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, margin: 10 }}>
          <Text style={{ margin: 5 }}>{'inbox file'}</Text>
          <FileNameInput
            file={inboxFile}
            onClearFilePress={() => onClearInboxPress(inboxFile.path)}
            isOk={
              inboxFile === null || inboxFile === undefined
                ? null
                : inboxFile.isOk
            }
            onEndEditing={tryUpdateInboxFile}
          />
        </View>
        <View style={{ flex: 6, margin: 10 }}>
          <Text style={{ margin: 5 }}>{'org files'}</Text>
          <FileNameInputList
            dbxds={dbxds}
            orgFiles={orgFiles}
            onNodeCheckPress={onNodeCheckPress}
            files={this.props.orgFiles}
          />
        </View>
        <View style={{ flex: 1, margin: 10 }}>
          <Text style={{ margin: 5 }}>{'ledger file'}</Text>
          <FileNameInput
            file={ledgerFile}
            onClearFilePress={() => onClearLedgerPress()}
            isOk={
              ledgerFile === null || ledgerFile === undefined
                ? null
                : ledgerFile.isOk
            }
            onEndEditing={tryUpdateLedgerFile}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Button
              title={'sync w/ dropbox'}
              onPress={() => {
                this.setState({ showSpinner: true });
                this.props.onSync(
                  () => {
                    setTimeout(
                      () => this.setState({ showSpinner: false }),
                      1000
                    );
                  },
                  e => {
                    this.setState({
                      showSpinner: false,
                      showError: true,
                      error: e
                    });
                  }
                );
              }}
            />
            {this.state.showSpinner ? <View><ActivityIndicator /></View> : null}
          </View>
          {this.state.showError
            ? <Text style={{ color: '#f00' }}>{this.state.error}</Text>
            : null}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  if (ownProps.screenProps.currRoute !== 'SettingsTab') return {};
  const dbxds = new DropboxDataSource({
    accessToken: state.dbxAccessToken
  });
  return {
    inboxFile: state.settings.inboxFile,
    ledgerFile: state.settings.ledgerFile,
    orgFiles: state.settings.orgFiles,
    dbxds
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    tryUpdateInboxFile: path => {
      dispatch(someActionToo(path));
    },
    tryUpdateLedgerFile: path => {
      dispatch(someActionThree(path));
    },
    onSync: (onSucc, onErr) => {
      dispatch(doCloudUpload(onSucc, onErr));
    },
    onClearInboxPress: () => {
      dispatch(clearInboxFile());
    },
    onClearLedgerPress: () => {
      dispatch(clearLedgerFile());
    },
    onNodeCheckPress: (path, orgFiles, dbxds) => {
      dispatch({ type: 'settings:toggleOrgFile', path });
      if (R.contains(path, orgFiles)) {
        dispatch(removeBuffer(path));
      } else {
        dispatch(loadFile(path, dbxds));
      }
    }
  };
};

function clearInboxFile() {
  return (dispatch, getState) => {
    const path = getState().settings.inboxFile.path;
    dispatch({
      type: 'settings:inboxFile:clear'
    });
    dispatch(removeBuffer(path));
    dispatch(saveSettingsToStorage());
  };
}

function clearLedgerFile() {
  return (dispatch, getState) => {
    const ledgerFile = getState().settings.ledgerFile;
    const path = ledgerFile && ledgerFile.path ? ledgerFile.path : 'none';
    if (path !== 'none') {
      dispatch({
        type: 'settings:ledgerFile:clear'
      });
      dispatch(removeLedger(path));
      dispatch(saveSettingsToStorage());
    }
  };
}

function removeBuffer(path) {
  return (dispatch, getState) => {
    dispatch({
      type: 'removeOrgBuffer',
      path
    });
    dispatch(saveSettingsToStorage());
  };
}

function removeLedger(path) {
  return (dispatch, getState) => {
    dispatch({
      type: 'removeLedger',
      path
    });
    dispatch(saveSettingsToStorage());
  };
}
// REFER HOME SCREEN FOR VERY SIMILAR CODE !!!
function loadFile(path, dbxds) {
  return async (dispatch, getState) => {
    const foo = await loadParseOrgFilesAsync(path, dbxds);
    dispatch({
      type: 'addOrgBuffer',
      path: path,
      data: foo
    });
    dispatch(saveSettingsToStorage());
  };
}

async function loadParseOrgFilesAsync(filePath, dbxds) {
  try {
    let foo = await dbxds.loadParseOrgFilesAsync(filePath);
    return foo;
  } catch (e) {
    console.warn(
      'There was an error retrieving files from drobbox on the home screen '
    );
    console.log(e);
    return null;
    throw e;
  }
}

function saveSettingsToStorage() {
  return async (dispatch, getState) => {
    try {
      await AsyncStorage.setItem(
        '@mobile-org-too:settings',
        JSON.stringify(getState().settings)
      );
    } catch (error) {
      console.log('err saving data:', error);
      // Error saving data
    }
  };
}

function someActionToo(path) {
  return (dispatch, getState) => {
    const ds = new DropboxDataSource({
      accessToken: getState().dbxAccessToken
    });
    const success = (path, res) => {
      dispatch({
        type: 'settings:inboxFile:ok',
        path: path,
        isFolder: res['.tag'] === 'folder'
      });
      dispatch(saveSettingsToStorage());
    };
    const err = path => {
      console.log('err');
      dispatch({
        type: 'settings:inboxFile:error',
        path: path,
        isFolder: false
      });
    };
    foo = ds
      .filesGetMetadataAsync(path)
      .then(res => {
        if (res['.tag'] === 'folder') {
          err(path);
        } else {
          success(path, res);
        }
      })
      .catch(e => err(path));
  };
}

function someActionThree(path) {
  return (dispatch, getState) => {
    const ds = new DropboxDataSource({
      accessToken: getState().dbxAccessToken
    });
    const success = (path, res) => {
      dispatch({
        type: 'settings:ledgerFile:ok',
        path: path,
        isFolder: res['.tag'] === 'folder'
      });
      dispatch(saveSettingsToStorage());
    };
    const err = path => {
      console.log('err');
      dispatch({
        type: 'settings:ledgerFile:error',
        path: path,
        isFolder: false
      });
    };
    foo = ds
      .filesGetMetadataAsync(path)
      .then(res => {
        if (res['.tag'] === 'folder') {
          err(path);
        } else {
          success(path, res);
        }
      })
      .catch(e => err(path));
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
