import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Button,
  TouchableHighlight
} from 'react-native';

class OrgDrawerItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      propKey: undefined,
      propVal: undefined
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      propKey: nextProps.propKey,
      propVal: nextProps.propVal
    });
  }
  render() {
    const showKeyEditor = this.props.propKey
      ? <Text style={{ flex: 1, borderColor: 'gray', borderWidth: 1 }}>
          {this.props.propKey}
        </Text>
      : <TextInput
          style={{ flex: 1, borderColor: 'gray', borderWidth: 1 }}
          value={
            this.state.propKey === undefined
              ? this.props.propKey
              : this.state.propKey
          }
          onChangeText={propKey => this.setState({ propKey })}
        />;
    const showEditor = this.state.isEditing
      ? <View style={{ flex: 16, flexDirection: 'row' }}>
          {showKeyEditor}
          <TextInput
            style={{ flex: 1, borderColor: 'gray', borderWidth: 1 }}
            value={
              this.state.propVal === undefined
                ? this.props.propVal
                : this.state.propVal
            }
            onChangeText={propVal => this.setState({ propVal })}
          />
          <Button
            onPress={() => {
              const key = this.state.propKey === undefined
                ? this.props.propKey
                : this.state.propKey;
              this.props.onUpdateProp(this.props.idx, key, this.state.propVal);
              this.setState({ isEditing: false });
            }}
            title="ok"
            color="#33aa33"
          />
          <Button
            onPress={() => {
              this.setState({ isEditing: false });
            }}
            title="cancel"
            color="#aa3333"
          />
        </View>
      : <TouchableHighlight
          style={{ flex: 16 }}
          onPress={() => this.setState({ isEditing: true })}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 4 }}>
              <Text
                style={{
                  fontFamily: 'space-mono',
                  fontSize: 10
                }}>
                {this.props.propKey}
              </Text>
            </View>
            <View style={{ flex: 12 }}>
              <Text
                style={{
                  fontFamily: 'space-mono',
                  fontSize: 10
                }}>
                :{this.props.propVal}
              </Text>
            </View>
          </View>
        </TouchableHighlight>;

    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <TouchableHighlight
            onPress={() => this.props.onRemoveProp(this.props.propKey)}>
            <Text
              className="OrgDrawerName"
              style={{
                fontFamily: 'space-mono',
                fontSize: 12
              }}>
              {'X'}
            </Text>
          </TouchableHighlight>
        </View>
        {showEditor}
      </View>
    );
  }
}

export default OrgDrawerItem;
