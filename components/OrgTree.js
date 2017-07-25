import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import OrgHeadline from './OrgHeadline.js';

const styles = StyleSheet.create({
  txt: {
    textAlign: 'left',
    fontSize: 14
  },
  border: {
    borderTopWidth: 1,
    borderStyle: 'solid',
    paddingLeft: 5
  },
  padded: {
    paddingLeft: 5
  },
  orgTree: {
    flex: 1
  }
});

class OrgTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseStatus: this.props.collapseStatus
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collapseStatus !== this.state.collapseStatus) {
      this.setState({ collapseStatus: nextProps.collapseStatus });
    }
  }

  _cycleCollapse() {
    let newCollapseState = this.state.collapseStatus + 1;
    newCollapseState = newCollapseState > 2 ? 0 : newCollapseState;
    this.setState({ collapseStatus: newCollapseState });
  }

  render() {
    const headerIcon = ['angle-down', 'angle-double-down', 'angle-up'][
      this.state.collapseStatus
    ];
    const headerTouchable = this.props.tree.children.length === 0
      ? null
      : <TouchableHighlight
          underlayColor="#00ff00"
          onPress={this._cycleCollapse.bind(this)}
          style={{ width: 20 }}>
          <FontAwesome name={headerIcon} size={12} />
        </TouchableHighlight>;
    const header = (
      <View style={{ flexDirection: 'row' }}>
        <TouchableHighlight
          underlayColor="#00ff00"
          onPress={() => {
            this.props.navigation.navigate('NodeDetail', {
              tree: this.props.tree
            });
          }}
          // .bind(this)
          style={{ flex: 1 }}>
          <View>
            <OrgHeadline headline={this.props.tree.node.headline} />
          </View>
        </TouchableHighlight>
        {headerTouchable}
      </View>
    );

    switch (this.state.collapseStatus) {
      case 0:
        return <View style={styles.border}>{header}</View>;
        break;
      case 1:
        const listItems = this.props.tree.children.map((tree, idx) => (
          <OrgTree
            key={idx}
            tree={tree}
            collapseStatus={0}
            navigation={this.props.navigation}
          />
        ));
        return <View style={styles.border}>{header}{listItems}</View>;
        break;
      case 2:
        const listItemsToo = this.props.tree.children.map((tree, idx) => (
          <OrgTree
            key={idx}
            tree={tree}
            collapseStatus={2}
            navigation={this.props.navigation}
          />
        ));
        return <View style={styles.border}>{header}{listItemsToo}</View>;
        break;
    }
  }
}

export default OrgTree;
