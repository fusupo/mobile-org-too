import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';

import { getNode } from '../selectors';

class OrgTableCell extends Component {
  render() {
    const { cell } = this.props;
    return (
      <View style={{ width: cell.width * 10 }}>
        <Text>{cell.contents}</Text>{' '}
      </View>
    );
  }
}

class OrgTableRow extends Component {
  render() {
    const { row } = this.props;
    const cells = row.cells.map(c => (
      <OrgTableCell key={JSON.stringify(c)} cell={c} />
    ));
    return <View style={{ flexDirection: 'row' }}>{cells} </View>;
  }
}

class OrgTable extends Component {
  render() {
    const { table } = this.props;

    if (this.props.isCollapsed) {
      return null;
    } else {
      const rows = table.rows.map(r => (
        <OrgTableRow key={JSON.stringify(r)} row={r} />
      ));
      return <View style={{ flexDirection: 'column', flex: 1 }}>{rows}</View>;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bufferID, nodeID, idx } = ownProps;
  const tree = state.orgBuffers[bufferID].orgTree;
  const node = nodeID ? getNode(state, bufferID, nodeID) : null;
  const table = node ? node.section.children[idx] : tree.section.children[idx];
  return {
    bufferID,
    nodeID,
    table
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgTable);
