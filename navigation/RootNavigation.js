import React from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';

/* import Ionicons from 'react-native-vector-icons/Ionicons';
 * import Colors from '../constants/Colors';*/

/* import { TabNavigator } from 'react-navigation';*/
import { createBottomTabNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import LedgerScreen from '../screens/LedgerScreen';

import { getCurrentRouteName } from '../selectors';

/* const styles = StyleSheet.create({
 *   container: {
 *     flex: 1,
 *     backgroundColor: '#fff'
 *   },
 *   selectedTab: {
 *     color: Colors.tabIconSelected
 *   }
 * });*/
import Ionicons from 'react-native-vector-icons/Ionicons';

const TabNav = createBottomTabNavigator(
  {
    Home: HomeScreen,
    agenda: CalendarScreen,
    ledger: LedgerScreen,
    Settings: SettingsScreen
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'agenda') {
          iconName = `ios-clock${focused ? '' : '-outline'}`;
        } else if (routeName === 'ledger') {
          iconName = 'logo-usd';
        } else if (routeName === 'Settings') {
          iconName = `ios-options${focused ? '' : '-outline'}`;
        }

        console.log('Route Name', routeName);
        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      }
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray'
    }
  }
);

/* const TabNav = TabNavigator(
 *   {
 *     MainTab: {
 *       screen: HomeScreen,
 *       path: '/',
 *       navigationOptions: {
 *         title: '', //'Home',
 *         // tabBarLabel: 'Home',
 *         tabBarIcon: ({ tintColor, focused }) => (
 *           <Ionicons
 *             name={focused ? 'md-school' : 'md-school'}
 *             size={26}
 *             style={{ color: tintColor }}
 *           />
 *         )
 *       }
 *     },
 *     AgendaTab: {
 *       screen: CalendarScreen,
 *       path: '/agenda',
 *       navigationOptions: {
 *         title: '', //'Agenda',
 *         tabBarIcon: ({ tintColor, focused }) => (
 *           <Ionicons
 *             name={focused ? 'ios-clock' : 'ios-clock-outline'}
 *             size={26}
 *             style={{ color: tintColor }}
 *           />
 *         )
 *       }
 *     },
 *     LedgerTab: {
 *       screen: LedgerScreen,
 *       path: '/ledger',
 *       navigationOptions: {
 *         title: '', //'Ledger',
 *         tabBarIcon: ({ tintColor, focused }) => (
 *           <Ionicons
 *             name={focused ? 'logo-usd' : 'logo-usd'}
 *             size={26}
 *             style={{ color: tintColor }}
 *           />
 *         )
 *       }
 *     },
 *     SettingsTab: {
 *       screen: SettingsScreen,
 *       path: '/settings',
 *       navigationOptions: {
 *         title: '', //'Settings',
 *         tabBarIcon: ({ tintColor, focused }) => (
 *           <Ionicons
 *             name={focused ? 'ios-settings' : 'ios-settings-outline'}
 *             size={26}
 *             style={{ color: tintColor }}
 *           />
 *         )
 *       }
 *     }
 *   },
 *   {
 *     tabBarPosition: 'bottom',
 *     animationEnabled: false,
 *     swipeEnabled: false,
 *     initialRouteName: 'MainTab',
 *     lazy: true
 *   }
 * );*/

class AppWithState extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currRoute: 'MainTab' };
  }
  render() {
    return <TabNav />;
  }
}
/* if (this.props.inboxFileOk) {
 *   return (
 *     <TabNav
 *       onNavigationStateChange={(prevState, currState, action) => {
 *         this.setState({ currRoute: getCurrentRouteName(currState) });
 *       }}
 *       screenProps={{ currRoute: this.state.currRoute }}
 *     />
 *   );
 * } else {
 *   return <SettingsScreen />;
 * }*/

const mapStateToProps = (state, ownProps) => {
  return {
    inboxFileOk: state.settings.inboxFile.isOk,
    nav: state.nav
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

//export default connect(mapStateToProps, mapDispatchToProps)(AppWithState);
export default TabNav;
