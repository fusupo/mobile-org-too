import React from 'react';
import { ScrollView } from 'react-native';

import OrgTreeContainer from '../components/OrgTree.js';

export default class HomeScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Root'
    }
  };

  // constructor(props) {
  //   super(props);
  //   // this.state = {
  //   //   orgText: '',
  //   //   orgTree: null,
  //   //   viewIsReady: false
  //   // };
  // }

  // componentWillMount() {
  //   this._loadParseOrgFilesAsync();
  // }

  // async _loadParseOrgFilesAsync() {
  //   const ds = new DropboxDataSource();
  //   try {
  //     let foo = await ds.loadParseOrgFilesAsync();
  //     this.setState(foo);
  //   } catch (e) {
  //     console.warn(
  //       'There was an error retrieving files from drobbox on the home screen'
  //     );
  //   } finally {
  //     this.setState({ viewIsReady: true });
  //   }
  // }

  render() {
    // if (this.state.viewIsReady) {
    // orgTree={this.state.orgTree}
    // navigation={this.props.screenProps.navigation}

    return (
      <ScrollView>
        <OrgTreeContainer />
      </ScrollView>
    );
    // } else {
    //   return <View />;
    // }
  }
}
