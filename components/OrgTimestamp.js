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
  ActionSheetIOS
} from 'react-native';

const orgHeadlineUtil = require('org-parse').OrgHeadline;

class OrgTimestamp extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   content: props.headline.content
    // };
    this.state = {
      date: new Date(),
      showDatePicker: false
    };
  }

  render() {
    const timestamp = this.props.timestamp;
    var showDatePicker = this.state.showDatePicker
      ? <View>
          <DatePickerIOS
            style={{ height: 200 }}
            date={this.state.date}
            onDateChange={date => this.setState({ date })}
            mode="datetime"
          />
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Button
                title={'Cancel'}
                onPress={() => {
                  this.setState({ showDatePicker: !this.state.showDatePicker });
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                title={'OK'}
                onPress={() => {
                  this.props.onTimestampUpdate(this.state.date);
                  this.setState({ showDatePicker: !this.state.showDatePicker });
                }}
              />
            </View>
          </View>
        </View>
      : <View />;
    return timestamp
      ? <View>
          <TouchableHighlight
            onPress={() => {
              this.setState({ showDatePicker: !this.state.showDatePicker });
            }}>
            <Text
              style={{
                fontFamily: 'space-mono',
                fontSize: 12
              }}>
              {`${this.props.label}: ${timestamp.year}-${timestamp.month}-${timestamp.date} ${timestamp.day} ${timestamp.hour}:${timestamp.minute} ${timestamp.repInt}${timestamp.repMin}${timestamp.repMax !== null ? '/' + timestamp.repMax : ''}`}
            </Text>
          </TouchableHighlight>
          {showDatePicker}
        </View>
      : null;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgTimestamp);
