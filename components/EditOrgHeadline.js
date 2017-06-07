import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight
} from 'react-native';

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

class EditOrgHeadline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: props.headline.content
    };
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
        <TextInput
          style={{ flex: 1, height: 40, borderColor: 'gray', borderWidth: 1 }}
          value={this.state.content}
          onChangeText={content => this.setState({ content })}
          onEndEditing={() => {
            console.log('EDITING COMPLETE');
          }}
        />
        {tagList}
      </View>
    );
  }
}

export default EditOrgHeadline;
/*
  
  <View style={[styles.container, styles.border]}>
  {todoKeyword}
  
  {tags}
  </View>
  */
