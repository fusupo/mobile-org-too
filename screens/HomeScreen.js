import Expo from 'expo';
import React from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { WebView, View, ScrollView } from 'react-native';

import { registerDbxAccessToken } from '../actions';

import OrgBuffer from '../components/OrgBuffer';
import DropboxDataSource from '../utilities/DropboxDataSource';

let count = 0;

class HomeScreen extends React.Component {
  state = {
    buffersLoaded: false,
    inboxFileIsOk: false
  };

  componentWillMount() {
    this.props.loadInboxFile();
  }

  componentDidMount() {
    // this.props.initApp();
  }

  render() {
    let ui = null;

    console.log(this.state);
    console.log(
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1'
    );

    if (Object.entries(this.props.buffers).length > 0) {
      console.log('show the ui');
      const list = Object.entries(this.props.buffers).map(e => (
        <View key={e[0]}>
          <OrgBuffer bufferID={e[0]} />
        </View>
      ));
      return (
        <ScrollView>
          {list}
        </ScrollView>
      );
    } else {
      return <Expo.AppLoading />;
    }
  }
}

const mapStateToProps = state => ({
  buffers: state.orgBuffers,
  settings: state.settings
});

const mapDispatchToProps = dispatch => {
  return {
    initApp: () => {
      dispatch(
        NavigationActions.navigate({
          routeName: 'SettingsTab'
        })
      );
    },
    loadInboxFile: () => {
      dispatch(loadInboxFile());
    },
    onReceiveDbxAccessToken: token => {
      console.log('onReceiveDbxAccessToken', token);
      dispatch(registerDbxAccessToken(token));
    }
  };
};

///// duplicated in settingscreen.js
function loadInboxFile() {
  return async (dispatch, getState) => {
    console.log('LOAD INBOX FILE');
    const foo = await loadParseOrgFilesAsync(
      getState().settings.inboxFile.path,
      getState().dbxAccessToken
    );
    dispatch({
      type: 'addOrgBuffer',
      path: getState().settings.inboxFile.path,
      data: foo
    });
  };
}

async function loadParseOrgFilesAsync(filePath, token) {
  const ds = new DropboxDataSource({ accessToken: token });
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
