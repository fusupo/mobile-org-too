import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View } from 'react-native';
import Swipeout from 'react-native-swipeout';

import { insertNewNodeProp, updateNodeProp, removeNodeProp } from '../actions';

import OrgDrawerItem from './OrgDrawerItem';

const OrgNodeUtil = require('../utilities/OrgNodeUtil');
import { getNode } from '../selectors';

class OrgDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editIdx: null
    };
  }

  render() {
    const {
      bufferID,
      nodeID,
      isCollapsed,
      isLocked,
      onAddProp,
      onRemoveProp,
      onUpdateProp
    } = this.props;
    if (isCollapsed) {
      return null;
    } else {
      const listItems =
        this.props.drawer && this.props.drawer.props
          ? Object.entries(this.props.drawer.props).map((keyval, idx) => {
              const key = keyval[0];
              const val = keyval[1];
              return (
                <OrgDrawerItem
                  isLocked={isLocked}
                  key={idx}
                  idx={idx}
                  propKey={key}
                  propVal={typeof val === 'object' ? val.value : val}
                  onRemoveProp={onRemoveProp(bufferID, nodeID)}
                  onUpdateProp={onUpdateProp(bufferID, nodeID)}
                  onItemEditBegin={itemIdx => {
                    this.setState({ editIdx: itemIdx });
                  }}
                  onItemEditEnd={() => {
                    this.setState({ editIdx: null });
                  }}
                  disabled={
                    this.state.editIdx === null || this.state.editIdx === idx
                      ? false
                      : true
                  }
                />
              );
            })
          : [];
      //   <Swipeout
      // autoClose={true}
      // left={[
      //   {
      //     text: 'addOne',
      //     backgroundColor: '#33bb33',
      //     onPress: () => {
      //       this.props.onAddProp();
      //     }
      //   }
      // ]}>

      return <View className="OrgDrawerProperties">{listItems}</View>;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  //const params = ownProps.navigation.state.params;
  const { bufferID, nodeID } = ownProps;
  const tree = state.orgBuffers[bufferID].orgTree;
  const node = nodeID ? getNode(state, bufferID, nodeID) : null;
  const drawer = OrgNodeUtil.getPropDrawer(node || tree);
  return {
    bufferID,
    nodeID,
    drawer
    // node,
    // tree
    // isNew
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddProp: (bufferID, nodeID) => () => {
      dispatch(insertNewNodeProp(bufferID, nodeID));
    },
    onUpdateProp: (bufferID, nodeID) => (idx, oldPropKey, propKey, propVal) => {
      console.log(bufferID, nodeID, idx, oldPropKey, propKey, propVal);
      dispatch(
        updateNodeProp(bufferID, nodeID, idx, oldPropKey, propKey, propVal)
      );
    },
    onRemoveProp: (bufferID, nodeID) => propKey => {
      dispatch(removeNodeProp(bufferID, nodeID, propKey));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgDrawer);
