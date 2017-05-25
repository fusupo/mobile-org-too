import React, { Component } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import OrgDrawer from './OrgDrawer.js';
import OrgLogbook from './OrgLogbook.js';

class OrgNode extends Component {
  constructor(props) {
    super(props);
    this.state = { isCollapsed: this.props.isCollapsed };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isCollapsed !== this.state.isCollapsed) {
      this.setState({ isCollapsed: nextProps.isCollapsed });
    }
  }

  render() {
    // todo keyword
    const todoKeyword = this.props.node.headline.todoKeyword
      ? <Text
          style={{
            backgroundColor: this.props.node.headline.todoKeywordColor
          }}>
          {this.props.node.headline.todoKeyword}
        </Text>
      : null;

    // tags
    const tags = this.props.node.headline.tags.length > 0
      ? this.props.node.headline.tags.map((tag, idx) => {
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
    const tagList = tags ? <Text>{tags}</Text> : null;
    switch (this.state.isCollapsed) {
      case true:
        return (
          <View>
            <Text style={styles.bigblue}>
              {todoKeyword}
              {this.props.node.headline.content}
            </Text>
            {tagList}
          </View>
        );
        break;
      case false:
        const scheduled = this.props.node.scheduled
          ? <Text
              style={{
                fontFamily: 'space-mono',
                fontSize: 12
              }}>
              {'SCHEDULED: ' + this.props.node.scheduled.srcStr}
            </Text>
          : null;
        const closed = this.props.node.closed
          ? <Text
              style={{
                fontFamily: 'space-mono',
                fontSize: 12
              }}>
              {'CLOSED: ' + this.props.node.closed.srcStr}
            </Text>
          : null;
        const body = this.props.node.body
          ? <Text>{this.props.node.body}</Text>
          : null;
        return (
          <View>
            <Text style={styles.bigblue}>
              {todoKeyword}
              {this.props.node.headline.content}
            </Text>
            {tagList}
            {scheduled}
            {closed}
            <OrgDrawer drawer={this.props.node.propDrawer} />
            <OrgLogbook log={this.props.node.logbook} />
            {body}
          </View>
        );
        break;
    }
  }
}

const styles = StyleSheet.create({
  bigblue: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'space-mono'
  }
});

export default OrgNode;
