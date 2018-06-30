import React, { Component } from 'react';
import { TouchableHighlight, ScrollView, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Swipeout from 'react-native-swipeout';

import OrgLogbookItem from './OrgLogbookItem';
import OrgSectionElementHeader from './OrgSectionElementHeader';

export default class OrgLogbook extends Component {
  constructor(props) {
    super(props);
    this.state = { isCollapsed: this.props.isCollapsed };
  }

  _toggleCollapse() {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  render() {
    const { log, onRemoveLogNote, onUpdateLogNote, onAddLogNote } = this.props;
    if (this.state.isCollapsed) {
      return (
        <OrgSectionElementHeader
          iconName={'ios-recording-outline'}
          toggleCollapse={this._toggleCollapse.bind(this)}
        />
      );
    } else {
      const listItems =
        log &&
        log.items &&
        log.items.map((le, idx) => {
          return (
            <OrgLogbookItem
              key={idx}
              idx={idx}
              type={le.type}
              logItem={le}
              onRemoveLogNote={onRemoveLogNote}
              onUpdateLogNote={onUpdateLogNote}
            />
          );
        });

      return (
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <Swipeout
            autoClose={true}
            left={[
              {
                text: 'addOne',
                backgroundColor: '#33bb33',
                onPress: () => {
                  onAddLogNote();
                }
              }
            ]}>
            <OrgSectionElementHeader
              iconName={'ios-recording'}
              toggleCollapse={this._toggleCollapse.bind(this)}
            />
          </Swipeout>
          <View className="OrgDrawerProperties">{listItems}</View>
        </View>
      );
    }
  }
}
