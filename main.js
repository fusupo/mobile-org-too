import Expo from 'expo';
import React from 'react';
import { StyleSheet, View, ScrollView, Button, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';

import NewNodeScreen from './screens/NewNodeScreen';
import NodeDetailScreen from './screens/NodeDetailScreen';
import MainScreen from './screens/MainScreen';

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
    this._loadAssetsAsync();
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
      this.setState({ appIsReady: true });
    }
  }

  render() {
    if (this.state.appIsReady) {
      const StacksOverTabs = StackNavigator({
        Root: {
          screen: MainScreen
        },
        NodeDetail: {
          screen: NodeDetailScreen
        },
        NewNode: {
          screen: NewNodeScreen
        }
      });

      return <StacksOverTabs />;
    } else {
      return <Expo.AppLoading />;
    }
  }
}

Expo.registerRootComponent(AppContainer);
