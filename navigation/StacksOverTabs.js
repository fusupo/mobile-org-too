import React from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import NewNodeScreen from '../screens/NewNodeScreen';
import NodeDetailScreen from '../screens/NodeDetailScreen';
import MainScreen from '../screens/MainScreen';

export const StacksOverTabs = StackNavigator({
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

const AppWithNavigationState = ({ dispatch, nav }) => (
  <StacksOverTabs navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

const mapStateToProps = state => ({
  nav: state.nav
});

export default connect(mapStateToProps)(AppWithNavigationState);
