import React from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { View, ScrollView, Text } from 'react-native';

import OrgBuffer from '../components/OrgBuffer';
import DropboxDataSource from '../utilities/DropboxDataSource';

class HomeScreen extends React.Component {
  render() {
    let ui;
    if (Object.entries(this.props.buffers).length === 0) {
      if (this.props.settings.inboxFile.isOk === true) {
        console.log('load the inboxfile');
        this.props.loadInboxFile();
      } else {
        this.props.initApp();
      }
      ui = (
        <ScrollView>
          <OrgBuffer />
        </ScrollView>
      );
    } else {
      console.log('show the ui');
      const list = Object.entries(this.props.buffers).map(e => (
        <View key={e[0]}>
          <OrgBuffer bufferID={e[0]} />
        </View>
      ));
      ui = (
        <ScrollView>
          {list}
        </ScrollView>
      );
    }
    // if (this.state.viewIsReady) {
    // orgTree={this.state.orgTree}
    // navigation={this.props.screenProps.navigation}

    //
    return ui;
    // } else {
    //   return <View />;
    // }
  }
}

const mapStateToProps = state => ({
  // nodes: state.orgNodes,
  // tree: state.orgTree,
  buffers: state.orgBuffers,
  settings: state.settings
});

const mapDispatchToProps = dispatch => {
  return {
    initApp: () => {
      // dispatch(someAction());
      dispatch(
        NavigationActions.navigate({
          routeName: 'SettingsTab'
        })
      );
    },
    loadInboxFile: () => {
      dispatch(loadInboxFile());
    }
  };
};

function someAction() {
  return (dispatch, getState) => {
    const state = getState(); // get state from store here,
    if (
      state.settings.inboxFile &&
      state.settings.inboxFile.isOK === false
      //   ||
      // state.settings.orgFiles.length === 0
    ) {
      dispatch(
        NavigationActions.navigate({
          routeName: 'SettingsTab'
        })
      );
    }
  };
}

///// duplicated in settingscreen.js
function loadInboxFile() {
  return async (dispatch, getState) => {
    console.log('LOAD INBOX FILE');
    const foo = await loadParseOrgFilesAsync(
      getState().settings.inboxFile.path
    );
    dispatch({
      type: 'addOrgBuffer',
      path: getState().settings.inboxFile.path,
      data: foo
    });
  };
}

async function loadParseOrgFilesAsync(filePath) {
  const ds = new DropboxDataSource();
  try {
    console.log(filePath);
    let foo = await ds.loadParseOrgFilesAsync(filePath);
    console.log('loadparse success:');
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
