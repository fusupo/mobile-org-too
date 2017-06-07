import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import OrgTree from '../components/OrgTree';
import EditOrgHeadline from '../components/EditOrgHeadline';
import OrgHeadline from '../components/OrgHeadline';
import OrgDrawer from '../components/OrgDrawer.js';
import OrgLogbook from '../components/OrgLogbook.js';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  border: {
    borderWidth: 1,
    borderStyle: 'solid',
    margin: 10
  }
});

export default class NodeDetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.tree.node.headline.content
  });
  constructor(props) {
    super(props);
  }
  render() {
    const node = this.props.navigation.state.params.tree.node;

    // headlineContent
    const headlineContent = node.headline.content;

    // todo keyword
    const todoKeyword = node.headline.todoKeyword
      ? <Text
          style={{
            backgroundColor: node.headline.todoKeywordColor
          }}>
          {node.headline.todoKeyword}
        </Text>
      : null;

    // tags
    const tags = node.headline.tags && node.headline.tags.length > 0
      ? node.headline.tags.map((tag, idx) => {
          return (
            <Text
              key={idx}
              style={{
                fontFamily: 'space-mono',
                backgroundColor: '#cccccc',
                fontSize: 10
              }}>
              {tag}
            </Text>
          );
        })
      : null;

    // scheduled
    const scheduled = node.scheduled
      ? <Text
          style={{
            fontFamily: 'space-mono',
            fontSize: 12
          }}>
          {'SCHEDULED: ' + node.scheduled.srcStr}
        </Text>
      : null;

    // closed
    const closed = node.closed
      ? <Text
          style={{
            fontFamily: 'space-mono',
            fontSize: 12
          }}>
          {'CLOSED: ' + node.closed.srcStr}
        </Text>
      : null;

    // body
    const body = node.body ? <Text>{node.body}</Text> : null;

    // childNodes
    const childNodes = this.props.navigation.state.params.tree.children;
    const listItems = childNodes.length === 0
      ? null
      : childNodes.map((cn, idx) => (
          <OrgTree
            key={idx}
            tree={cn}
            collapseStatus={0}
            navigation={this.props.navigation}
          />
        ));
    const list = listItems
      ? <ScrollView style={{ flex: 1 }}>{listItems}</ScrollView>
      : null;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <View style={[styles.container, styles.border]}>
            <EditOrgHeadline headline={node.headline} />
            {scheduled}
            {closed}
          </View>
          <View style={[styles.container, styles.border]}>
            <OrgDrawer drawer={node.propDrawer} isCollapsed={false} />
          </View>
          <View style={[styles.container, styles.border]}>
            <OrgLogbook log={node.logbook} isCollapsed={false} />
          </View>
          <View style={[styles.container, styles.border]}>
            {body}
          </View>
        </ScrollView>
        {list}
      </View>
    );
  }
}
