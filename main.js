import Expo from 'expo';
import React from 'react';
import { StyleSheet } from 'react-native';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import DropboxDataSource from './utilities/DropboxDataSource.js';
import mobileOrgTooApp from './reducers';

import StacksOverTabs from './navigation/StacksOverTabs';

let store;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)'
  }
});

class AppContainer extends React.Component {
  state = {
    appIsReady: false
  };

  componentWillMount() {
    this._loadEverything();
  }

  async _loadEverything() {
    try {
      await this._loadAssetsAsync();
      await this._loadParseOrgFilesAsync();
    } catch (e) {
      console.warn('error in "load everything"', e);
    } finally {
      console.log('completed loading everything');
      this.setState({ appIsReady: true });
    }
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: [require('./assets/images/expo-wordmark.png')],
        fonts: [
          //FontAwesome.font,
          { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') }
        ]
      });
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
    } finally {
    }
  }

  async _loadParseOrgFilesAsync() {
    const ds = new DropboxDataSource();
    try {
      let foo = await ds.loadParseOrgFilesAsync();
      store = createStore(mobileOrgTooApp, foo, applyMiddleware(thunk));
    } catch (e) {
      console.warn(
        'There was an error retrieving files from drobbox on the home screen'
      );
      console.log(e);
      throw e;
    } finally {
    }
  }

  render() {
    if (this.state.appIsReady) {
      return (
        <Provider store={store}>
          <StacksOverTabs />
        </Provider>
      );
    } else {
      return <Expo.AppLoading />;
    }
  }
}

Expo.registerRootComponent(AppContainer);

// super duper hacky to at least get dropbox upload wired up
export function doCloudUpload() {
  return dispatch => {
    const ds = new DropboxDataSource();
    const state = store.getState();
    try {
      let foo = ds.serialize(state.orgNodes, state.orgTree);
      console.log(foo);
    } catch (e) {
      console.warn(
        'There was an error serializing and/or uploading files to drobbox on the home screen'
      );
      console.log(e);
      throw e;
    } finally {
    }
  };
}
