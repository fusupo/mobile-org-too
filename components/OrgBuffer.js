import React from 'react';
import {
  Button,
  StyleSheet,
  TouchableHighlight,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux';

import OrgList from '../components/OrgList';

import appStyles from '../styles';

// const styles = StyleSheet.create({
//   txt: {
//     textAlign: 'left',
//     fontSize: 14
//   },
//   border: {
//     borderTopWidth: 1,
//     borderStyle: 'solid',
//     paddingLeft: 5
//   },
//   padded: {
//     paddingLeft: 5
//   }
// });

export class OrgBuffer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isCollapsed: true };
  }
  render() {
    const { bufferID, tree } = this.props;
    const { isCollapsed } = this.state;
    console.log('RENDERE BUFFER ??!!!!', bufferID);
    let childList = null;

    if (!isCollapsed) {
      childList = (
        <OrgList
          data={tree.headlines}
          bufferID={bufferID}
          isLocked={this.props.isLocked}
        />
      );
    }

    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableHighlight
            style={{ flex: 4 }}
            onPress={() => {
              this.setState({ isCollapsed: !this.state.isCollapsed });
            }}>
            <Text
              style={[
                appStyles.baseText,
                { backgroundColor: '#000', color: '#fff' }
              ]}>
              {bufferID}
            </Text>
          </TouchableHighlight>
          {!this.props.isLocked && (
            <Button
              onPress={() => {
                this.props.onAddOne(bufferID);
              }}
              title="Add Child"
              color="#841584"
              accessibilityLabel="add child node"
            />
          )}
        </View>
        {childList}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  if (ownProps.bufferID) {
    const bufferID = ownProps.bufferID;
    return {
      bufferID: bufferID,
      tree: state.orgBuffers[bufferID].orgTree
    };
  } else {
    return {
      tree: {}
    };
  }
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgBuffer);
