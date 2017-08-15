import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Button,
  TouchableHighlight,
  ScrollView,
  StyleSheet
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  border: {
    // borderWidth: 1,
    // borderStyle: 'solid',
    // margin: 10
  },
  textInput: {
    height: 70
  },
  text: {
    margin: 10,
    fontFamily: 'space-mono',
    fontSize: 12
  }
});

class OrgBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      text: undefined,
      isCollapsed: true
    };
  }

  _toggleCollapse() {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  render() {
    const { onUpdateNodeBody, bodyText } = this.props;
    const { isEditing, text } = this.state;
    const showEditor = isEditing
      ? <View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Button
                onPress={() => {
                  this.setState({ isEditing: false });
                  this._toggleCollapse();
                }}
                title="cancel"
                color="#aa3333"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                onPress={() => {
                  onUpdateNodeBody(text);
                  this.setState({ isEditing: false });
                  this._toggleCollapse();
                }}
                title="ok"
                color="#33aa33"
              />
            </View>
          </View>
          <ScrollView horizontal={true}>
            <TextInput
              style={[
                styles.text,
                styles.textInput,
                styles.container,
                styles.border
              ]}
              value={text === undefined ? bodyText : text}
              multiline={true}
              autoFocus={true}
              onChangeText={text => {
                this.setState({ text });
              }}
            />
          </ScrollView>
        </View>
      : <View style={[styles.container, styles.border]}>
          <TouchableHighlight onPress={this._toggleCollapse.bind(this)}>
            <View
              className="OrgBody"
              style={{
                flexDirection: 'row',
                backgroundColor: '#cccccc'
              }}>
              <Ionicons
                name={this.state.isCollapsed ? 'ios-book-outline' : 'ios-book'}
                size={20}
                style={{ marginLeft: 5 }}
              />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={
              this.state.isCollapsed
                ? null
                : () => this.setState({ isEditing: true })
            }>
            <ScrollView horizontal={true}>
              <Text style={styles.text}>{bodyText}</Text>
            </ScrollView>
          </TouchableHighlight>
        </View>;
    return <View style={{ flex: 16 }}>{showEditor}</View>;
  }
}

export default OrgBody;
