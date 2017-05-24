import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

class OrgLogbook extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.state = {isCollapsed: true};
  }

  _toggleCollapse(){
    this.setState({isCollapsed: !this.state.isCollapsed});  
  }

  render() {
    if(this.state.isCollapsed){

      return (
          <View className="OrgLogbook">
          <Text className="OrgDrawerName" onPress={this._toggleCollapse.bind(this)}>
              LOGBOOK
            </Text>
          </View>
      );

    }else{
      const listItems = this.props.log.log.map((l, idx) => {
        return <Text key={idx}>{l}</Text>;
      });

      return (
          <View className="OrgLogbook">
          <Text className="OrgDrawerName" onPress={this._toggleCollapse.bind(this)}>
              LOGBOOK
            </Text>
            <Text className="OrgLogbookItems">
              {listItems}
            </Text>
          </View>
      );
      
    }
  }
}
export default OrgLogbook;
