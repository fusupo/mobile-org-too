import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';

import { TabNavigator } from 'react-navigation';

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
    animationEnabled: false,
    swipeEnabled: false,
    initialRouteName: 'MainTab'
  }
);

class AppWithState extends React.Component {
  render() {
    if (this.props.inboxFileOk) {
      return <TabNav />;
    } else {
      return <SettingsScreen />;
    }
  }
}

const mapStateToProps = state => ({
  inboxFileOk: state.settings.inboxFile.isOk
});

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AppWithState);
