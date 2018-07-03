import React from 'react';
import { connect } from 'react-redux';

import {
  ActivityIndicator,
  Button,
  ScrollView,
  Component,
  StyleSheet,
  View,
  Text,
  PanResponder,
  Animated,
  Dimensions
} from 'react-native';

import OrgHabits from '../components/OrgHabits';
import OrgAgenda from '../components/OrgAgenda';
import SplitPane from '../components/SplitPane';

const orgDrawerUtils = require('org-parse').OrgDrawer;

const OrgTimestampUtil = require('../utilities/OrgTimestampUtil');

import { completeHabit, resetHabit } from '../actions';

import { doCloudUpload } from '../main';

class DrawerPanelScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSpinner: false,
      showError: false,
      error: 'some error text here'
    };
  }

  render() {
    return (
      <View
        style={{
          margin: 10,
          flexDirection: 'column',
          height: '100%'
        }}>
        <View style={{ flex: 1 }} />
        <View>
          <Button
            title={'sync w/ dropbox'}
            onPress={() => {
              this.setState({ showSpinner: true });
              this.props.onSync(
                () => {
                  setTimeout(() => this.setState({ showSpinner: false }), 1000);
                },
                e => {
                  this.setState({
                    showSpinner: false,
                    showError: true,
                    error: e
                  });
                }
              );
            }}
          />
          {this.state.showSpinner ? (
            <View>
              <ActivityIndicator />
            </View>
          ) : null}
          {this.state.showError ? (
            <Text style={{ color: '#f00' }}>{this.state.error}</Text>
          ) : null}
        </View>
        <View style={{ flex: 1 }} />
      </View>
    );
  }
}

////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    onSync: (onSucc, onErr) => {
      dispatch(doCloudUpload(onSucc, onErr));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerPanelScreen);
