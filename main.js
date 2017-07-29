import Expo from 'expo';
import React from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import DropboxDataSource from './utilities/DropboxDataSource.js';
import mobileOrgTooApp from './reducers';

import StacksOverTabs from './navigation/StacksOverTabs';

let store, settings;

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
      await this._loadSettingsAsync();
      store = createStore(
        mobileOrgTooApp,
        { settings },
        applyMiddleware(thunk)
      );
      await this._loadAssetsAsync();
      //await this._loadParseOrgFilesAsync();
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
      foo.settings = settings;
      store = createStore(mobileOrgTooApp, foo, applyMiddleware(thunk));
    } catch (e) {
      console.warn(
        'There was an error retrieving files from drobbox on the home screen '
      );
      console.log(e);
      throw e;
    } finally {
    }
  }

  async _loadSettingsAsync() {
    // try {
    //   console.log('set item');
    //   await AsyncStorage.setItem('@mobile-org-too:test', 'I like to save it.');
    // } catch (error) {
    //   console.warn('foobarbaz');
    //   // Error saving data
    // }

    try {
      const value = await AsyncStorage.getItem('@mobile-org-too:settings');
      if (value !== null) {
        // We have data!!
        console.log(value);
        settings = value;
      } else {
        console.log('no value');
        settings = undefined;
      }
    } catch (error) {
      // Error retrieving data
      console.warn('error loading settings from AsyncStorage');
    }

    // try {
    //   console.log('remove');
    //   const value = await AsyncStorage.removeItem('@mobile-org-too:test');
    //   console.log('removed?');
    // } catch (error) {
    //   // Error retrieving data
    //   console.warn('error removing settings from AsyncStorage');
    // }
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
// function is her because reference to store is here
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
