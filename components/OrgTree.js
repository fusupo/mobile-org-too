import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

import OrgNode from './OrgNode.js';

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

    console.log(this.props.tree.children.length, newCollapseState);

    newCollapseState = newCollapseState === 1 &&
      this.props.tree.children.length === 0
      ? 2
      : newCollapseState;

    this.setState({ collapseStatus: newCollapseState });
  }

  render() {
    switch (this.state.collapseStatus) {
      case 0:
        return (
          <TouchableHighlight onPress={this._cycleCollapse.bind(this)}>
            <View style={styles.border}>
              <OrgNode node={this.props.tree.node} isCollapsed={true} />
            </View>
          </TouchableHighlight>
        );
        break;
      case 1:
        const listItems = this.props.tree.children.map((tree, idx) => (
          <OrgTree
            key={idx}
            tree={tree}
            collapseStatus={this.state.collapseStatus}
          />
        ));
        return (
          <TouchableHighlight onPress={this._cycleCollapse.bind(this)}>
            <View
              style={styles.border}
              onPress={this._cycleCollapse.bind(this)}>
              <OrgNode node={this.props.tree.node} isCollapsed={true} />
              <View style={styles.padded} className="OrgTreeChildren">
                {listItems}
              </View>
            </View>
          </TouchableHighlight>
        );
        break;
      case 2:
        const listItemstoo = this.props.tree.children.map((tree, idx) => (
          <OrgTree
            key={idx}
            tree={tree}
            collapseStatus={this.state.collapseStatus}
          />
        ));
        return (
          <TouchableHighlight onPress={this._cycleCollapse.bind(this)}>
            <View
              style={styles.border}
              onPress={this._cycleCollapse.bind(this)}>
              <OrgNode node={this.props.tree.node} isCollapsed={false} />
              <View style={styles.padded} className="OrgTreeChildren">
                {listItemstoo}
              </View>
            </View>
          </TouchableHighlight>
        );
        break;
    }
  }
}

const styles = StyleSheet.create({
  txt: {
    textAlign: 'left',
    fontSize: 14
  },
  border: {
    borderWidth: 0,
    borderStyle: 'solid',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 0,
    padding: 5
  },
  padded: {
    paddingLeft: 5
  }
});

export default OrgTree;
