import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  ScrollView,
  Button,
  TouchableHighlight
} from 'react-native';
import Swipeout from 'react-native-swipeout';

class OrgDrawerItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      text: undefined
    };
  }

  render() {
    let showEditor = <View><Text>{'editor'}</Text></View>;
    let ret;
    let le = this.props.logItem;
    text = le.text
      ? <Text
          style={{
            flex: 1,
            fontSize: 10
          }}>
          {le.text}
        </Text>
      : null;
    switch (le.type) {
      case 'state':
        ret = (
          <View style={{ flex: 16 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 4 }}>
                <Text>{`State ${le.state}`}</Text>
              </View>
              <View style={{ flex: 4 }}>
                <Text>{`from ${le.from}`}</Text>
              </View>
              <View style={{ flex: 7 }}>
                <Text>{`${le.timestamp}`}</Text>
              </View>
            </View>
            <ScrollView horizontal={true}>
              {text}
            </ScrollView>
          </View>
        );
        break;
      case 'note':
        const showEditor = this.state.isEditing
          ? <View style={{ flex: 16 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 8 }}>
                  <Text>{`Note taken on`}</Text>
                </View>
                <View style={{ flex: 7 }}>
                  <Text>{`${le.timestamp}`}</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <Button
                      style={{ flex: 1 }}
                      onPress={() => {
                        this.setState({ isEditing: false });
                      }}
                      title="cancel"
                      color="#aa3333"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button
                      style={{ flex: 1 }}
                      onPress={() => {
                        this.props.onUpdateLogNote(
                          this.props.idx,
                          this.state.text
                        );
                        this.setState({ isEditing: false });
                      }}
                      title="ok"
                      color="#33aa33"
                    />
                  </View>
                </View>
                <TextInput
                  style={{
                    flex: 1,
                    borderColor: 'gray',
                    borderWidth: 1,
                    height: 80,
                    fontSize: 10
                  }}
                  multiline={true}
                  autoFocus={true}
                  value={
                    this.state.text === undefined
                      ? le.text ? le.text : ''
                      : this.state.text
                  }
                  onChangeText={text => this.setState({ text })}
                />
              </View>
            </View>
          : <TouchableHighlight
              style={{ flex: 16 }}
              onPress={() => this.setState({ isEditing: true })}>
              <View style={{ flex: 16 }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 8 }}>
                    <Text>{`Note taken on`}</Text>
                  </View>
                  <View style={{ flex: 7 }}>
                    <Text>{`${le.timestamp}`}</Text>
                  </View>
                </View>
                {text}
              </View>
            </TouchableHighlight>;
        ret = showEditor;
        break;
      default:
        ret = (
          <View style={{ flex: 16 }}>
            <Text>{`[unhandled log entry format]`}</Text>
            {text}
          </View>
        );
        break;
    }

    return (
      <Swipeout
        autoClose={true}
        right={[
          {
            text: 'delete',
            backgroundColor: '#bb3333',
            onPress: () => {
              this.props.onRemoveLogNote(this.props.idx);
            }
          }
        ]}>
        <View style={{ flexDirection: 'row', marginLeft: 5 }}>
          {ret}
        </View>
      </Swipeout>
    );
  }
}

export default OrgDrawerItem;
