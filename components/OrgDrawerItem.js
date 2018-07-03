import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Button,
  TouchableHighlight
} from 'react-native';
import Swipeout from 'react-native-swipeout';

class OrgDrawerItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      oldKey: undefined,
      propKey: undefined,
      propVal: undefined
    };
  }

  componentWillMount(foo, bar, baz) {
    if (this.props.propKey === '' && this.props.propVal === '') {
      this.onEditBegin();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      propKey: nextProps.propKey,
      propVal: nextProps.propVal
    });
    if (
      nextProps.disabled &&
      nextProps.disabled !== this.props.disabled &&
      this.state.isEditing
    ) {
      this.setState({ isEditing: false });
      this.removeIfEmpty();
    }
  }

  removeIfEmpty() {
    const { onRemoveProp } = this.props;
    const key = this.determineKey();
    const val = this.determineVal();
    if (key === '' && val === '') onRemoveProp('');
  }

  onEditBegin() {
    const { idx, onItemEditBegin } = this.props;
    const key = this.determineKey();

    onItemEditBegin(idx);

    this.setState({
      isEditing: true,
      oldKey: key
    });
  }

  onEditEnd() {
    const { onItemEditEnd } = this.props;

    onItemEditEnd();
    this.setState({
      isEditing: false
    });

    this.removeIfEmpty();
  }

  determineKey() {
    return this.state.propKey === undefined
      ? this.props.propKey
      : this.state.propKey;
  }

  determineVal() {
    return this.state.propVal === undefined
      ? this.props.propVal
      : this.state.propVal;
  }

  render() {
    const {
      isLocked,
      idx,
      onItemEditBegin,
      onUpdateProp,
      onRemoveProp,
      disabled
    } = this.props;

    const { oldKey, isEditing } = this.state;
    const key = this.determineKey();
    const val = this.determineVal();

    const showKeyEditor = this.props.propKey ? (
      <Text
        style={{
          flex: 1,
          borderColor: 'gray',
          backgroundColor: '#dedede',
          borderWidth: 1
        }}>
        {key}
      </Text>
    ) : (
      <TextInput
        style={{ flex: 1, borderColor: 'gray', borderWidth: 1 }}
        value={key}
        onChangeText={propKey => this.setState({ propKey })}
      />
    );

    const base = (
      <View style={{ flexDirection: 'row', marginLeft: 5 }}>
        <View style={{ flex: 4 }}>
          <Text
            style={{
              fontFamily: 'space-mono',
              fontSize: 10
            }}>
            {key}
          </Text>
        </View>
        <View style={{ flex: 12 }}>
          <Text
            style={{
              fontFamily: 'space-mono',
              fontSize: 10
            }}>
            :{val}
          </Text>
        </View>
      </View>
    );

    const showEditor =
      !disabled && isEditing ? (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Button
            onPress={() => {
              console.log(onUpdateProp);
              onUpdateProp(idx, oldKey, key, val);
              this.onEditEnd();
            }}
            title="ok"
            color="#33aa33"
          />
          <Button
            onPress={this.onEditEnd.bind(this)}
            title="cancel"
            color="#aa3333"
          />
          {showKeyEditor}
          <TextInput
            style={{ flex: 1, borderColor: 'gray', borderWidth: 1 }}
            value={val}
            onChangeText={propVal => this.setState({ propVal })}
          />
        </View>
      ) : (
        <Swipeout
          autoClose={true}
          right={[
            {
              backgroundColor: '#bb3333',
              text: 'delete',
              onPress: () => {
                onRemoveProp(key);
              }
            }
          ]}
          style={{ flex: 16 }}>
          {isLocked ? (
            base
          ) : (
            <TouchableHighlight
              style={{ flex: 16 }}
              onPress={this.onEditBegin.bind(this)}>
              {base}
            </TouchableHighlight>
          )}
        </Swipeout>
      );

    return <View style={{ flexDirection: 'row' }}>{showEditor}</View>;
  }
}

export default OrgDrawerItem;
