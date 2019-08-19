import * as Expo from 'expo';
import React from 'react';
import {
  TouchableHighlight,
  Text,
  View,
  WebView,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import DropboxDataSource from './utilities/DropboxDataSource.js';
import mobileOrgTooApp from './reducers/main';

import StacksOverTabs from './navigation/StacksOverTabs';
import DrawerPanelScreen from './screens/DrawerPanelScreen';

import { registerDbxAccessToken } from './actions';

let store, settings;

import DrawerLayout from 'react-native-drawer-layout';

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

const Dropbox = require('dropbox').Dropbox;
const parseQueryString = str => {
  var ret = Object.create(null);

  if (typeof str !== 'string') {
    return ret;
  }

  str = str.trim().replace(/^(\?|#|&)/, '');

  if (!str) {
    return ret;
  }

  str.split('&').forEach(function(param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    // Firefox (pre 40) decodes `%3D` to `=`
    // https://github.com/sindresorhus/query-string/pull/37
    var key = parts.shift();
    var val = parts.length > 0 ? parts.join('=') : undefined;

    key = decodeURIComponent(key);

    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    val = val === undefined ? null : decodeURIComponent(val);

    if (ret[key] === undefined) {
      ret[key] = val;
    } else if (Array.isArray(ret[key])) {
      ret[key].push(val);
    } else {
      ret[key] = [ret[key], val];
    }
  });

  return ret;
};

const CLIENT_ID = 'yf56u5iln5btig2';
const dbx = new Dropbox({ clientId: CLIENT_ID });
const authUrl = dbx.getAuthenticationUrl('https://google.com');
let count = 0;
let unsub;

class AppContainer extends React.Component {
  state = {
    appIsReady: false,
    userIsLoggedIn: false
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
    } catch (e) {
      console.warn('error in "load everything"', e);
    } finally {
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

  async _loadSettingsAsync() {
    try {
      const value = await AsyncStorage.getItem('@mobile-org-too:settings');
      if (value !== null) {
        settings = JSON.parse(value);
      } else {
        console.log('no value');
        settings = undefined;
      }
    } catch (error) {
      // Error retrieving data
      console.warn('error loading settings from AsyncStorage');
    }
  }

  render() {
    if (this.state.appIsReady) {
      const state = store.getState();
      if (!this.state.userIsLoggedIn) {
        count++;
        /// AUTH
        return (
          <WebView
            source={{ uri: authUrl }}
            style={{ marginTop: 20 }}
            onNavigationStateChange={(e => {
              const url = e.url;
              const idx = url.indexOf('access_token');
              if (idx > 0) {
                const token = parseQueryString(url.substr(idx)).access_token;
                unsub = store.subscribe(() => {
                  const st = store.getState();
                  if (st.dbxAccessToken !== null) {
                    unsub();
                    this.setState({ userIsLoggedIn: true });
                  }
                });
                store.dispatch(registerDbxAccessToken(token));
              }
            }).bind(this)}
          />
        );
        //// END AUTH
      } else if (this.state.userIsLoggedIn) {
        return (
          <Provider store={store}>
            <DrawerLayout
              drawerBackgroundColor="red"
              drawerWidth={300}
              keyboardDismissMode="on-drag"
              statusBarBackgroundColor="blue"
              renderNavigationView={() => <DrawerPanelScreen />}>
              <StacksOverTabs />
            </DrawerLayout>
          </Provider>
        );
      }
    } else {
      return <Expo.AppLoading />;
    }
  }
}

Expo.registerRootComponent(AppContainer);

//
export function doCloudUpload(onSucc, onErr) {
  return dispatch => {
    const state = store.getState();
    const { orgBuffers, data, settings } = state;
    const { ledger } = data;
    const ledgerFilePath = settings.ledgerFile.path;
    const ds = new DropboxDataSource({ accessToken: state.dbxAccessToken });
    let idx = 0;

    const saveNext = (path, succ, err) => {
      try {
        const orgTree = orgBuffers[path].orgTree;
        const orgSettings = orgBuffers[path].orgSettings;
        let foo = ds
          .serializeAndUpload(orgTree, orgSettings, path)
          .then(succ());
      } catch (e) {
        console.warn(
          'There was an error serializing and/or uploading files to drobbox on the home screen'
        );
        err(e);
        console.log(e);
        throw e;
      }
    };

    let error = null;
    let completeCount = 0;
    Object.keys(orgBuffers).forEach(path => {
      saveNext(
        path,
        () => {
          completeCount++;
          if (completeCount === Object.keys(orgBuffers).length) {
            try {
              ds.serializeAndUploadLedger(ledger.ledgerNodes, ledgerFilePath);
            } catch (e) {
              console.warn(
                'There was an error serializing and/or uploading ledger file to drobbox on the home screen'
              );
              onErr(error);
            } finally {
              error ? onErr(error) : onSucc();
            }
          }
        },
        e => {
          completeCount++;
          console.log(e);
          error = e;
        }
      );
    });
  };
}
