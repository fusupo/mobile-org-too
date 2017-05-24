import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import OrgTree from "../components/OrgTree.js";
import loadParseOrgFilesAsync from "../utilities/loadParseOrgFilesAsync.js";

export default class HomeScreen extends React.Component {
  static route = {
    navigationBar: {
      title: "Root"
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      orgText: "",
      orgTree: null,
      viewIsReady: false
    };
  }

  componentWillMount() {
    this._loadParseOrgFilesAsync();
  }

  async _loadParseOrgFilesAsync() {
    try {
      let foo = await loadParseOrgFilesAsync();
      this.setState(foo);
    } catch (e) {
      console.warn(
        "There was an error retrieving files from drobbox on the home screen"
      );
      console.log(e.message);
    } finally {
      this.setState({ viewIsReady: true });
    }
  }

  render() {
    if (this.state.viewIsReady) {
      const listItems = this.state.orgTree === null
        ? null
        : this.state.orgTree.children.map((tree, idx) => (
            <OrgTree key={idx} tree={tree} />
          ));
      return (
        <View style={{ marginTop: 40 }}>
          <ScrollView>
            {listItems}
          </ScrollView>
        </View>
      );
    } else {
      // return <View style={styles.container} />;
      return <View />;
    }
  }
}
