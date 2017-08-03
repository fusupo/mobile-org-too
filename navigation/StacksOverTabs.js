import React from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import NodeDetailScreen from '../screens/NodeDetailScreen';
import RootNav from '../navigation/RootNavigation';

export const StacksOverTabs = StackNavigator({
  Root: {
    screen: RootNav
  },
  NodeDetail: {
    screen: NodeDetailScreen
  },
  NewNode: {
    screen: NodeDetailScreen
  }
});

const AppWithNavigationState = ({ dispatch, nav }) => (
  <StacksOverTabs navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

const mapStateToProps = state => ({
  nav: state.nav
});

export default connect(mapStateToProps)(AppWithNavigationState);
