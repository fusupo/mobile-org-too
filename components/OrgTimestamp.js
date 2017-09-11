import React, { Component } from 'react';
import { connect } from 'react-redux';
import Swipeout from 'react-native-swipeout';
import {
  ActionSheetIOS,
  Button,
  DatePickerIOS,
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

const orgHeadlineUtil = require('org-parse').OrgHeadline;

import appStyles from '../styles';

class OrgTimestamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      showDatePicker: false,
      showRepIntPicker: false,
      repInt: '--',
      repMinVal: '-',
      repMinU: '-',
      repMaxVal: '-',
      repMaxU: '-'
    };
  }

  render() {
    const timestamp = this.props.timestamp;

    const okCancel = (onCancelPress, onOkPress) => {
      return (
        <View style={{ flexDirection: 'row' }}>
          <View style={appStyles.container}>
            <Button title={'Cancel'} onPress={onCancelPress} />
          </View>
          <View style={appStyles.container}>
            <Button title={'OK'} onPress={onOkPress} />
          </View>
        </View>
      );
    };

    const repUnitsPicker = selectedVal => (
      <Picker
        style={[appStyles.container, { height: 150 }]}
        selectedValue={this.state[selectedVal]}
        onValueChange={(itemValue, itemIndex) => {
          const obj = {};
          obj[selectedVal] = itemValue;
          this.setState(obj);
        }}>
        <Picker.Item label="-" value="-" />
        <Picker.Item label="h" value="h" />
        <Picker.Item label="d" value="d" />
        <Picker.Item label="w" value="w" />
        <Picker.Item label="m" value="m" />
        <Picker.Item label="y" value="y" />
      </Picker>
    );
    const repValPicker = selectedVal => {
      let vals = [<Picker.Item key={'-'} label={'-'} value={'-'} />];
      for (let i = 1; i < 10; i++) {
        vals.push(<Picker.Item key={i} label={i + ''} value={i + ''} />);
      }
      return (
        <Picker
          style={{ flex: 1, height: 150 }}
          selectedValue={this.state[selectedVal]}
          onValueChange={(itemValue, itemIndex) => {
            const obj = {};
            obj[selectedVal] = itemValue;
            this.setState(obj);
          }}>
          {vals}
        </Picker>
      );
    };
    var showRepIntPicker = this.state.showRepIntPicker
      ? <View>
          {okCancel(
            () => {
              this.setState({ showRepIntPicker: !this.state.showRepIntPicker });
            },
            () => {
              const {
                repInt,
                repMaxVal,
                repMaxU,
                repMinVal,
                repMinU
              } = this.state;
              if (repInt !== '--') {
                if (
                  repMaxVal !== '-' &&
                  repMaxU !== '-' &&
                  repMinVal !== '-' &&
                  repMinU !== '-' &&
                  parseInt(repMinVal) < parseInt(repMaxVal)
                  // you would also want to make sure the repMaxU is >= repMinU
                ) {
                  // case has min and max repeat rates defined
                  this.props.onTimestampRepIntUpdate(
                    repInt,
                    repMinVal + repMinU,
                    repMaxVal + repMaxU
                  );
                } else if (repMinVal !== '-' && repMinU !== '-') {
                  // case has only min repeat rate defined
                  this.props.onTimestampRepIntUpdate(
                    repInt,
                    repMinVal + repMinU,
                    null
                  );
                }
              } else {
                if (
                  repMaxVal === '-' &&
                  repMaxU === '-' &&
                  repMinVal === '-' &&
                  repMinU === '-'
                ) {
                  this.props.onTimestampRepIntUpdate(null, null, null);
                }
              }
              this.setState({ showRepIntPicker: !this.state.showRepIntPicker });
            }
          )}
          <View style={{ flexDirection: 'row' }}>
            <Picker
              style={appStyles.container}
              selectedValue={this.state.repInt}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ repInt: itemValue })}>
              <Picker.Item label="--" value="--" />
              <Picker.Item label="+" value="+" />
              <Picker.Item label="++" value="++" />
              <Picker.Item label=".+" value=".+" />
            </Picker>
            {repValPicker('repMinVal')}
            {repUnitsPicker('repMinU')}
            {repValPicker('repMaxVal')}
            {repUnitsPicker('repMaxU')}
          </View>
        </View>
      : <View />;

    const showDatePicker = this.state.showDatePicker
      ? <View>
          {okCancel(
            () => {
              this.setState({ showDatePicker: !this.state.showDatePicker });
            },
            () => {
              this.props.onTimestampUpdate(this.state.date);

              //

              const {
                repInt,
                repMaxVal,
                repMaxU,
                repMinVal,
                repMinU
              } = this.state;
              if (repInt !== '--') {
                if (
                  repMaxVal !== '-' &&
                  repMaxU !== '-' &&
                  repMinVal !== '-' &&
                  repMinU !== '-' &&
                  parseInt(repMinVal) < parseInt(repMaxVal)
                  // you would also want to make sure the repMaxU is >= repMinU
                ) {
                  // case has min and max repeat rates defined
                  this.props.onTimestampRepIntUpdate(
                    repInt,
                    repMinVal + repMinU,
                    repMaxVal + repMaxU
                  );
                } else if (repMinVal !== '-' && repMinU !== '-') {
                  // case has only min repeat rate defined
                  this.props.onTimestampRepIntUpdate(
                    repInt,
                    repMinVal + repMinU,
                    null
                  );
                }
              } else {
                if (
                  repMaxVal === '-' &&
                  repMaxU === '-' &&
                  repMinVal === '-' &&
                  repMinU === '-'
                ) {
                  this.props.onTimestampRepIntUpdate(null, null, null);
                }
              }

              this.setState({ showDatePicker: !this.state.showDatePicker });
            }
          )}
          <View style={{ flexDirection: 'row' }}>
            <DatePickerIOS
              style={{ height: 150, flex: 12 }}
              date={this.state.date}
              onDateChange={date => this.setState({ date })}
              mode="datetime"
            />
            <Picker
              style={appStyles.container}
              selectedValue={this.state.repInt}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ repInt: itemValue })}>
              <Picker.Item label="--" value="--" />
              <Picker.Item label="+" value="+" />
              <Picker.Item label="++" value="++" />
              <Picker.Item label=".+" value=".+" />
            </Picker>
            {repValPicker('repMinVal')}
            {repUnitsPicker('repMinU')}
            {repValPicker('repMaxVal')}
            {repUnitsPicker('repMaxU')}
          </View>
        </View>
      : <View />;

    const labelStr = `${this.props.label}:`;
    let timestampStr, repIntStr;
    if (timestamp) {
      timestampStr = `${timestamp.year}-${timestamp.month}-${timestamp.date} ${timestamp.day} ${timestamp.hour}:${timestamp.minute}`;
      repIntStr = `${timestamp.repInt || '--'}${timestamp.repMin || '--'}/${timestamp.repMax || '--'}`;
    } else {
      timestampStr = '----------------------';
      repIntStr = '------';
    }

    return (
      <View>
        <Swipeout
          autoClose={true}
          right={[
            {
              text: 'clear',
              backgroundColor: '#bb3333',
              onPress: () => {
                this.props.onTimestampClear();
              }
            }
          ]}>
          <View style={{ flexDirection: 'row', marginLeft: 5 }}>
            <View style={{ flex: 4 }}>
              <Text style={appStyles.baseText}>
                {labelStr}
              </Text>
            </View>
            <TouchableHighlight
              onPress={() => {
                this.setState({ showDatePicker: !this.state.showDatePicker });
              }}
              style={{ flex: 12, flexDirection: 'row' }}>
              <View style={[appStyles.container, { flexDirection: 'row' }]}>
                <View style={{ flex: 2 }}>
                  <Text style={appStyles.baseText}>
                    {timestampStr}
                  </Text>
                </View>
                <View style={appStyles.container}>
                  <Text style={appStyles.baseText}>
                    {repIntStr}
                  </Text>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        </Swipeout>
        {showDatePicker}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgTimestamp);
