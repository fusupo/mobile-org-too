import Expo from 'expo';
import React from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Button, ScrollView, Text, TextInput, View } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import { registerDbxAccessToken, addNewNode } from '../actions';

import OrgBuffer from '../components/OrgBuffer';
import OrgHeadline from '../components/OrgHeadline.js';
import DropboxDataSource from '../utilities/DropboxDataSource';
import R from 'ramda';
let count = 0;

class HomeScreen extends React.Component {
  state = {
    buffersLoaded: false,
    inboxFileIsOk: false,
    searchStr: null
  };

  componentWillMount() {
    this.props.loadInboxFile();
  }

  render() {
    const { buffers, onAddOne } = this.props;
    const search = () => {
      const results = R.map(
        n => (
          <OrgHeadline
            key={n.nodeID}
            bufferID={n.bufferID}
            nodeID={n.nodeID}
            levelOffset={n.level}
          />
        ),
        R.filter(
          //n => n.content.search(this.state.searchStr) > -1,
          n =>
            n.content.toLowerCase().search(this.state.searchStr.toLowerCase()) >
            -1,
          R.reduce(
            (m, b) =>
              R.concat(
                R.reduce(
                  (m2, n) =>
                    R.insert(
                      m2.length,
                      {
                        bufferID: b[0],
                        nodeID: n[1].id,
                        content: n[1].headline.content,
                        level: n[1].headline.level
                      },
                      m2
                    ),
                  [],
                  Object.entries(b[1].orgNodes)
                ),
                m
              ),
            [],
            Object.entries(buffers)
          )
        )
      );

      return results;
    };

    if (Object.entries(buffers).length > 0) {
      const listAll = Object.entries(buffers).map(e => (
        <View key={e[0]}>
          <OrgBuffer bufferID={e[0]} />
          <Button
            title={'add One'}
            onPress={() => {
              onAddOne(e[0]);
            }}
          />
        </View>
      ));
      const searchResults = this.state.searchStr ? search() : null;
      const display = this.state.searchStr ? searchResults : listAll;
      return (
        <View>
          <View style={{ flexDirection: 'row' }}>
            <FontAwesome style={{ flex: 1 }} name={'search'} size={25} />
            <TextInput
              style={{
                flex: 10,
                borderColor: '#000',
                borderWidth: 1,
                borderRadius: 5
              }}
              value={this.state.searchStr}
              onChangeText={searchStr => this.setState({ searchStr })}
            />
          </View>
          <ScrollView>
            {display}
          </ScrollView>
        </View>
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
