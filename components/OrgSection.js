import React, { Component } from 'react';
import { connect } from 'react-redux';

import SortableListView from 'react-native-sortable-listview';

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
  updateNodeParagraph,
  updateSectionItemIndex
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
const OrgTimestampUtil = require('../utilities/OrgTimestampUtil');
import timestampStringNow from '../utilities/utils';

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
      onUpdateNodeParagraph,
      onRowMoved
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

    if (node.section && node.section.children) {
      // const children = node.section.children.map((c, idx) => {
      // });

      const data = node.section.children.reduce((m, c, idx) => {
        m[c.type + '-' + idx] = c;
        return m;
      }, {});

      const order = Object.keys(data);

      return (
        <View style={{ flex: 1 }}>
          {toolbar}
          <SortableListView
            limitScrolling={true}
            style={{ flex: 1 }}
            data={data}
            order={order}
            onRowMoved={onRowMoved(bufferID, nodeID)}
            renderRow={(row, a, b, c) => {
              console.log('RENDER ROW', a, b, c);
              return (
                <RowComponent
                  key={b}
                  c={row}
                  data={row}
                  node={node}
                  nodeID={nodeID}
                  bufferID={bufferID}
                  eventHandlers={{
                    // onAddPlanningPress: onAddPlanningPress(bufferID, nodeID),
                    // onAddPropDrawerPress: onAddPropDrawerPress(
                    //   bufferID,
                    //   nodeID
                    // ),
                    // onAddLogbookPress: onAddLogbookPress(bufferID, nodeID),
                    // onAddParagraphPress: onAddParagraphPress(bufferID, nodeID),
                    onAddProp: onAddProp(bufferID, nodeID),
                    onUpdateProp: onUpdateProp(bufferID, nodeID),
                    onRemoveProp: onRemoveProp(bufferID, nodeID),
                    onAddLogNote: onAddLogNote(bufferID, nodeID),
                    onUpdateLogNote: onUpdateLogNote(bufferID, nodeID),
                    onRemoveLogNote: onRemoveLogNote(bufferID, nodeID),
                    onUpdateNodeParagraph: onUpdateNodeParagraph(
                      bufferID,
                      nodeID,
                      parseInt(b[b.length - 1])
                    )
                  }}
                />
              );
            }}
          />
        </View>
      );

      // return (
      //   <View style={{ flex: 1 }}>
      //     {toolbar}
      //     <View style={{ flex: 1 }}>{children}</View>
      //   </View>
      // );
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

const eoo = sortHandlers => bar => {
  return (
    <TouchableHighlight
      underlayColor={'#eee'}
      style={{
        // paddingTop: 10, //25,
        backgroundColor: '#F8F8F8',
        // borderBottomWidth: 1,
        borderColor: '#eee'
      }}
      {...sortHandlers}>
      {bar}
    </TouchableHighlight>
  );
};

class RowComponent extends React.Component {
  render() {
    let ret = null;
    let {
      key,
      c,
      node,
      bufferID,
      nodeID,
      sortHandlers,
      eventHandlers
    } = this.props;
    let foo = eoo(sortHandlers);
    switch (c.type) {
      case 'org.planning': //  schedule MaterialIcons
        ret = foo(
          <View key={key} style={[appStyles.container, appStyles.border]}>
            <OrgPlanning
              bufferID={bufferID}
              nodeID={nodeID}
              isCollapsed={true}
            />
          </View>
        );
        break;
      case 'org.propDrawer': // drawer SimpleLineIcons
        ret = foo(
          <View key={key} style={[appStyles.container, appStyles.border]}>
            <OrgDrawer
              drawer={OrgNodeUtil.getPropDrawer(node)}
              isCollapsed={true}
              // onAddProp={onAddProp(bufferID, nodeID)}
              // onUpdateProp={onUpdateProp(bufferID, nodeID)}
              // onRemoveProp={onRemoveProp(bufferID, nodeID)}
              {...eventHandlers}
            />
          </View>
        );
        break;
      case 'org.logbook': // book FontAwesome
        ret = foo(
          <View key={key} style={[appStyles.container, appStyles.border]}>
            <OrgLogbook
              log={OrgNodeUtil.getLogbook(node)}
              isCollapsed={true}
              // onAddLogNote={onAddLogNote(bufferID, nodeID)}
              // onUpdateLogNote={onUpdateLogNote(bufferID, nodeID)}
              // onRemoveLogNote={onRemoveLogNote(bufferID, nodeID)}
              {...eventHandlers}
            />
          </View>
        );
        break;
      case 'org.paragraph': // paragraph FontAwesome
        ret = foo(
          <View key={key} style={[appStyles.container, appStyles.border]}>
            <OrgBody
              // onUpdateNodeParagraph={onUpdateNodeParagraph(
              //   bufferID,
              //   nodeID,
              //   idx
              // )}
              {...eventHandlers}
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
    // return (
    //   <TouchableHighlight
    //     underlayColor={'#eee'}
    //     style={{
    //       padding: 25,
    //       backgroundColor: '#F8F8F8',
    //       borderBottomWidth: 1,
    //       borderColor: '#eee'
    //     }}
    //     {...this.props.sortHandlers}>
    //     <Text>{this.props.data.text}</Text>
    //   </TouchableHighlight>
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
      const nowStr = OrgTimestampUtil.serialize(OrgTimestampUtil.now());
      // console.log(nowStr);
      // console.log('funk');
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
    },
    onRowMoved: (bufferID, nodeID) => e => {
      dispatch(updateSectionItemIndex(bufferID, nodeID, e.from, e.to));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgSection);
