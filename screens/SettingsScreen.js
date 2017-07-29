import React from 'react';
import { connect } from 'react-redux';
import {
  TouchableHighlight,
  Switch,
  View,
  ScrollView,
  Text,
  StyleSheet
} from 'react-native';

import DropboxDataSource from '../utilities/DropboxDataSource';

import Ionicons from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class FileTree extends React.Component {
  render() {
    const fileName = this.props.tree === null ||
      this.props.allFiles === null ||
      Object.keys(this.props.allFiles).length === 0 ||
      this.props.tree.id === ''
      ? null
      : <View style={{ flexDirection: 'row', paddingLeft: 5 }}>
          <Switch disabled={false} value={false} tintColor={'#0f0f00'} />
          <TouchableHighlight
            onPress={() =>
              this.props.toggleDropboxFolderExpand(
                this.props.allFiles[this.props.tree.id].path_lower
              )}>
            <View style={{ paddingLeft: 5, flexDirection: 'row' }}>
              <Ionicons
                name={
                  this.props.allFiles[this.props.tree.id]['.tag'] === 'file'
                    ? 'ios-document'
                    : 'ios-folder'
                }
                size={15}
              />
              <Text style={{ paddingLeft: 5 }}>
                {this.props.allFiles[this.props.tree.id].name}
              </Text>
            </View>
          </TouchableHighlight>
        </View>;

    const list = this.props.tree === null ||
      Object.keys(this.props.tree.children).length === 0
      ? null
      : Object.values(this.props.tree.children).map((f, idx) => {
          const id = f.id;
          const node = this.props.allFiles[id];
          return (
            <FileTree
              key={f.id + idx}
              allFiles={this.props.allFiles}
              selectedFiles={this.props.selectedFiles}
              tree={f}
              toggleDropboxFolderExpand={this.props.toggleDropboxFolderExpand}
              depth={this.props.depth + 1}
            />
          );
        });

    return (
      <View style={{ flex: 1, paddingLeft: this.props.depth * 10 }}>
        {fileName}
        {list}
      </View>
    );
  }
}

class SettingsScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'exp.json'
    }
  };

  componentWillMount = () => {
    console.log(
      'mounting settings screen...need dropbox dir struct + list of files to track to crossreference with'
    );
  };

  componentDidMount = () => {
    if (this.props.allFiles === null) {
      this.props.initDropboxFileList();
    }
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <FileTree
          allFiles={this.props.allFiles}
          selectedFiles={this.props.selectedFiles}
          tree={this.props.tree}
          toggleDropboxFolderExpand={this.props.toggleDropboxFolderExpand}
          depth={this.props.depth}
        />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const allFiles = state.settings != null ? state.settings.all : null;
  const selectedFiles = state.settings != null ? state.settings.selected : null;
  const tree = state.settings != null ? state.settings.tree : null;
  return {
    allFiles,
    selectedFiles,
    tree,
    depth: 0
  };
};

const mapDispatchToProps = dispatch => {
  return {
    initDropboxFileList: () => {
      dispatch(someAction(''));
    },
    toggleDropboxFolderExpand: path => {
      dispatch(someAction(path));
    }
  };
};

function someAction(path) {
  return (dispatch, getState) => {
    const state = getState(); // get state from store here,
    const ds = new DropboxDataSource();
    foo = ds
      .filesListFolderAsync(path)
      .then(res => dispatch({ type: 'got dropbox entries', data: res.entries }))
      .catch(e => console.log(e));

    //console.log(navigator);
    // dispatch(otherAction()).then(.....); //dispatch actions here
    // dispatch(
    //   NavigationActions.navigate({
    //     routeName: 'SettingsTab'
    //     // params: { nodeID: action.nodeID }
    //   })
    // );
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
