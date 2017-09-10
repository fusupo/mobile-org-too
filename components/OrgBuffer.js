import React from 'react';
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { connect } from 'react-redux';

import OrgList from '../components/OrgList';

const styles = StyleSheet.create({
  txt: {
    textAlign: 'left',
    fontSize: 14
  },
  border: {
    borderTopWidth: 1,
    borderStyle: 'solid',
    paddingLeft: 5
  },
  padded: {
    paddingLeft: 5
  },
  orgTree: {
    flex: 1
  }
});

export class OrgBuffer extends React.Component {
  render() {
    const { bufferID, tree } = this.props;
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableHighlight
            style={{ flex: 4 }}
            onPress={() => {
              console.log('foo');
            }}>
            <Text style={[{ backgroundColor: '#000', color: '#fff' }]}>
              {bufferID}
            </Text>
          </TouchableHighlight>
        </View>
        <OrgList
          data={tree.children}
          bufferID={bufferID}
          isLocked={this.props.isLocked}
        />
      </View>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  if (ownProps.bufferID) {
    const bufferID = ownProps.bufferID;
    return {
      bufferID: bufferID,
      nodes: state.orgBuffers[bufferID].orgNodes,
      tree: state.orgBuffers[bufferID].orgTree
    };
  } else {
    return {
      nodes: {},
      tree: {}
    };
  }
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgBuffer);
