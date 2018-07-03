import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import R from 'ramda';

import OrgHeadline from './OrgHeadlineToo';
import List from './List';
import Tree from './Tree';

import appStyles from '../styles';

import OrgTable from '../components/OrgTable';
import OrgPlainList from '../components/OrgPlainList';
import OrgPlanning from '../components/OrgPlanning';
import OrgDrawer from '../components/OrgDrawer';
import OrgLogbook from '../components/OrgLogbook';
import OrgBody from '../components/OrgBody';

const OrgNodeUtil = require('../utilities/OrgNodeUtil');

export default class OrgSectionElementHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true,
      isLocked: true
    };
  }

  _toggleCollapse() {
    const { isCollapsed } = this.state;
    if (isCollapsed) {
      this.setState({ isCollapsed: !isCollapsed });
    } else {
      this.setState({ isCollapsed: !isCollapsed, isLocked: true });
    }
  }

  _toggleLock() {
    this.setState({ isLocked: !this.state.isLocked });
  }

  render() {
    const { idx, data, node, bufferID, nodeID } = this.props;
    const { isCollapsed, isLocked } = this.state;

    let ret, iconName;

    switch (data.type) {
      case 'org.planning': //  schedule MaterialIcons
        iconName = isCollapsed ? 'ios-alarm-outline' : 'ios-alarm';
        ret = (
          <View style={[appStyles.container, appStyles.border]}>
            <OrgPlanning
              bufferID={bufferID}
              nodeID={nodeID}
              isCollapsed={isCollapsed}
              isLocked={isLocked}
            />
          </View>
        );
        break;
      case 'org.propDrawer': // drawer SimpleLineIcons
        iconName = isCollapsed ? 'ios-briefcase-outline' : 'ios-briefcase';
        ret = (
          <View style={[appStyles.container, appStyles.border]}>
            <OrgDrawer
              bufferID={bufferID}
              nodeID={nodeID}
              drawer={OrgNodeUtil.getPropDrawer(node)}
              isCollapsed={isCollapsed}
              isLocked={isLocked}
            />
          </View>
        );
        break;
      case 'org.logbook': // book FontAwesome
        iconName = isCollapsed ? 'ios-recording-outline' : 'ios-recording';
        ret = (
          <View style={[appStyles.container, appStyles.border]}>
            <OrgLogbook
              bufferID={bufferID}
              nodeID={nodeID}
              log={OrgNodeUtil.getLogbook(node)}
              isCollapsed={isCollapsed}
              isLocked={isLocked}
            />
          </View>
        );
        break;
      case 'org.paragraph': // paragraph FontAwesome
        iconName = isCollapsed ? 'ios-book-outline' : 'ios-book';
        ret = (
          <View style={[appStyles.container, appStyles.border]}>
            <OrgBody
              idx={idx} // this is suboptimal
              bufferID={bufferID}
              nodeID={nodeID}
              text={data.value.join('\n')}
              isCollapsed={isCollapsed}
              isLocked={isLocked}
            />
          </View>
        );
        break;
      case 'org.plainList': // list Foundation
        // iconName = isCollapsed ? 'ios-list-box-outline' : 'ios-list-box';
        iconName = isCollapsed ? 'ios-list-outline' : 'ios-list';
        ret = (
          <View style={[appStyles.container, appStyles.border]}>
            <OrgPlainList
              bufferID={bufferID}
              nodeID={nodeID}
              items={data.items}
              isCollapsed={isCollapsed}
              isLocked={isLocked}
            />
          </View>
        );
        break;
      case 'org.table': // table MaterialCommunityIcons
        iconName = isCollapsed ? 'ios-grid-outline' : 'ios-grid';
        ret = (
          <View style={[appStyles.container, appStyles.border]}>
            <OrgTable
              bufferID={bufferID}
              nodeID={nodeID}
              table={data}
              isCollapsed={isCollapsed}
              isLocked={isLocked}
            />
          </View>
        );
        break;
      // case OrgKeyword.name:  //
      // break;
      // case OrgBlock.name: // code FontAwesome
      // break;
      default:
        console.log('unhandled row type', data.type);
        break;
    }

    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableHighlight
            style={{ flex: 1 }}
            onPress={this._toggleCollapse.bind(this)}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#cccccc'
              }}>
              <Ionicons name={iconName} size={20} style={{ marginLeft: 5 }} />
            </View>
          </TouchableHighlight>
          {isCollapsed ? null : (
            <TouchableHighlight onPress={this._toggleLock.bind(this)}>
              <View style={{ marginRight: 5 }}>
                <Ionicons
                  size={20}
                  name={isLocked ? 'md-lock' : 'md-unlock'}
                  style={{ marginLeft: 5 }}
                />
              </View>
            </TouchableHighlight>
          )}
        </View>
        {isCollapsed ? null : ret}
      </View>
    );
  }
}
