import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ExpoConfigView } from '@expo/samples';

export default class SettingsScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'exp.json'
    }
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <ExpoConfigView />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
