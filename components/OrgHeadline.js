import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  rowContainer: { flex: 1, flexDirection: 'row' },
  tag: {
    fontFamily: 'space-mono',
    backgroundColor: '#cccccc',
    fontSize: 10
  }
});

export default class OrgHeadline extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // todo keyword
    const todoKeyword = this.props.headline.todoKeyword
      ? <Text
          style={{
            backgroundColor: this.props.headline.todoKeywordColor
          }}>
          {this.props.headline.todoKeyword}
        </Text>
      : null;

    // tags
    const tags = this.props.headline.tags && this.props.headline.tags.length > 0
      ? this.props.headline.tags.map((tag, idx) => {
          return (
            <Text key={idx} style={styles.tag}>
              {tag}
            </Text>
          );
        })
      : null;

    const tagList = tags ? <Text>{tags}</Text> : null;

    return (
      <View style={style.rowContainer}>
        {todoKeyword}
        <Text>{'foobarbax' + this.props.headline.content}</Text>
        {tagList}
      </View>
    );
  }
}
