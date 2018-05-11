import React, { Component } from 'react';
import { View } from 'react-native';

class List extends Component {
  render() {
    const { data, renderItem } = this.props;
    let items = data.map((d, idx) => renderItem(d, idx));
    console.log(
      data,
      '//////////////////////////////////////////////////////////////////////////////// RENDER LIST'
    );
    return <View style={{ flex: 1 }}>{items}</View>;
  }
}

export default List;
