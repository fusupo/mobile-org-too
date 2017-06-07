import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import OrgTree from './OrgTree.js';

class OrgBuffer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseStatus: 0
    };
  }

  _cycleCollapse() {
    // let newCollapseState = this.state.collapseStatus + 1;
    // newCollapseState = newCollapseState > 2 ? 0 : newCollapseState;
    // this.setState({ collapseStatus: newCollapseState });
  }

  render() {
    const listItems = this.props.orgTree === null
      ? null
      : this.props.orgTree.children.map((tree, idx) => (
          <OrgTree
            key={idx}
            tree={tree}
            collapseStatus={this.state.collapseStatus}
            navigation={this.props.navigation}
          />
        ));

    let iconName = '';
    switch (this.state.collapseStatus) {
      case 0:
        iconName = 'minus';
        break;
      case 1:
        iconName = 'list';
        break;
      case 2:
        iconName = 'circle-o';
        break;
    }
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: 'powderblue' }}>
          <ScrollView>
            {listItems}
          </ScrollView>
        </View>
        <View style={{ height: 56 / 1.618, backgroundColor: 'steelblue' }}>
          <View style={{ flex: 1 }} />
          <FontAwesome
            name={iconName}
            size={24}
            onPress={this._cycleCollapse.bind(this)}
            style={{ height: 24, marginLeft: 14 }}
          />
          <View style={{ flex: 1 }} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  txt: {
    textAlign: 'left',
    fontSize: 14
  },
  border: {
    borderWidth: 1,
    borderStyle: 'solid',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    padding: 5
  },
  padded: {
    paddingLeft: 10
  }
});

export default OrgBuffer;
