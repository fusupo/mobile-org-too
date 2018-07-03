import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
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
      screen: NodeDetailScreen,
      navigationOptions: ({ navigation }) => ({
        /* title: `${navigation.state.params.name}'s Profile'`,*/
        headerTransparent: true,
        header: headerProps => {
          const routes = headerProps.navigation.state.routes;
          const foo = routes.map((s, idx) => {
            if (idx < routes.length - 1) {
              return (
                <TouchableHighlight
                  key={idx}
                  onPress={() => {
                    for (i = 0; i < routes.length - idx - 1; i++) {
                      navigation.pop();
                    }
                  }}>
                  <Text style={{ padding: 5 }}>{s.routeName + ' > '}</Text>
                </TouchableHighlight>
              );
            } else {
              return (
                <Text style={{ padding: 5 }} key={idx}>
                  {s.routeName}
                </Text>
              );
            }
          });
          /* const bar = <View>{foo}</View>;*/
          return (
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#ccc',
                marginTop: 20
              }}>
              {foo}
            </View>
          );
        }
      })
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
