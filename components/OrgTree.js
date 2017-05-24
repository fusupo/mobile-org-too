import React, { Component } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import OrgNode from "./OrgNode.js";

class OrgTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true,
      collapseState: 0
    };
  }

  _toggleCollapse() {
    var newCollapseState = this.state.collapseState + 1;
    newCollapseState = newCollapseState > 2 ? 0 : newCollapseState;
    this.setState({ collapseState: newCollapseState });
  }

  render() {
    switch (this.state.collapseState) {
      case 0:
        return (
          <View style={styles.border}>
            <OrgNode
              node={this.props.tree.node}
              toggleCollapse={this._toggleCollapse.bind(this)}
              isCollapsed={true}
            />
          </View>
        );
        break;
      case 1:
        return (
          <View style={styles.border}>
            <OrgNode
              node={this.props.tree.node}
              toggleCollapse={this._toggleCollapse.bind(this)}
              isCollapsed={false}
            />
          </View>
        );
        break;
      case 2:
        console.log("WTF?!?!?");
        const listItems = this.props.tree.children.map((tree, idx) => (
          <OrgTree key={idx} tree={tree} />
        ));
        return (
          <View style={styles.border}>
            <OrgNode
              node={this.props.tree.node}
              toggleCollapse={this._toggleCollapse.bind(this)}
              isCollapsed={false}
            />
            <View style={styles.padded} className="OrgTreeChildren">
              {listItems}
            </View>
          </View>
        );
        break;
    }
  }
}

const styles = StyleSheet.create({
  txt: {
    textAlign: "left",
    fontSize: 14
  },
  border: {
    borderWidth: 1,
    borderStyle: "solid",
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    padding: 5
  },
  padded: {
    paddingLeft: 10
  }
});

export default OrgTree;
