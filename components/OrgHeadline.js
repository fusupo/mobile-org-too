import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

const styles = StyleSheet.create({
  txt: {
    textAlign: 'left',
    fontSize: 14
  },
  border: {
    borderTopWidth: 1,
    borderStyle: 'solid'
  },
  padded: {
    paddingLeft: 5
  }
});

class OrgHeadline extends Component {
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

    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {todoKeyword}
        <Text>{this.props.headline.content}</Text>
        {tagList}
      </View>
    );
  }
}

export default OrgHeadline;
