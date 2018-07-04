import React from 'react';
import {
  Button,
  StyleSheet,
  TouchableHighlight,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import OrgList from '../components/OrgList';
import OrgSection from '../components/OrgSection';

import appStyles from '../styles';

// const styles = StyleSheet.create({
//   txt: {
//     textAlign: 'left',
//     fontSize: 14
//   },
//   border: {
//     borderTopWidth: 1,
//     borderStyle: 'solid',
//     paddingLeft: 5
//   },
//   padded: {
//     paddingLeft: 5
//   }
// });

export class OrgBuffer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true,
      sectionIsCollapsed: true,
      sectionIsLocked: true
    };
  }

  _toggleSectionCollapse() {
    this.setState({ sectionIsCollapsed: !this.state.sectionIsCollapsed });
  }

  _toggleSectionLock() {
    this.setState({ sectionIsLocked: !this.state.sectionIsLocked });
  }

  render() {
    const { bufferID, tree } = this.props;
    const { isCollapsed, sectionIsCollapsed, sectionIsLocked } = this.state;

    let childList = null;
    let section = null;

    if (!isCollapsed) {
      childList = (
        <OrgList
          data={tree.headlines}
          bufferID={bufferID}
          isLocked={this.props.isLocked}
        />
      );
    }

    section = (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableHighlight
            style={{ flex: 1 }}
            onPress={this._toggleSectionCollapse.bind(this)}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#cccccc'
              }}>
              <Ionicons
                name={
                  sectionIsCollapsed ? 'ios-construct-outline' : 'ios-construct'
                }
                size={20}
                style={{ marginLeft: 5 }}
              />
            </View>
          </TouchableHighlight>
          {sectionIsCollapsed ? null : (
            <TouchableHighlight onPress={this._toggleSectionLock.bind(this)}>
              <View style={{ marginRight: 5 }}>
                <Ionicons
                  size={20}
                  name={sectionIsLocked ? 'md-lock' : 'md-unlock'}
                  style={{ marginLeft: 5 }}
                />
              </View>
            </TouchableHighlight>
          )}
        </View>
        {sectionIsCollapsed ? null : (
          <View
            style={{
              borderRadius: 4,
              borderWidth: 0.5,
              borderColor: '#333',
              padding: 10
            }}>
            <OrgSection bufferID={bufferID} nodeID={null} />
          </View>
        )}
      </View>
    );

    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableHighlight
            style={{ flex: 4 }}
            onPress={() => {
              this.setState({ isCollapsed: !this.state.isCollapsed });
            }}>
            <Text
              style={[
                appStyles.baseText,
                { backgroundColor: '#000', color: '#fff' }
              ]}>
              {bufferID}
            </Text>
          </TouchableHighlight>
          {!this.props.isLocked && (
            <Button
              onPress={() => {
                this.props.onAddOne(bufferID);
              }}
              title="Add Child"
              color="#841584"
              accessibilityLabel="add child node"
            />
          )}
        </View>
        {isCollapsed ? null : section}
        {childList}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  if (ownProps.bufferID) {
    const bufferID = ownProps.bufferID;
    return {
      bufferID: bufferID,
      tree: state.orgBuffers[bufferID].orgTree
    };
  } else {
    return {
      tree: {}
    };
  }
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgBuffer);
