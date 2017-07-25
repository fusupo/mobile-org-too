import React from 'react';
import { TouchableHighlight, View, StyleSheet } from 'react-native';
import { ExpoConfigView } from '@expo/samples';

import Colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

import TabNav from '../navigation/RootNavigation.js';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default class TestScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TabNav screenProps={{ navigation: this.props.navigation }} />
        <TouchableHighlight
          underlayColor="#00ff00"
          onPress={() => {
            this.props.navigation.navigate('NewNode', {
              tree: {}
            });
          }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#ee6e73',
              position: 'absolute',
              bottom: 60,
              right: 10
            }}>
            <Ionicons
              name={'ios-add'}
              size={50}
              style={{
                color: '#00ffaa',
                position: 'relative',
                top: 5,
                left: 17,
                width: 25,
                height: 50
              }}
            />
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}
