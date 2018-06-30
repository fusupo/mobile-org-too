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
  updateSectionItemIndex,
  removeSectionItemAtIndex
} from '../actions';

import { View, Text, Button, FlatList, TouchableHighlight } from 'react-native';
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

import OrgTable from '../components/OrgTable';
import OrgPlainList from '../components/OrgPlainList';
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
    this.state = { selectedIndex: 0, isLocked: true };
    this.myRef = React.createRef();
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
      onRowMoved,
      onRowRemove
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
        <TouchableHighlight
          onPress={() => {
            this.setState({ isLocked: !this.state.isLocked });
          }}>
          <View style={{}}>
            <Ionicons
              name={this.state.isLocked ? 'md-lock' : 'md-unlock'}
              size={20}
              style={{ marginLeft: 5 }}
            />
          </View>
        </TouchableHighlight>

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
      const data = node.section.children.reduce((m, c, idx) => {
        c.isLocked = false;
        m[JSON.stringify(c) + '-' + idx] = c;
        return m;
      }, {});

      const order = Object.keys(data);

      return (
        <View style={{ flex: 1 }}>
          {toolbar}
          {this.state.isLocked ? (
            <FlatList
              style={{ flex: 1 }}
              data={Object.entries(data)}
              keyExtractor={(item, idx) => {
                return item[1].type + idx;
              }}
              renderItem={(({ item }, x, y, z) => {
                let b = item[0];
                let row = item[1];
                console.log(b[b.length - 1]);
                return (
                  <RowComponent
                    idx={parseInt(b[b.length - 1])}
                    c={row}
                    data={row}
                    node={node}
                    nodeID={nodeID}
                    bufferID={bufferID}
                    isLocked={true}
                    onRemoveSectionItem={idx => () => {
                      console.log('no-op');
                    }}
                    eventHandlers={{
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
              }).bind(this)}
            />
          ) : (
            <SortableListView
              limitScrolling={true}
              style={{ flex: 1 }}
              data={data}
              order={order}
              onRowMoved={onRowMoved(bufferID, nodeID)}
              renderRow={((row, a, b, c) => {
                const idx = parseInt(b[b.length - 1]);
                return (
                  <RowComponent
                    idx={idx}
                    key={b}
                    c={row}
                    data={row}
                    node={node}
                    nodeID={nodeID}
                    bufferID={bufferID}
                    isLocked={false}
                    onRemoveSectionItem={() => {
                      onRowRemove(bufferID, nodeID, idx);
                    }}
                    eventHandlers={{
                      onAddProp: onAddProp(bufferID, nodeID),
                      onUpdateProp: onUpdateProp(bufferID, nodeID),
                      onRemoveProp: onRemoveProp(bufferID, nodeID),
                      onAddLogNote: onAddLogNote(bufferID, nodeID),
                      onUpdateLogNote: onUpdateLogNote(bufferID, nodeID),
                      onRemoveLogNote: onRemoveLogNote(bufferID, nodeID),
                      onUpdateNodeParagraph: onUpdateNodeParagraph(
                        bufferID,
                        nodeID,
                        idx
                      )
                    }}
                  />
                );
              }).bind(this)}
            />
          )}
        </View>
      );
    } else {
      return <View style={{ flex: 1 }}>{toolbar}</View>;
    }
  }
}

const eoo = (sortHandlers, isLocked, onRemoveSectionItem) => bar => {
  if (isLocked) {
    return bar;
  } else {
    return (
      <TouchableHighlight
        underlayColor={'#eee'}
        style={{
          // paddingRight: 50, //25,
          backgroundColor: '#F8F8F8',
          // borderBottomWidth: 1,
          borderColor: '#eee'
        }}
        {...sortHandlers}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableHighlight style={{ flex: 1 }} onPress={onRemoveSectionItem}>
            <Text>{'remove'}</Text>
          </TouchableHighlight>
          <View style={{ flex: 2 }}>{bar}</View>
          <View style={{ flex: 1 }}>
            <Text>{'move'}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
};

class RowComponent extends React.Component {
  render() {
    let ret = null;
    let {
      key,
      c,
      isLocked,
      node,
      bufferID,
      nodeID,
      sortHandlers,
      eventHandlers,
      onRemoveSectionItem,
      idx
    } = this.props;
    let foo = eoo(sortHandlers, isLocked, onRemoveSectionItem);
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
              isCollapsed={true}
            />
          </View>
        );
        break;
      case 'org.plainList': // list Foundation
        ret = foo(
          <View key={key} style={[appStyles.container, appStyles.border]}>
            <OrgPlainList
              bufferID={bufferID}
              nodeID={nodeID}
              {...eventHandlers}
              items={c.items}
              isCollapsed={true}
            />
          </View>
        );
        break;
      case 'org.table': // table MaterialCommunityIcons
        console.log(c);
        ret = foo(
          <View key={key} style={[appStyles.container, appStyles.border]}>
            <OrgTable
              bufferID={bufferID}
              nodeID={nodeID}
              {...eventHandlers}
              table={c}
              isCollapsed={true}
            />
          </View>
        );
        break;
      // case OrgKeyword.name:  //
      // break;
      // case OrgBlock.name: // code FontAwesome
      // break;
      default:
        console.log('unhandled row type', c.type);
        break;
    }
    return ret;
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
    },
    onRowRemove: (bufferID, nodeID, idx) => {
      console.log('suckit', bufferID, nodeID, idx);
      dispatch(removeSectionItemAtIndex(bufferID, nodeID, idx));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgSection);
