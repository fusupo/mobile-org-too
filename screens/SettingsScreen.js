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

import { doCloudUpload } from '../main';
import DropboxDataSource from '../utilities/DropboxDataSource';

import Tree from '../components/Tree';

import Ionicons from 'react-native-vector-icons/Ionicons';

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
      <View style={{ padding: 10, flexDirection: 'row' }}>
        <TextInput
          style={{
            padding: 5,
            height: 40,
            borderColor,
            borderWidth: 4,
            flex: 1
          }}
          onChangeText={text => this.setState({ text })}
          onEndEditing={() => this.props.onEndEditing(this.state.text)}
          value={this.state.text}
        />
        <Button
          onPress={() => {
            console.log('foo');
          }}
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
    return (
      <View style={{ padding: 10, flexDirection: 'row' }}>
        <Text>{'foo'}</Text>
      </View>
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
    const { dbxds } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Text>{'inbox'}</Text>
        <FileNameInput
          file={this.props.inboxFile}
          isOk={
            this.props.inboxFile === null || this.props.inboxFile === undefined
              ? null
              : this.props.inboxFile.isOk
          }
          onEndEditing={this.props.tryUpdateInboxFile}
        />
        <FileNameInputList files={this.props.orgFiles} />
        <Button
          title={'sync w/ dropbox'}
          onPress={() => {
            this.setState({ showSpinner: true });
            this.props.onSync(
              () => {
                setTimeout(() => this.setState({ showSpinner: false }), 1000);
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
        {this.state.showError
          ? <Text style={{ color: '#f00' }}>{this.state.error}</Text>
          : null}
        <ScrollView style={{ margin: 20, borderColor: '#000', borderWidth: 1 }}>
          <Tree
            title={'foobarbaz'}
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
              return <View><Text>{title}</Text></View>;
            }}
            renderBranchItem={(title, path, type, hasKids, isCollapsed) => {
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
                <View><Text style={textStyle}>{pref + ' ' + title}</Text></View>
              );
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const dbxds = new DropboxDataSource({
    accessToken: state.dbxAccessToken
  });
  return {
    inboxFile: state.settings.inboxFile,
    orgFiles: state.settings.orgFiles,
    dbxds
  };
};

const mapDispatchToProps = dispatch => {
  return {
    tryUpdateInboxFile: path => {
      dispatch(someActionToo(path));
    },
    onSync: (onSucc, onErr) => {
      dispatch(doCloudUpload(onSucc, onErr));
    }
  };
};

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
      dispatch(someActionThree());
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

function someActionThree() {
  return async (dispatch, getState) => {
    try {
      await AsyncStorage.setItem(
        '@mobile-org-too:settings',
        JSON.stringify(getState().settings)
      );
      //dispatch(loadInboxFile());
    } catch (error) {
      console.log('err saving data:', error);
      // Error saving data
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
