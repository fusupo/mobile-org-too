import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
  Button,
  DatePickerIOS,
  Dimensions,
  Keyboard,
  ListView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import R from 'ramda';
import DropboxDataSource from '../utilities/DropboxDataSource';
import List from '../components/List';

import { padMaybe, uuid } from '../utilities/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontFamily: 'Menlo',
    fontSize: 10
  },
  textInput: {
    fontFamily: 'Menlo',
    fontSize: 10,
    padding: 5
  },
  border: {
    borderWidth: 1,
    borderStyle: 'solid',
    margin: 5
  },
  dropdown: {
    position: 'absolute',
    height: (33 + StyleSheet.hairlineWidth) * 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'lightgray',
    borderRadius: 2,
    backgroundColor: 'white'
    //justifyContent: 'center'
  },
  modal: {
    flexGrow: 1
  }
});

const formatAmount = amnt => {
  if (amnt === '') return amnt;
  let formatted = amnt + '';
  let idx = formatted.indexOf('.');
  if (idx === -1) {
    formatted = formatted + '.00';
  } else if (idx < formatted.length - 3) {
    console.log('less than', idx, formatted.length - 3);
    formatted = formatted.substring(0, idx + 3);
  } else if (idx > formatted.length - 3) {
    const numToAdd = idx - (formatted.length - 3);
    const zeroes = R.repeat('0', numToAdd).join('');
    formatted = formatted + zeroes;
  }
  return formatted;
};

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
    const { node, isLocked, onListItemEdit } = this.props;
    const { isCollapsed } = this.state;

    let postingItems;
    if (!isCollapsed) {
      postingItems = (
        <View style={[styles.container, { paddingLeft: 10 }]}>
          {node.postings.map((p, idx) => <PostingItem key={idx} posting={p} />)}
        </View>
      );
      if (!isLocked) {
        postingItems = (
          <TouchableHighlight onPress={() => onListItemEdit(node.id)}>
            {postingItems}
          </TouchableHighlight>
        );
      }
    }

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
              <View
                style={[
                  styles.container,
                  { marginLeft: 5, marginRight: 5, flexDirection: 'row' }
                ]}>
                <Text
                  style={[
                    styles.container,
                    styles.text
                  ]}>{`${node.date} ${node.consolidated} ${node.payee} `}</Text>
                <Text
                  style={
                    styles.text
                  }>{`${formatAmount(node.postings.reduce((m, p) => m + (p.amount === '' ? 0 : parseFloat(p.amount)), 0))}`}</Text>
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
              {postingItems}
            </View>}
      </View>
    );
  }
}

class LedgerItemDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      consolidated: ' ',
      date: new Date(),
      id: 'new',
      payee: '',
      postings: [],
      datePickerIsVisible: false
    };
  }

  _updatePosting = (idx, account, amnt, currency) => {
    const oldPostings = this.state.postings;
    const amount = formatAmount(amnt);
    const postings = idx === oldPostings.length
      ? R.insert(idx, { account, amount, currency }, this.state.postings)
      : R.update(idx, { account, amount, currency }, this.state.postings);
    this.setState({ postings });
  };

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.data);
    if (nextProps.data) {
      this.setState({
        ...nextProps.data,
        date: new Date(nextProps.data.date)
      });
    } else {
      this.setState({
        consolidated: ' ',
        date: new Date(),
        id: 'new',
        payee: '',
        postings: [],
        datePickerIsVisible: false
      });
    }
  }

  render() {
    const {
      visible,
      data,
      allPayees,
      allAccounts,
      allAmounts,
      onSubmit,
      onCancel
    } = this.props;
    const {
      id,
      payee,
      date,
      oldDate,
      postings,
      datePickerIsVisible
    } = this.state;

    return (
      <Modal visible={visible}>
        <View style={[styles.container, styles.border, { marginTop: 22 }]}>
          <Text style={[styles.textInput]}>{id + ' - item details'}</Text>
          <View style={[styles.container, { flexDirection: 'row' }]}>
            <View style={styles.container}>
              <TextInputWithModalSelect
                value={payee}
                options={allPayees}
                onSubmit={newPayee => {
                  this.setState({ payee: newPayee });
                }}
              />
            </View>
            <TouchableHighlight
              onPress={() =>
                this.setState({ oldDate: date, datePickerIsVisible: true })}>
              <Text
                style={[styles.container, , styles.border, styles.textInput]}
                value={
                  date
                }>{`${date.getFullYear()}/${padMaybe(date.getMonth() + 1)}/${padMaybe(date.getDate())}`}</Text>
            </TouchableHighlight>
          </View>
          <Modal visible={datePickerIsVisible}>
            <View
              style={{
                flex: 1,
                overflow: 'hidden',
                paddingTop: 22
              }}>
              <DatePickerIOS
                date={this.state.date}
                onDateChange={date => this.setState({ date })}
                mode="date"
              />
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <Button
                    title={'Cancel'}
                    onPress={() => {
                      this.setState({
                        date: oldDate,
                        datePickerIsVisible: false
                      });
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    title={'OK'}
                    onPress={() => {
                      this.setState({
                        datePickerIsVisible: false
                      });
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <View style={[styles.container, styles.border, { flex: 10 }]}>
            <ScrollView style={[styles.container]}>
              {R.insert(
                postings.length,
                { account: [], amount: '' },
                postings
              ).map((p, idx) => (
                <View key={idx} style={{ flex: 1 }}>
                  <View style={[{ flexDirection: 'row' }]}>
                    <View style={{ flex: 6 }}>
                      <TextInputWithModalSelect
                        value={p.account.join(':')}
                        options={allAccounts}
                        onSubmit={account => {
                          this._updatePosting(
                            idx,
                            account.split(':'),
                            p.amount,
                            p.currency || ''
                          );
                        }}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.textInput]}>{p.currency}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <TextInputWithModalSelect
                        value={p.amount}
                        options={allAmounts}
                        onSubmit={amount => {
                          this._updatePosting(
                            idx,
                            p.account,
                            amount,
                            amount != '' ? '$' : ''
                          );
                        }}
                        keyboardType={'numeric'}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Button title={'Cancel'} onPress={onCancel} />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                title={'OK'}
                onPress={() => {
                  onSubmit({
                    consolidated: this.state.consolidated,
                    date: `${this.state.date.getFullYear()}/${padMaybe(this.state.date.getMonth() + 1)}/${padMaybe(this.state.date.getDate())}`,
                    id: this.state.id,
                    payee: this.state.payee,
                    postings: this.state.postings
                  });
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

class TextInputWithModalSelect extends Component {
  state = {
    text: '',
    showModal: false
  };

  _submit = text => {
    this.props.onSubmit(text);
    this.setState({ text });
    this.hide();
  };

  componentWillMount() {
    this.setState({ text: this.props.value });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && nextProps.value !== this.state.text) {
      this.setState({ text: nextProps.value });
    }
  }

  show = () => {
    this.setState({
      showModal: true,
      oldText: this.state.text
    });
  };

  hide = () => {
    Keyboard.dismiss();
    this.setState({ showModal: false });
  };

  render() {
    const { text, showModal } = this.state;
    const { options, clearTextOnFocus, keyboardType } = this.props;

    return (
      <View style={[styles.border]}>
        <TouchableHighlight
          onPress={() => {
            this.show();
          }}>
          <Text style={[styles.textInput]}>
            {text}
          </Text>
        </TouchableHighlight>
        <Modal visible={showModal}>
          <View style={{ flex: 1, paddingTop: 22 }}>
            <View style={{ flex: 1 }}>
              <TextInput
                autoFocus={true}
                clearTextOnFocus={clearTextOnFocus || false}
                ref={textInput => (this._textInput = textInput)}
                style={[styles.textInput]}
                value={text}
                onFocus={this.show}
                onSubmitEditing={() => {
                  this._submit(text);
                }}
                onChangeText={newText => this.setState({ text: newText })}
                onEndEditing={() => {
                  //           this._submit(text);
                }}
                keyboardType={keyboardType || 'default'}
              />
              <ScrollView style={[styles.border, {}]}>
                <List
                  data={options.filter(
                    o => o.toLowerCase().search(text.toLowerCase()) > -1
                  )}
                  renderItem={(item, idx) => (
                    <TouchableHighlight
                      key={idx}
                      onPress={() => {
                        this._submit(item);
                      }}>
                      <View style={{ padding: 5, backgroundColor: '#fff' }}>
                        <Text style={styles.text}>{item}</Text>
                      </View>
                    </TouchableHighlight>
                  )}
                />
              </ScrollView>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <Button
                    title={'Cancel'}
                    onPress={() => {
                      this.setState({ text: this.state.oldText });
                      this.hide();
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    title={'OK'}
                    onPress={() => {
                      this._submit(text);
                      // this.setState({ text: this.state.oldText });
                      // this.hide();
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={{ flex: 1 }} />
          </View>
        </Modal>
      </View>
    );
  }
}

class LedgerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLocked: true,
      modalData: null,
      modalIsVisible: false
    };
  }

  componentWillMount() {
    this.props.loadLedgerFile();
  }

  render() {
    const {
      nodes,
      allPayees,
      allAccounts,
      allAmounts,
      onAddOne,
      onEditOne
    } = this.props;
    const { isLocked, modalData, modalIsVisible } = this.state;

    const list = nodes.length > 0
      ? <ScrollView style={styles.container}>
          {nodes.map((n, idx) => (
            <ListItem
              key={idx}
              node={n}
              isLocked={isLocked}
              onListItemEdit={id => {
                this.setState({ modalData: n, modalIsVisible: true });
                // onEditOne(id)
              }}
            />
          ))}
        </ScrollView>
      : null;

    return (
      <View style={[styles.container, styles.border]}>
        <LedgerItemDetails
          visible={modalIsVisible}
          data={modalData}
          allPayees={allPayees}
          allAccounts={allAccounts}
          allAmounts={allAmounts}
          onSubmit={item => {
            if (item.id === 'new') {
              onAddOne(item);
            } else {
              onEditOne(item);
            }
            this.setState({ modalData: null, modalIsVisible: false });
          }}
          onCancel={() => {
            this.setState({ modalData: null, modalIsVisible: false });
          }}
        />
        <TouchableHighlight
          onPress={() => {
            this.setState({ isLocked: !isLocked });
          }}>
          <View
            className="OrgScheduling"
            style={{
              flexDirection: 'row',
              backgroundColor: '#cccccc'
            }}>
            <Ionicons
              name={isLocked ? 'md-lock' : 'md-unlock'}
              size={20}
              style={{ marginLeft: 5 }}
            />
          </View>
        </TouchableHighlight>
        {list}
        <Button
          title={'add one'}
          onPress={() => {
            this.setState({ modalData: null, modalIsVisible: true });
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const ledger = state.data.ledger;
  let nodes = ledger && ledger.ledgerNodes ? ledger.ledgerNodes : [];
  const allPayees = R.uniq(R.map(n => n.payee, nodes));
  const allPostings = R.reduce(
    (m, p) => R.concat(p, m),
    [],
    R.map(n => n.postings, nodes)
  );
  const allAccounts = R.uniq(
    R.map(
      p => R.dropLast(1, R.reduce((m, a) => m + a + ':', '', p.account)),
      allPostings
    )
  );
  const allAmounts = R.uniq(R.map(p => p.amount, allPostings));
  nodes = R.reverse(nodes);
  allAmounts.sort();
  return {
    nodes,
    allPayees,
    allAccounts,
    allAmounts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadLedgerFile: () => {
      dispatch(loadLedgerFile());
    },
    onAddOne: node => {
      node.id = uuid();
      dispatch({
        type: 'ledger:addNode',
        node
      });
    },
    onEditOne: node => {
      dispatch({
        type: 'ledger:updateNode',
        node
      });
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
  const ds = new DropboxDataSource({ accessToken: token });
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
