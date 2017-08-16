import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import DropboxDataSource from '../utilities/DropboxDataSource';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontFamily: 'Menlo',
    fontSize: 10
  }
});

const AccountLine = ({ account }) => (
  <View style={[styles.container, { flexDirection: 'row' }]}>
    {account.map((a, idx) => (
      <Text style={styles.text} key={idx}>{a + ' '}</Text>
    ))}
  </View>
); //;

const PostingItem = ({ posting }) => (
  <View style={[styles.container, { flexDirection: 'row' }]}>
    <AccountLine account={posting.account} />
    <Text style={styles.text}>{`${posting.currency} ${posting.amount}`}</Text>
  </View>
);

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = { isCollapsed: true };
  }
  render() {
    const { node } = this.props;
    return (
      <View
        style={[
          styles.container
          // { borderColor: '#000', borderWidth: 1, padding: 10 }
        ]}>
        {this.state.isCollapsed
          ? <TouchableHighlight
              style={[styles.container]}
              onPress={() => {
                this.setState({ isCollapsed: !this.state.isCollapsed });
              }}>
              <View style={[styles.container, { flexDirection: 'row' }]}>
                <Text
                  style={[
                    styles.container,
                    styles.text
                  ]}>{`${node.date} ${node.consolidated} ${node.payee} `}</Text>
                <Text
                  style={
                    styles.text
                  }>{`${node.postings.reduce((m, p) => m + (p.amount === '' ? 0 : parseFloat(p.amount)), 0)}`}</Text>
              </View>
            </TouchableHighlight>
          : <View>
              <TouchableHighlight
                onPress={() => {
                  this.setState({ isCollapsed: !this.state.isCollapsed });
                }}>
                <Text
                  style={[
                    styles.container,
                    styles.text
                  ]}>{`${node.date} ${node.consolidated} ${node.payee}`}</Text>
              </TouchableHighlight>
              <View style={[styles.container, { paddingLeft: 10 }]}>
                {node.postings.map((p, idx) => (
                  <PostingItem key={idx} posting={p} />
                ))}
              </View>
            </View>}
      </View>
    );
  }
}

class LedgerScreen extends Component {
  componentWillMount() {
    this.props.loadLedgerFile();
  }

  render() {
    const { nodes } = this.props;

    const list = nodes.length > 0
      ? <ScrollView style={styles.container}>
          {nodes.map((n, idx) => <ListItem key={idx} node={n} />)}
        </ScrollView>
      : null;

    return (
      <View style={[styles.container, { padding: 10 }]}>
        {list}
        <Button
          title={'add one'}
          onPress={() => {
            console.log('add one');
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const ledger = state.data.ledger;
  const nodes = ledger && ledger.ledgerNodes ? ledger.ledgerNodes : [];
  return {
    nodes
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadLedgerFile: () => {
      dispatch(loadLedgerFile());
    }
  };
};

// REFER SETTINGS SCREEN AND HOME SCREEN FOR VERY SIMILAR CODE !!!
function loadLedgerFile() {
  return async (dispatch, getState) => {
    const foo = await loadParseLedgerFileAsync(
      getState().settings.ledgerFile.path,
      getState().dbxAccessToken
    );
    dispatch({
      type: 'addLedger',
      path: getState().settings.ledgerFile.path,
      data: foo
    });
    // getState().settings.orgFiles.forEach(async path => {
    //   const bar = await loadParseOrgFilesAsync(path, getState().dbxAccessToken);
    //   dispatch({
    //     type: 'addOrgBuffer',
    //     path: path,
    //     data: bar
    //   });
    // });
  };
}

async function loadParseLedgerFileAsync(filePath, token) {
  console.log('loadingLedgerFile, further');
  const ds = new DropboxDataSource({ accessToken: token });
  console.log(ds);
  try {
    let foo = await ds.loadParseLedgerFileAsync(filePath);
    return foo;
  } catch (e) {
    console.warn(
      'There was an error retrieving ledger file from drobbox on the ledger screen '
    );
    console.log(e);
    return null;
    throw e;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LedgerScreen);
