import Expo from 'expo';
import React from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Button, View, ScrollView } from 'react-native';

import { registerDbxAccessToken, addNewNode } from '../actions';

import OrgBuffer from '../components/OrgBuffer';
import DropboxDataSource from '../utilities/DropboxDataSource';

let count = 0;

class HomeScreen extends React.Component {
  state = {
    buffersLoaded: false,
    inboxFileIsOk: false
  };

  static navigationOptions = () => ({
    title: 'someshit'
  });

  componentWillMount() {
    this.props.loadInboxFile();
  }

  componentDidMount() {
    // this.props.initApp();
  }

  render() {
    let ui = null;
    if (Object.entries(this.props.buffers).length > 0) {
      const list = Object.entries(this.props.buffers).map(e => (
        <View key={e[0]}>
          <OrgBuffer bufferID={e[0]} />
          <Button
            title={'add One'}
            onPress={() => {
              this.props.onAddOne(e[0]);
            }}
          />
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
      dispatch(registerDbxAccessToken(token));
    },
    onAddOne: bufferID => {
      dispatch(addNewNode(bufferID));
    }
  };
};

function loadInboxFile() {
  return async (dispatch, getState) => {
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
    let foo = await ds.loadParseOrgFilesAsync(filePath);
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
