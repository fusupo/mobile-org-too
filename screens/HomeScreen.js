import React from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';

import OrgTreeContainer from '../components/OrgTree.js';

class HomeScreen extends React.Component {
  // static route = {
  //   navigationBar: {
  //     title: 'Root'
  //   }
  // };

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

  componentDidMount() {
    //console.log(this.props);
    //console.log(this.props.initApp);
    //this.props.navigation.navigate('SettingsTab');
    this.props.initApp();
  }

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

const mapStateToProps = state => ({
  nodes: state.orgNodes,
  tree: state.orgTree
});

const mapDispatchToProps = dispatch => {
  return {
    initApp: () => {
      dispatch(someAction());
    },
    foo: () => {
      console.log('oofo');
    }
  };
};

function someAction() {
  return (dispatch, getState) => {
    const state = getState(); // get state from store here,
    if (state.settings.all === null && state.settings.selected === null) {
      dispatch(
        NavigationActions.navigate({
          routeName: 'SettingsTab'
        })
      );
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
