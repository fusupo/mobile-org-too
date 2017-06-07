import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ExpoConfigView } from '@expo/samples';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default class NewNodeScreen extends React.Component {
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
