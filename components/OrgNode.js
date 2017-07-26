import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import OrgDrawer from './OrgDrawer.js';
import OrgLogbook from './OrgLogbook.js';

const OrgDrawerUtil = require('org-parse').OrgDrawer;

const styles = StyleSheet.create({
  nodeHeader: {
    flexDirection: 'row'
  },
  nodeHeaderTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'space-mono',
    flex: 1
  }
});

const OrgNode = ({ id, headline, propDrawer, onTitleClick }) => {
  let collapseStatusText;
  const collapseStatusIdx = OrgDrawerUtil.indexOfKey(
    propDrawer,
    'collapseStatus'
  );
  if (collapseStatusIdx === -1) {
    collapseStatusText = 'undefined';
  } else {
    collapseStatusText = propDrawer.properties[collapseStatusIdx][1];
  }
  return (
    <View style={styles.nodeHeader}>
      <TouchableHighlight
        underlayColor="#00ff00"
        onPress={onTitleClick}
        style={{ width: '100%' }}>
        <View>
          <Text>
            {headline.content}
          </Text>
          <Text>
            {collapseStatusText}
          </Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

// Todo.propTypes = {
//   onClick: PropTypes.func.isRequired,
//   completed: PropTypes.bool.isRequired,
//   text: PropTypes.string.isRequired
// }

export default OrgNode;

// export default class OrgNode extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { isCollapsed: this.props.isCollapsed };
//   }

//   componentWillReceiveProps(nextProps) {
//     if (nextProps.isCollapsed !== this.state.isCollapsed) {
//       this.setState({ isCollapsed: nextProps.isCollapsed });
//     }
//   }

//   render() {
//     // todo keyword
//     const todoKeyword = this.props.node.headline.todoKeyword
//       ? <Text
//           style={{
//             backgroundColor: this.props.node.headline.todoKeywordColor
//           }}>
//           {this.props.node.headline.todoKeyword}
//         </Text>
//       : null;

//     // tags
//     const tags = this.props.node.headline.tags &&
//       this.props.node.headline.tags.length > 0
//       ? this.props.node.headline.tags.map((tag, idx) => {
//           return (
//             <Text
//               key={idx}
//               style={{
//                 fontFamily: 'space-mono',
//                 backgroundColor: '#cccccc',
//                 fontSize: 10
//               }}>
//               {tag}
//             </Text>
//           );
//         })
//       : null;
//     const tagList = tags ? <Text>{tags}</Text> : null;

//     const headerIcon = this.state.isCollapsed ? 'caret-down' : 'caret-up';
//     const header = (
//       <View style={styles.nodeHeader}>
//         <Text style={styles.nodeTodoKeyword}>{todoKeyword}</Text>
//         <Text style={styles.nodeHeaderTitle}>
//           {this.props.node.headline.content}
//         </Text>
//         <TouchableHighlight
//           underlayColor="#00ff00"
//           onPress={this.props.cycleCollapse}
//           style={{ width: 20 }}>
//           <FontAwesome name={headerIcon} size={10} />
//         </TouchableHighlight>
//       </View>
//     );

//     switch (this.state.isCollapsed) {
//       case true:
//         return (
//           <View>
//             {header}
//             {tagList}
//           </View>
//         );
//         break;
//       case false:
//         const scheduled = this.props.node.scheduled
//           ? <Text
//               style={{
//                 fontFamily: 'space-mono',
//                 fontSize: 12
//               }}>
//               {'SCHEDULED: ' + this.props.node.scheduled.srcStr}
//             </Text>
//           : null;
//         const closed = this.props.node.closed
//           ? <Text
//               style={{
//                 fontFamily: 'space-mono',
//                 fontSize: 12
//               }}>
//               {'CLOSED: ' + this.props.node.closed.srcStr}
//             </Text>
//           : null;
//         const body = this.props.node.body
//           ? <Text>{this.props.node.body}</Text>
//           : null;
//         return (
//           <View style={{ flex: 1 }}>
//             {header}
//             {tagList}
//             {scheduled}
//             {closed}
//             <OrgDrawer drawer={this.props.node.propDrawer} />
//             <OrgLogbook log={this.props.node.logbook} />
//             {body}
//           </View>
//         );
//         break;
//     }
//   }
// }
