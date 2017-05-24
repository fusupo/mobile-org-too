import { createRouter } from '@expo/ex-navigation';

import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RootNavigation from './RootNavigation';

export default createRouter(() => ({
  home: () => HomeScreen,
  calendar: () => CalendarScreen,
  settings: () => SettingsScreen,
  rootNavigation: () => RootNavigation,
}));
