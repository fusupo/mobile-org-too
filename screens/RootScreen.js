import React from 'react';
import { connect } from 'react-redux';
import { TouchableHighlight, View, StyleSheet } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import TabNav from '../navigation/RootNavigation.js';

import { addNewNode } from '../actions';
import { doCloudUpload } from '../main';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const RootScreen = ({ navigation, onNewNodePress, onCloudUploadPress }) => {
  return (
    <View style={styles.container}>
      <TabNav screenProps={{ navigation: navigation }} />
      <TouchableHighlight
        underlayColor="#00ff00"
        onPress={() => onNewNodePress()}>
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
      <TouchableHighlight
        underlayColor="#00ff00"
        onPress={() => onCloudUploadPress()}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#ee6e73',
            position: 'absolute',
            bottom: 60,
            right: 80
          }}>
          <Ionicons
            name={'ios-cloud-upload-outline'}
            size={50}
            style={{
              color: '#00ffaa',
              position: 'relative',
              top: 10,
              left: 7,
              width: 45,
              height: 40
            }}
          />
        </View>
      </TouchableHighlight>
    </View>
  );
};

const mapStateToProps = state => ({
  nodes: state.orgNodes,
  tree: state.orgTree
});

const mapDispatchToProps = dispatch => {
  return {
    onNewNodePress: () => {
      dispatch(addNewNode());
    },
    onCloudUploadPress: () => {
      dispatch(doCloudUpload());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);
