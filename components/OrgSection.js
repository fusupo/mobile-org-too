import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  addNewNodePlanning,
  addNewNodePropDrawer,
  addNewNodeLogbook,
  addNewNodeParagraph,
  insertNewNodeProp,
  updateNodeProp,
  removeNodeProp,
  insertNewNodeLogNote,
  updateNodeLogNote,
  removeNodeLogNote,
  updateNodeParagraph
} from '../actions';

import { View, Text, Button, TouchableHighlight } from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  SimpleLineIcons,
  FontAwesome,
  MaterialCommunityIcons,
  Foundation
} from '@expo/vector-icons';

import { getNode } from '../selectors';
import appStyles from '../styles';

import OrgPlanning from '../components/OrgPlanning';
import OrgDrawer from '../components/OrgDrawer';
import OrgLogbook from '../components/OrgLogbook';
import OrgBody from '../components/OrgBody';

const OrgNodeUtil = require('../utilities/OrgNodeUtil');

class OrgSection extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedIndex: 0 };
  }
  render() {
    const {
      bufferID,
      nodeID,
      node,
      tree,
      onAddPlanningPress,
      onAddPropDrawerPress,
      onAddLogbookPress,
      onAddParagraphPress,
      onAddProp,
      onUpdateProp,
      onRemoveProp,
      onAddLogNote,
      onUpdateLogNote,
      onRemoveLogNote,
      onUpdateNodeParagraph
    } = this.props;

    const inactiveButton = icon => {
      return <View style={{ flex: 1, padding: 8 }}>{icon}</View>;
    };

    const activeButton = (icon, action) => {
      return (
        <TouchableHighlight style={{ flex: 1, padding: 8 }} onPress={action}>
          {icon}
        </TouchableHighlight>
      );
    };

    // const toolbar = (
    //   <View>
    //     <TouchableHighlight
    //       style={{ flex: 1, padding: 8 }}
    //       onPress={() => {
    //         onAddParagraphPress(bufferID, nodeID);
    //       }}>
    //       <FontAwesome name="paragraph" size={12} />
    //     </TouchableHighlight>
    //   </View>
    // );
    const toolbar = (
      <View style={{ flexDirection: 'row' }}>
        {OrgNodeUtil.getPlanning(node)
          ? inactiveButton(
              <MaterialIcons
                name="schedule"
                size={12}
                style={{ color: '#999' }}
              />
            )
          : activeButton(<MaterialIcons name="schedule" size={12} />, () => {
              onAddPlanningPress(bufferID, nodeID);
            })}

        {OrgNodeUtil.getPropDrawer(node)
          ? inactiveButton(
              <SimpleLineIcons
                name="drawer"
                size={12}
                style={{ color: '#999' }}
              />
            )
          : activeButton(<SimpleLineIcons name="drawer" size={12} />, () => {
              onAddPropDrawerPress(bufferID, nodeID);
            })}

        {OrgNodeUtil.getLogbook(node)
          ? inactiveButton(
              <FontAwesome name="book" size={12} style={{ color: '#999' }} />
            )
          : activeButton(<FontAwesome name="book" size={12} />, () => {
              onAddLogbookPress(bufferID, nodeID);
            })}

        {activeButton(<FontAwesome name="paragraph" size={12} />, () => {
          onAddParagraphPress(bufferID, nodeID);
        })}

        <TouchableHighlight
          style={{ flex: 1 }}
          onPress={() => console.log('foo')}>
          <MaterialCommunityIcons name="table" size={12} />
        </TouchableHighlight>
        <TouchableHighlight
          style={{ flex: 1 }}
          onPress={() => console.log('foo')}>
          <Foundation name="list" size={12} />
        </TouchableHighlight>
        <TouchableHighlight
          style={{ flex: 1 }}
          onPress={() => console.log('foo')}>
          <FontAwesome name="code" size={12} />
        </TouchableHighlight>
      </View>
    );

    if (node.section) {
      const children = node.section.children.map((c, idx) => {
        let ret = null;
        switch (c.type) {
          case 'org.planning': //  schedule MaterialIcons
            console.log(JSON.stringify(c));
            ret = (
              <View
                key={JSON.stringify(c)}
                style={[appStyles.container, appStyles.border]}>
                <OrgPlanning
                  bufferID={bufferID}
                  nodeID={nodeID}
                  isCollapsed={true}
                />
              </View>
            );
            break;
          case 'org.propDrawer': // drawer SimpleLineIcons
            ret = (
              <View
                key={JSON.stringify(c)}
                style={[appStyles.container, appStyles.border]}>
                <OrgDrawer
                  drawer={OrgNodeUtil.getPropDrawer(node)}
                  isCollapsed={true}
                  onAddProp={onAddProp(bufferID, nodeID)}
                  onUpdateProp={onUpdateProp(bufferID, nodeID)}
                  onRemoveProp={onRemoveProp(bufferID, nodeID)}
                />
              </View>
            );
            break;
          case 'org.logbook': // book FontAwesome
            ret = (
              <View
                key={JSON.stringify(c)}
                style={[appStyles.container, appStyles.border]}>
                <OrgLogbook
                  log={OrgNodeUtil.getLogbook(node)}
                  isCollapsed={true}
                  onAddLogNote={onAddLogNote(bufferID, nodeID)}
                  onUpdateLogNote={onUpdateLogNote(bufferID, nodeID)}
                  onRemoveLogNote={onRemoveLogNote(bufferID, nodeID)}
                />
              </View>
            );
            break;
          case 'org.paragraph': // paragraph FontAwesome
            ret = (
              <View
                key={JSON.stringify(c)}
                style={[appStyles.container, appStyles.border]}>
                <OrgBody
                  onUpdateNodeParagraph={onUpdateNodeParagraph(
                    bufferID,
                    nodeID,
                    idx
                  )}
                  text={c.value.join('\n')}
                />
              </View>
            );
            break;
          // case OrgKeyword.name:  //
          // break;
          // case OrgTable.name:  // table MaterialCommunityIcons
          // break;
          // case OrgPlainList.name:  // list Foundation
          // break;
          // case OrgBlock.name: // code FontAwesome
          // break;
          default:
        }
        return ret;
      });
      return (
        <View style={{ flex: 1 }}>
          {toolbar}
          <View style={{ flex: 1 }}>{children}</View>
        </View>
      );
    } else {
      return <View style={{ flex: 1 }}>{toolbar}</View>;
    }
    // const { data, renderItem } = this.props;
    // let items = data.map((d, idx) => renderItem(d, idx));
    // console.log(
    //   data,
    //   '//////////////////////////////////////////////////////////////////////////////// RENDER LIST'
    // );
  }
}

const mapStateToProps = (state, ownProps) => {
  //const params = ownProps.navigation.state.params;
  const { bufferID, nodeID } = ownProps;
  const tree = state.orgBuffers[bufferID].orgTree;
  const node = getNode(state, bufferID, nodeID);
  return {
    bufferID,
    nodeID,
    node,
    tree
    // isNew
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddPlanningPress: (bufferID, nodeID) => {
      dispatch(addNewNodePlanning(bufferID, nodeID));
    },
    onAddPropDrawerPress: (bufferID, nodeID) => {
      dispatch(addNewNodePropDrawer(bufferID, nodeID));
    },
    onAddLogbookPress: (bufferID, nodeID) => {
      dispatch(addNewNodeLogbook(bufferID, nodeID));
    },
    onAddParagraphPress: (bufferID, nodeID) => {
      dispatch(addNewNodeParagraph(bufferID, nodeID));
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
    onUpdateNodeParagraph: (bufferID, nodeID, idx) => text => {
      dispatch(updateNodeParagraph(bufferID, nodeID, idx, text));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgSection);
