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
  //   <Button
  // onPress={() => {
  //   this.setState({ isEditing: false });
  //   this.props.onRemoveProp(this.props.propKey);
  // }}
  // title="delete"
  // color="#33aa33"
  // overrides={{ backgroundColor: '#ff0000' }}
  //   />
  render() {
    const showKeyEditor = this.props.propKey
      ? <Text
          style={{
            flex: 1,
            borderColor: 'gray',
            backgroundColor: '#dedede',
            borderWidth: 1
          }}>
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
      ? <View style={{ flex: 1, flexDirection: 'row' }}>
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
        </View>
      : <Swipeout
          autoClose={true}
          right={[
            {
              backgroundColor: '#bb3333',
              text: 'delete',
              onPress: () => {
                this.props.onRemoveProp(this.props.propKey);
              }
            }
          ]}
          style={{ flex: 16 }}>
          <TouchableHighlight
            style={{ flex: 16 }}
            onPress={() => this.setState({ isEditing: true })}>
            <View style={{ flexDirection: 'row', marginLeft: 5 }}>
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
          </TouchableHighlight>
        </Swipeout>;

    return (
      <View style={{ flexDirection: 'row' }}>
        {showEditor}
      </View>
    );
  }
}

//   <TouchableHighlight
// onPress={() => this.props.onRemoveProp(this.props.propKey)}>
//   <Text
// className="OrgDrawerName"
// style={{
//   fontFamily: 'space-mono',
//   fontSize: 12
// }}>
//   {'X'}
// </Text>
//   </TouchableHighlight>
export default OrgDrawerItem;
