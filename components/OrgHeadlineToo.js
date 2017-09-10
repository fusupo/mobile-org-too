import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Swipeout from 'react-native-swipeout';

import OrgTodoKeywordEditable from './OrgTodoKeywordEditable';

import {
  addNewNode,
  cycleNodeCollapse,
  deleteNode,
  updateNodeHeadlineContent
} from '../actions';

const OrgHeadlineUtil = require('org-parse').OrgHeadline;

import OrgTags from './OrgTagsEditable';

const styles = StyleSheet.create({
  orgNodeWrapper: {
    flexDirection: 'row',
    paddingBottom: 10
  }
});

class OrgHeadline extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      bufferID,
      node,
      nodeID,
      isLocked,
      onNodeTitlePress,
      onDeleteNodePress,
      onAddOnePress
    } = this.props;
    const keyword = node.headline.todoKeyword;
    const tags = node.headline.tags;

    if (isLocked) {
      return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text
            style={{
              backgroundColor: keyword
                ? OrgHeadlineUtil.colorForKeyword(keyword)
                : '#fff'
            }}>
            {keyword ? keyword : 'none'}
          </Text>
          <TouchableHighlight
            style={{ flex: 4 }}
            onPress={() => {
              onNodeTitlePress(bufferID, nodeID);
            }}>
            <Text style={{ color: '#000' }}>{node.headline.content}</Text>
          </TouchableHighlight>
          {tags &&
            <View>
              <Text>{tags.join(':')}</Text>
            </View>}
        </View>
      );
    } else {
      return (
        <Swipeout
          style={{ flex: 1 }}
          right={[
            {
              text: 'deleteNode',
              onPress: () => {
                onDeleteNodePress(bufferID, nodeID);
              }
            }
          ]}
          left={[
            {
              text: 'addOne',
              onPress: () => {
                onAddOnePress(bufferID, nodeID, node);
              }
            }
          ]}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <OrgTodoKeywordEditable
              keyword={keyword}
              nodeID={nodeID}
              bufferID={bufferID}
            />
            <TouchableHighlight
              style={{ flex: 4 }}
              onPress={() => {
                onNodeTitlePress(bufferID, nodeID);
              }}>
              <Text style={{ color: '#000' }}>{node.headline.content}</Text>
            </TouchableHighlight>
            <View style={{ flex: 1 }}>
              <OrgTags bufferID={bufferID} nodeID={node.id} />
            </View>
          </View>
        </Swipeout>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID } = ownProps;
  const node = state.orgBuffers[bufferID].orgNodes[nodeID];

  return {
    node
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onNodeTitlePress: (bufferID, nodeID) => {
      dispatch(
        NavigationActions.navigate({
          routeName: 'NodeDetail',
          params: {
            bufferID,
            nodeID
          }
        })
      );
    },
    onDeleteNodePress: (bufferID, nodeID) => {
      dispatch(deleteNode(bufferID, nodeID));
    },
    onAddOnePress: (bufferID, nodeID, node) => {
      dispatch(addNewNode(bufferID, nodeID, node.headline.level + 1));
    },
    onNodeArrowPress: (bufferID, nodeID) => {
      dispatch(cycleNodeCollapse(bufferID, nodeID));
    },
    onHeadlineEndEditing: (bufferID, nodeID, text) => {
      dispatch(updateNodeHeadlineContent(bufferID, nodeID, text));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgHeadline);
