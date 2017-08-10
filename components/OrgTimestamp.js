import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  TouchableHighlight,
  StyleSheet,
  Text,
  TextInput,
  View,
  DatePickerIOS,
  Button,
  ActionSheetIOS,
  Picker
} from 'react-native';

const orgHeadlineUtil = require('org-parse').OrgHeadline;

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
          <View style={{ flex: 1 }}>
            <Button title={'Cancel'} onPress={onCancelPress} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title={'OK'} onPress={onOkPress} />
          </View>
        </View>
      );
    };

    const showDatePicker = this.state.showDatePicker
      ? <View>
          <DatePickerIOS
            style={{ height: 200 }}
            date={this.state.date}
            onDateChange={date => this.setState({ date })}
            mode="datetime"
          />
          {okCancel(
            () => {
              this.setState({ showDatePicker: !this.state.showDatePicker });
            },
            () => {
              this.props.onTimestampUpdate(this.state.date);
              this.setState({ showDatePicker: !this.state.showDatePicker });
            }
          )}
        </View>
      : <View />;

    const repUnitsPicker = selectedVal => (
      <Picker
        style={{ flex: 1 }}
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
          style={{ flex: 1 }}
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
          <View style={{ flexDirection: 'row' }}>
            <Picker
              style={{ flex: 1 }}
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
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <TouchableHighlight
              onPress={() => {
                // this.setState({ showDatePicker: !this.state.showDatePicker });
                this.props.onTimestampClear();
              }}>
              <Text
                style={{
                  fontFamily: 'space-mono',
                  fontSize: 12
                }}>
                {'X'}
              </Text>
            </TouchableHighlight>
          </View>
          <View style={{ flex: 4 }}>
            <Text
              style={{
                fontFamily: 'space-mono',
                fontSize: 12
              }}>
              {labelStr}
            </Text>
          </View>
          <View style={{ flex: 8 }}>
            <TouchableHighlight
              onPress={() => {
                this.setState({ showDatePicker: !this.state.showDatePicker });
              }}>
              <Text
                style={{
                  fontFamily: 'space-mono',
                  fontSize: 12
                }}>
                {timestampStr}
              </Text>
            </TouchableHighlight>
          </View>
          <View style={{ flex: 4 }}>
            <TouchableHighlight
              onPress={() => {
                if (timestamp) {
                  this.setState({
                    showRepIntPicker: !this.state.showRepIntPicker
                  });
                } else {
                  this.setState({
                    showDatePicker: !this.state.showDatePicker
                  });
                }
              }}>
              <Text
                style={{
                  fontFamily: 'space-mono',
                  fontSize: 12
                }}>
                {repIntStr}
              </Text>
            </TouchableHighlight>
          </View>
        </View>
        {showDatePicker}
        {showRepIntPicker}
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
