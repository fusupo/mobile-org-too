import React from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, createStackNavigator } from 'react-navigation';

import NodeDetailScreen from '../screens/NodeDetailScreen';
import RootNav from '../navigation/RootNavigation';

export const StacksOverTabs = createStackNavigator(
  {
    Root: {
      screen: RootNav
    },
    NodeDetail: {
      screen: NodeDetailScreen
    },
    NewNode: {
      screen: NodeDetailScreen
    }
  },
  {}
);

/* const AppWithNavigationState = ({ dispatch, nav }) => (
 *   <StacksOverTabs navigation={addNavigationHelpers({ dispatch, state: nav })} />
 * );
 * */
const mapStateToProps = state => ({
  nav: state.nav
});

/* export default connect(mapStateToProps)(StacksOverTabs); //AppWithNavigationState);*/
export default StacksOverTabs;
