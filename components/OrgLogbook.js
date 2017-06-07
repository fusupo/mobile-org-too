import React, { Component } from 'react';
import { Text, View } from 'react-native';

class OrgLogbook extends Component {
  constructor(props) {
    super(props);
    this.state = { isCollapsed: this.props.isCollapsed };
  }

  _toggleCollapse() {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  render() {
    if (this.state.isCollapsed) {
      return (
        <View className="OrgLogbook">
          <Text
            className="OrgDrawerName"
            style={{
              fontFamily: 'space-mono',
              backgroundColor: '#cccccc',
              fontSize: 12
            }}
            onPress={this._toggleCollapse.bind(this)}>
            LOGBOOK
          </Text>
        </View>
      );
    } else {
      const listItems =
        this.props.log &&
        this.props.log.entries &&
        this.props.log.entries.map((l, idx) => {
          return (
            <View style={{ width: 100, height: 50 }} key={idx}>
              <Text
                style={{
                  fontFamily: 'space-mono',
                  backgroundColor: '#cccccc',
                  fontSize: 10
                }}>
                {l[0]}
              </Text>
            </View>
          );
        });

      return (
        <View className="OrgLogbook" style={{ flex: 1 }}>
          <Text
            className="OrgDrawerName"
            style={{
              fontFamily: 'space-mono',
              backgroundColor: '#cccccc',
              fontSize: 12
            }}
            onPress={this._toggleCollapse.bind(this)}>
            LOGBOOK
          </Text>
          <Text
            className="OrgLogbookItems"
            style={{
              fontFamily: 'space-mono',
              backgroundColor: '#cccccc',
              fontSize: 10
            }}>
            {listItems}
          </Text>
        </View>
      );
    }
  }
}
export default OrgLogbook;
