import React, { Component } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import OrgDrawer from "./OrgDrawer.js";
import OrgLogbook from "./OrgLogbook.js";

class OrgNode extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    switch (this.props.isCollapsed) {
      case true:
        return (
          <View>
            <Text style={styles.bigblue} onPress={this.props.toggleCollapse}>
              {this.props.node.headline.content}
            </Text>
          </View>
        );
        break;
      case false:
        return (
          <View>
            <Text style={styles.bigblue} onPress={this.props.toggleCollapse}>
              {this.props.node.headline.content}
            </Text>
            <Text>
              {this.props.node.scheduled &&
                "SCHEDULED " + this.props.node.scheduled.srcStr}
            </Text>
            <OrgDrawer drawer={this.props.node.propDrawer} />
            <OrgLogbook log={this.props.node.logbook} />
            <Text>
              {this.props.node.opened &&
                "OPENED " + this.props.node.opened.srcStr}
            </Text>
            <Text>
              {this.props.node.body && this.props.node.body}
            </Text>
          </View>
        );
        break;
    }
  }
}

const styles = StyleSheet.create({
  bigblue: {
    fontSize: 24
  }
});

export default OrgNode;
