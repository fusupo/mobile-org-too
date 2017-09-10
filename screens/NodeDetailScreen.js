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
import OrgScheduling from '../components/OrgScheduling';
import OrgDrawer from '../components/OrgDrawer';
import OrgLogbook from '../components/OrgLogbook';
import OrgBody from '../components/OrgBody';
import OrgList from '../components/OrgList';
import SplitPane from '../components/SplitPane';

const OrgTreeUtil = require('org-parse').OrgTree;
const OrgTimestampUtil = require('org-parse').OrgTimestamp;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  border: {
    borderWidth: 1,
    borderStyle: 'solid',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5
  }
});

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
      const children = OrgTreeUtil.findBranch(tree, nodeID).children;
      let list = null;
      if (children.length > 0) {
        list = (
          <ScrollView style={{ flex: 1, margin: 10, marginBottom: 40 }}>
            <OrgList
              data={children}
              bufferID={bufferID}
              isLocked={this.state.childListIsLocked}
            />
          </ScrollView>
        );
      }

      return (
        <View style={styles.container}>
          <SplitPane
            viewA={
              <ScrollView style={styles.container}>
                <View
                  style={[styles.container, styles.border, { marginTop: 20 }]}>
                  <OrgHeadlineEditable
                    bufferID={bufferID}
                    nodeID={nodeID}
                    autoFocus={isNew}
                  />
                </View>
                <View style={[styles.container, styles.border]}>
                  <OrgScheduling
                    bufferID={bufferID}
                    nodeID={nodeID}
                    isCollapsed={true}
                  />
                </View>
                <View style={[styles.container, styles.border]}>
                  <OrgDrawer
                    drawer={node.propDrawer}
                    isCollapsed={true}
                    onAddProp={onAddProp(bufferID, nodeID)}
                    onUpdateProp={onUpdateProp(bufferID, nodeID)}
                    onRemoveProp={onRemoveProp(bufferID, nodeID)}
                  />
                </View>
                <View style={[styles.container, styles.border]}>
                  <OrgLogbook
                    log={node.logbook}
                    isCollapsed={true}
                    onAddLogNote={onAddLogNote(bufferID, nodeID)}
                    onUpdateLogNote={onUpdateLogNote(bufferID, nodeID)}
                    onRemoveLogNote={onRemoveLogNote(bufferID, nodeID)}
                  />
                </View>
                <View style={[styles.container, styles.border]}>
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
                    {!this.state.childListIsLocked &&
                      <Button
                        onPress={() => {
                          onAddOnePress(bufferID, nodeID, node);
                        }}
                        title="Add Child"
                        color="#841584"
                        accessibilityLabel="add child node"
                      />}
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
      return <View><Text>{'node is gone '}</Text></View>;
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
    onUpdateProp: (bufferID, nodeID) => (idx, propKey, propVal) => {
      dispatch(updateNodeProp(bufferID, nodeID, idx, propKey, propVal));
    },
    onRemoveProp: (bufferID, nodeID) => propKey => {
      dispatch(removeNodeProp(bufferID, nodeID, propKey));
    },
    onAddLogNote: (bufferID, nodeID) => () => {
      const nowStr = OrgTimestampUtil.serialize(OrgTimestampUtil.now());
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
      dispatch(addNewNode(bufferID, nodeID, node.headline.level + 1));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeDetailScreen);
