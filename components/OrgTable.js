import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import R from 'ramda';

import OrgHeadline from './OrgHeadlineToo';
import List from './List';
import Tree from './Tree';
import OrgSectionElementHeader from './OrgSectionElementHeader';

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

export default class OrgTable extends Component {
  constructor(props) {
    super(props);
    this.state = { isCollapsed: this.props.isCollapsed };
  }

  _toggleCollapse() {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  render() {
    const { table } = this.props;

    if (this.state.isCollapsed) {
      return (
        <OrgSectionElementHeader
          iconName={'ios-grid-outline'}
          toggleCollapse={this._toggleCollapse.bind(this)}
        />
      );
    } else {
      const rows = table.rows.map(r => (
        <OrgTableRow key={JSON.stringify(r)} row={r} />
      ));
      return (
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <OrgSectionElementHeader
            iconName={'ios-grid'}
            toggleCollapse={this._toggleCollapse.bind(this)}
          />
          {rows}
        </View>
      );
    }
  }
}
