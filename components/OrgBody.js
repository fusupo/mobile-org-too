import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Button,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  border: {
    borderWidth: 1,
    borderStyle: 'solid',
    margin: 10
  },
  textInput: {
    height: 40
  }
});

class OrgBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      text: undefined
    };
  }

  render() {
    const showEditor = this.state.isEditing
      ? <View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Button
                onPress={() => {
                  this.setState({ isEditing: false });
                }}
                title="cancel"
                color="#aa3333"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                onPress={() => {
                  this.props.onUpdateNodeBody(this.state.text);
                  this.setState({ isEditing: false });
                }}
                title="ok"
                color="#33aa33"
              />
            </View>
          </View>
          <TextInput
            style={[styles.textInput, styles.container, styles.border]}
            value={
              this.state.text === undefined
                ? this.props.bodyText
                : this.state.text
            }
            multiline={true}
            autoFocus={true}
            onChangeText={text => {
              this.setState({ text });
            }}
          />
        </View>
      : <View style={[styles.container, styles.border]}>
          <TouchableHighlight
            onPress={() => {
              this.setState({ isEditing: true });
            }}>
            <Text>{this.props.bodyText}</Text>
          </TouchableHighlight>
        </View>;
    return <View style={{ flex: 16 }}>{showEditor}</View>;
  }
}

export default OrgBody;
