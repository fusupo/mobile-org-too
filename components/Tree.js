import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import List from './List';

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasKids: false,
      itemData: [],
      isCollapsed: true
    };
  }

  componentDidMount() {
    this.props.getHasKids(this.props.path, hasKids =>
      this.setState({ hasKids })
    );
  }

  componentWillReceiveProps() {
    if (!this.state.isCollapsed) {
      const { getItems, path } = this.props;
      getItems(path, itemData => {
        this.setState({ itemData });
      });
    }
  }

  toggleCollapse() {
    if (this.state.isCollapsed) {
      const { getItems, path } = this.props;
      getItems(path, itemData => {
        this.setState({ itemData });
      });
    }
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  render() {
    const {
      title,
      path,
      type,
      getItems,
      getHasKids,
      renderLeafItem,
      renderBranchItem
    } = this.props;
    const { hasKids, itemData, isCollapsed } = this.state;

    let items = null;
    if (!isCollapsed) {
      items = (
        <List
          data={itemData}
          renderItem={(d, idx) => {
            return (
              <View key={idx}>
                <Tree
                  title={d.title}
                  path={d.path}
                  getItems={getItems}
                  type={d.type}
                  getHasKids={getHasKids}
                  renderLeafItem={renderLeafItem}
                  renderBranchItem={renderBranchItem}
                />
              </View>
            );
          }}
        />
      );
      items = <View>{items}</View>;
    }

    let touchableMaybe;
    if (type === 'branch') {
      const branchItem = renderBranchItem(
        title,
        path,
        type,
        hasKids,
        isCollapsed,
        this.toggleCollapse.bind(this)
      );
      if (hasKids) {
        touchableMaybe = branchItem;
      } else {
        touchableMaybe = branchItem;
      }
    } else if (type === 'leaf') {
      touchableMaybe = renderLeafItem(title, path, type, hasKids);
    }

    return (
      <View>
        <View>
          {touchableMaybe}
        </View>
        {items}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Tree);
