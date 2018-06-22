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

import appStyles from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textInput: {
    height: 70
  },
  text: {
    margin: 10
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

  componentWillMount() {
    // console.log('WILL MOUNT');
    // console.log(this.props);
    // console.log(this.state);
    this.setState({ text: this.props.text });
  }

  render() {
    const { onUpdateNodeParagraph, bodyText, section } = this.props;
    const { isCollapsed, isEditing, text } = this.state;
    const showEditor = isEditing ? (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <View style={appStyles.container}>
            <Button
              onPress={() => {
                this.setState({ isEditing: false });
                this._toggleCollapse();
              }}
              title="cancel"
              color="#aa3333"
            />
          </View>
          <View style={appStyles.container}>
            <Button
              onPress={() => {
                onUpdateNodeParagraph(text);
                this.setState({ isEditing: false });
                this._toggleCollapse();
              }}
              title="ok"
              color="#33aa33"
            />
          </View>
        </View>
        <ScrollView style={[appStyles.container]} horizontal={true}>
          <View style={[appStyles.container]}>
            <TextInput
              style={[
                appStyles.baseText,
                styles.text,
                { width: '100%' },
                appStyles.border
              ]}
              value={text === undefined ? bodyText : text}
              multiline={true}
              autoFocus={true}
              onChangeText={text => {
                this.setState({ text });
              }}
            />
          </View>
        </ScrollView>
      </View>
    ) : (
      <View>
        <View
          className="OrgBody"
          style={{
            flexDirection: 'row',
            backgroundColor: '#cccccc'
          }}>
          <TouchableHighlight onPress={this._toggleCollapse.bind(this)}>
            <Ionicons
              name={isCollapsed ? 'ios-book-outline' : 'ios-book'}
              size={20}
              style={{ marginLeft: 5 }}
            />
          </TouchableHighlight>
        </View>
        {isCollapsed ? (
          <ScrollView style={[appStyles.container]} horizontal={true}>
            <View style={[appStyles.container]}>
              <Text
                style={[
                  appStyles.baseText,
                  styles.text,
                  { width: '100%' },
                  appStyles.border
                ]}>
                {
                  // bodyText
                  text
                }
              </Text>
            </View>
          </ScrollView>
        ) : (
          <TouchableHighlight
            onPress={
              isCollapsed ? null : () => this.setState({ isEditing: true })
            }>
            <ScrollView style={[appStyles.container]} horizontal={true}>
              <View style={[appStyles.container]}>
                <Text style={[styles.container, styles.text]}>
                  {
                    //bodyText
                    text
                  }
                </Text>
              </View>
            </ScrollView>
          </TouchableHighlight>
        )}
      </View>
    );
    return <View style={{ flex: 16 }}>{showEditor}</View>;
  }
}

export default OrgBody;
