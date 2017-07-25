import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Notifications } from 'expo';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';

import { TabNavigator } from 'react-navigation';

import NewNodeScreen from '../screens/NewNodeScreen';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  selectedTab: {
    color: Colors.tabIconSelected
  }
});

const TabNav = TabNavigator(
  {
    // AddOne: {
    //   screen: NewNodeScreen,
    //   path: '/add',
    //   navigationOptions: {
    //     tabBarIcon: ({ tintColor, focused }) => (
    //       <Ionicons
    //         name={focused ? 'ios-add' : 'ios-add'}
    //         size={26}
    //         style={{ color: tintColor }}
    //       />
    //     )
    //   }
    // },
    MainTab: {
      screen: HomeScreen,
      path: '/',
      navigationOptions: {
        title: 'Home',
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-home' : 'ios-home-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        )
      }
    },
    AgendaTab: {
      screen: CalendarScreen,
      path: '/agenda',
      navigationOptions: {
        title: 'Agenda',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-calendar' : 'ios-calendar-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        )
      }
    },
    SettingsTab: {
      screen: SettingsScreen,
      path: '/settings',
      navigationOptions: {
        title: 'Settings',
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? 'ios-settings' : 'ios-settings-outline'}
            size={26}
            style={{ color: tintColor }}
          />
        )
      }
    }
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: true,
    initialRouteName: 'MainTab'
  }
);

export default TabNav;

// export default class RootNavigation extends React.Component {
//   componentDidMount() {
//     this._notificationSubscription = this._registerForPushNotifications();
//   }

//   componentWillUnmount() {
//     this._notificationSubscription && this._notificationSubscription.remove();
//   }

//   render() {
//     return (
//       <TabNavigation tabBarHeight={56} initialTab="home">
//         <TabNavigationItem
//           id="home"
//           renderIcon={isSelected => this._renderIcon('database', isSelected)}>
//           <StackNavigation initialRoute="home" />
//         </TabNavigationItem>

//         <TabNavigationItem
//           id="calendar"
//           renderIcon={isSelected => this._renderIcon('calendar', isSelected)}>
//           <StackNavigation initialRoute="calendar" />
//         </TabNavigationItem>

//         <TabNavigationItem
//           id="settings"
//           renderIcon={isSelected => this._renderIcon('cog', isSelected)}>
//           <StackNavigation initialRoute="settings" />
//         </TabNavigationItem>
//       </TabNavigation>
//     );
//   }

//   _renderIcon(name, isSelected) {
//     return (
//       <FontAwesome
//         name={name}
//         size={32}
//         color={isSelected ? Colors.tabIconSelected : Colors.tabIconDefault}
//       />
//     );
//   }

//   _registerForPushNotifications() {
//     // Send our push token over to our backend so we can receive notifications
//     // You can comment the following line out if you want to stop receiving
//     // a notification every time you open the app. Check out the source
//     // for this function in api/registerForPushNotificationsAsync.js
//     registerForPushNotificationsAsync();

//     // Watch for incoming notifications
//     this._notificationSubscription = Notifications.addListener(
//       this._handleNotification
//     );
//   }

//   _handleNotification = ({ origin, data }) => {
//     this.props.navigator.showLocalAlert(
//       `Push notification ${origin} with data: ${JSON.stringify(data)}`,
//       Alerts.notice
//     );
//   };
// }
