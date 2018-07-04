import React, { Component } from 'react';
import { connect } from 'react-redux';

import SortableListView from 'react-native-sortable-listview';

import {
  addNewNodePlanning,
  addNewNodePropDrawer,
  addNewNodeLogbook,
  addNewNodeParagraph,
  updateSectionItemIndex,
  removeSectionItemAtIndex
} from '../actions';

import { View, Text, FlatList, TouchableHighlight } from 'react-native';
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

import OrgSectionElementHeader from './OrgSectionElementHeader';

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
      onRowMoved,
      onRowRemove
    } = this.props;

    const entity = node || tree;

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

        {OrgNodeUtil.getPlanning(entity)
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

        {OrgNodeUtil.getPropDrawer(entity)
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

        {OrgNodeUtil.getLogbook(entity)
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

    if (entity.section && entity.section.children) {
      const data = entity.section.children.reduce((m, c, idx) => {
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
                return (
                  <RowComponent
                    idx={parseInt(b[b.length - 1])}
                    c={row}
                    data={row}
                    nodeID={nodeID}
                    bufferID={bufferID}
                    isLocked={true}
                    onRemoveSectionItem={idx => () => {
                      console.log('no-op');
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
                    nodeID={nodeID}
                    bufferID={bufferID}
                    isLocked={false}
                    onRemoveSectionItem={() => {
                      onRowRemove(bufferID, nodeID, idx);
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
      idx,
      c,
      isLocked,
      bufferID,
      nodeID,
      sortHandlers,
      onRemoveSectionItem
    } = this.props;
    let foo = eoo(sortHandlers, isLocked, onRemoveSectionItem);
    ret = foo(
      <OrgSectionElementHeader
        idx={idx}
        data={c}
        bufferID={bufferID}
        nodeID={nodeID}
      />
    );
    return ret;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID } = ownProps;
  const tree = state.orgBuffers[bufferID].orgTree;
  const node = nodeID ? getNode(state, bufferID, nodeID) : null;
  return {
    bufferID,
    nodeID,
    node,
    tree
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
    onRowMoved: (bufferID, nodeID) => e => {
      dispatch(updateSectionItemIndex(bufferID, nodeID, e.from, e.to));
    },
    onRowRemove: (bufferID, nodeID, idx) => {
      dispatch(removeSectionItemAtIndex(bufferID, nodeID, idx));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgSection);
