import React from 'react';
import { connect } from 'react-redux';
import {
  addNewNode,
  cycleNodeCollapse,
  deleteNode,
  insertNewNodeProp,
  updateNodeProp,
  removeNodeProp,
  insertNewNodeLogNote,
  updateNodeLogNote,
  removeNodeLogNote,
  updateNodeBody
} from '../actions';

import { NavigationActions } from 'react-navigation';

import {
  ActionSheetIOS,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import OrgHeadlineEditable from '../components/OrgHeadlineEditable';
import OrgPlanning from '../components/OrgPlanning';
import OrgDrawer from '../components/OrgDrawer';
import OrgLogbook from '../components/OrgLogbook';
import OrgBody from '../components/OrgBody';
import OrgList from '../components/OrgList';
import SplitPane from '../components/SplitPane';

import { findBranch, timestampStringNow } from '../utilities/utils';
const OrgNodeUtil = require('../utilities/OrgNodeUtil');

//const OrgTreeUtil = require('org-parse').OrgTree;
/* const OrgTimestampUtil = require('org-parse').OrgTimestamp;*/

import appStyles from '../styles';

class NodeDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      childListIsLocked: true
    };
  }
  render() {
    const {
      tree,
      bufferID,
      nodeID,
      node,
      onPressDeleteNode,
      onAddProp,
      onUpdateProp,
      onRemoveProp,
      onAddLogNote,
      onUpdateLogNote,
      onRemoveLogNote,
      onUpdateNodeBody,
      onAddOnePress,
      isNew
    } = this.props;
    if (node) {
      // childNodes
      console.log('NODE DETAILS RENDER', tree, nodeID);
      const children = findBranch(tree, nodeID).children;
      let list = null;
      if (children && children.length > 0) {
        list = (
          <ScrollView
            style={[
              appStyles.container,
              { flex: 1, margin: 10, marginBottom: 40 }
            ]}>
            <OrgList
              data={children}
              bufferID={bufferID}
              isLocked={this.state.childListIsLocked}
            />
          </ScrollView>
        );
      }

      return (
        <View style={appStyles.container}>
          <SplitPane
            viewA={
              <ScrollView style={appStyles.container}>
                <View
                  style={[
                    appStyles.container,
                    appStyles.border,
                    { marginTop: 20 }
                  ]}>
                  <OrgHeadlineEditable
                    bufferID={bufferID}
                    nodeID={nodeID}
                    autoFocus={isNew}
                  />
                </View>
                <View style={[appStyles.container, appStyles.border]}>
                  <OrgPlanning
                    bufferID={bufferID}
                    nodeID={nodeID}
                    isCollapsed={true}
                  />
                </View>
                <View style={[appStyles.container, appStyles.border]}>
                  <OrgDrawer
                    drawer={OrgNodeUtil.getPropDrawer(node)}
                    isCollapsed={true}
                    onAddProp={onAddProp(bufferID, nodeID)}
                    onUpdateProp={onUpdateProp(bufferID, nodeID)}
                    onRemoveProp={onRemoveProp(bufferID, nodeID)}
                  />
                </View>
                <View style={[appStyles.container, appStyles.border]}>
                  <OrgLogbook
                    log={OrgNodeUtil.getLogbook(node)}
                    isCollapsed={true}
                    onAddLogNote={onAddLogNote(bufferID, nodeID)}
                    onUpdateLogNote={onUpdateLogNote(bufferID, nodeID)}
                    onRemoveLogNote={onRemoveLogNote(bufferID, nodeID)}
                  />
                </View>
                <View style={[appStyles.container, appStyles.border]}>
                  <OrgBody
                    onUpdateNodeBody={onUpdateNodeBody(bufferID, nodeID)}
                    bodyText={node.body}
                  />
                </View>
              </ScrollView>
            }
            viewB={
              <View style={{ flex: 1 }}>
                <TouchableHighlight
                  onPress={() => {
                    this.setState({
                      childListIsLocked: !this.state.childListIsLocked
                    });
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#cccccc'
                    }}>
                    <Ionicons
                      style={{ flex: 1 }}
                      name={
                        this.state.childListIsLocked ? 'md-lock' : 'md-unlock'
                      }
                      size={20}
                      style={{ marginLeft: 5 }}
                    />
                    {!this.state.childListIsLocked && (
                      <Button
                        onPress={() => {
                          onAddOnePress(bufferID, nodeID, node);
                        }}
                        title="Add Child"
                        color="#841584"
                        accessibilityLabel="add child node"
                      />
                    )}
                  </View>
                </TouchableHighlight>
                {list}
              </View>
            }
          />
          <Button
            onPress={() => {
              ActionSheetIOS.showActionSheetWithOptions(
                {
                  options: ['confirm', 'cancel']
                },
                idx => {
                  if (idx === 0) {
                    onPressDeleteNode(bufferID, nodeID);
                  }
                }
              );
            }}
            title="DeleteNode"
            color="#841584"
            accessibilityLabel="delete this node"
          />
        </View>
      );
    } else {
      return (
        <View>
          <Text>{'node is gone '}</Text>
        </View>
      );
    }
  }
}

////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = (state, ownProps) => {
  const params = ownProps.navigation.state.params;
  const { bufferID, nodeID, isNew } = params;
  const nodes = state.orgBuffers[bufferID].orgNodes;
  const tree = state.orgBuffers[bufferID].orgTree;
  const node = nodes[nodeID];
  console.log('STATE', state);
  return {
    bufferID,
    nodeID,
    node,
    tree,
    isNew
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onNodeArrowClick: bufferID => {
      return nodeID => {
        dispatch(cycleNodeCollapse(bufferID, nodeID));
      };
    },
    onNodeTitleClick: bufferID => {
      return nodeID => {
        dispatch(
          NavigationActions.navigate({
            routeName: 'NodeDetail',
            params: { bufferID, nodeID }
          })
        );
      };
    },
    onPressDeleteNode: (bufferID, nodeID) => {
      dispatch(deleteNode(bufferID, nodeID));
    },
    onAddProp: (bufferID, nodeID) => () => {
      dispatch(insertNewNodeProp(bufferID, nodeID));
    },
    onUpdateProp: (bufferID, nodeID) => (idx, oldPropKey, propKey, propVal) => {
      dispatch(
        updateNodeProp(bufferID, nodeID, idx, oldPropKey, propKey, propVal)
      );
    },
    onRemoveProp: (bufferID, nodeID) => propKey => {
      dispatch(removeNodeProp(bufferID, nodeID, propKey));
    },
    onAddLogNote: (bufferID, nodeID) => () => {
      const nowStr = timestampStringNow(); //OrgTimestampUtil.serialize(OrgTimestampUtil.now());
      dispatch(insertNewNodeLogNote(bufferID, nodeID, nowStr));
    },
    onUpdateLogNote: (bufferID, nodeID) => (idx, text) => {
      dispatch(updateNodeLogNote(bufferID, nodeID, idx, text));
    },
    onRemoveLogNote: (bufferID, nodeID) => idx => {
      dispatch(removeNodeLogNote(bufferID, nodeID, idx));
    },
    onUpdateNodeBody: (bufferID, nodeID) => text => {
      dispatch(updateNodeBody(bufferID, nodeID, text));
    },
    onAddOnePress: (bufferID, nodeID, node) => {
      console.log(node);
      dispatch(addNewNode(bufferID, nodeID, node.stars + 1));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeDetailScreen);
