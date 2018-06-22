import React from 'react';
import { connect } from 'react-redux';
import { addNewNode, cycleNodeCollapse, deleteNode } from '../actions';

import { NavigationActions } from 'react-navigation';

import {
  ActionSheetIOS,
  Button,
  ScrollView,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import OrgHeadlineEditable from '../components/OrgHeadlineEditable';
import OrgList from '../components/OrgList';
import SplitPane from '../components/SplitPane';
import OrgSection from '../components/OrgSection';

import { findBranch } from '../utilities/utils';

import { getNode } from '../selectors';

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
      onAddOnePress,
      isNew
    } = this.props;
    if (node) {
      // childNodes
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
          <View style={[appStyles.border, { marginTop: 20, height: 40 }]}>
            <OrgHeadlineEditable
              bufferID={bufferID}
              nodeID={nodeID}
              autoFocus={isNew}
            />
          </View>
          <SplitPane
            viewA={
              <ScrollView style={appStyles.container}>
                <OrgSection bufferID={bufferID} nodeID={nodeID} />
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
  const tree = state.orgBuffers[bufferID].orgTree;
  const node = getNode(state, bufferID, nodeID);
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
    onAddOnePress: (bufferID, nodeID, node) => {
      //console.log(node);
      dispatch(addNewNode(bufferID, nodeID, node.stars + 1));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeDetailScreen);
