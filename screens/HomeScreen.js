import R from 'ramda';
import * as Expo from 'expo';
import React from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontAwesome } from '@expo/vector-icons';
import ModalDropdown from 'react-native-modal-dropdown';

import { registerDbxAccessToken, addNewNode } from '../actions';

const OrgHeadlineUtil = require('org-parse').OrgHeadline;

import OrgBuffer from '../components/OrgBuffer';
import OrgHeadlineToo from '../components/OrgHeadlineToo';
import DropboxDataSource from '../utilities/DropboxDataSource';

import appStyles from '../styles';

const keywords = require('../constants/TodoKeyword').default; // ?;

import { getAllTags, getFlattenedBufferObj } from '../selectors';

class HomeScreen extends React.Component {
  state = {
    buffersLoaded: false,
    inboxFileIsOk: false,
    searchStr: null,
    tagFilters: [],
    tagFilterType: 'AND',
    isLocked: true
  };

  componentWillMount() {
    this.setState({
      keywords,
      keywordFilterIdx: 0
    });
    this.props.loadOrgFiles();
  }

  toggleTagFilter(tag) {
    let tags = this.state.tagFilters || [];
    if (R.contains(tag, tags)) {
      tags = R.without(tag, tags);
    } else {
      tags = R.insert(tags.length, tag, tags);
    }
    this.setState({ tagFilters: tags });
  }

  render() {
    // if (this.props.screenProps.currRoute !== 'MainTab') return null;

    const { buffers, onAddOne, allTags } = this.props;

    const filterTags = pool => {
      const { tagFilters, tagFilterType } = this.state;
      const results = R.filter(n => {
        const i = R.intersection(tagFilters, n.tags);
        if (tagFilterType === 'AND') {
          return i.length === tagFilters.length;
        } else if (tagFilterType === 'OR') {
          return i.length > 0;
        }
      }, pool);
      return results;
    };

    const filterKeywords = pool => {
      const results = R.filter(
        n =>
          n.keyword &&
          n.keyword.search(this.state.keywords[this.state.keywordFilterIdx]) >
            -1,
        pool
      );
      return results;
    };

    const search = pool => {
      const results = R.filter(n => {
        return n.content
          ? n.content.toLowerCase().search(this.state.searchStr.toLowerCase()) >
              -1
          : false;
      }, pool);
      return results;
    };

    if (Object.entries(buffers).length > 0) {
      const doKeywordFilter = this.state.keywordFilterIdx !== 0; //this.state.keywords.length - 1;
      const doTagFilter = this.state.tagFilters.length > 0;
      const doSearch = this.state.searchStr && this.state.searchStr !== '';

      let display;
      if (doKeywordFilter || doTagFilter || doSearch) {
        let pool = R.reduce(
          (m, b) =>
            R.concat(
              R.reduce(
                (m2, n) =>
                  R.insert(
                    m2.length,
                    {
                      bufferID: b[0],
                      nodeID: n[1].id,
                      content: n[1].title,
                      level: n[1].stars,
                      keyword: n[1].keyword,
                      tags: n[1].tags || []
                    },
                    m2
                  ),
                [],
                Object.entries(getFlattenedBufferObj(b[1].orgTree))
              ),
              m
            ),
          [],
          Object.entries(buffers)
        );

        if (doSearch) {
          pool = search(pool);
        }

        if (doTagFilter) {
          pool = filterTags(pool);
        }

        if (doKeywordFilter) {
          pool = filterKeywords(pool);
        }

        display = R.map(n => {
          return (
            <OrgHeadlineToo
              key={n.nodeID}
              bufferID={n.bufferID}
              nodeID={n.nodeID}
              isLocked={true}
            />
          );
        }, pool);
      } else {
        display = Object.entries(buffers).map(e => {
          return (
            <OrgBuffer
              key={e[0]}
              bufferID={e[0]}
              isLocked={this.state.isLocked}
              onAddOne={onAddOne}
            />
          );
        });
      }

      return (
        <View style={appStyles.container}>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', padding: 10 }}>
              <FontAwesome
                style={appStyles.container}
                name={'search'}
                size={25}
              />
              <TextInput
                style={[
                  appStyles.baseText,
                  {
                    flex: 10,
                    borderColor: '#000',
                    borderWidth: 1,
                    borderRadius: 2
                  }
                ]}
                value={this.state.searchStr}
                onChangeText={searchStr => this.setState({ searchStr })}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                padding: 10
              }}>
              <FontAwesome
                style={appStyles.container}
                name={'filter'}
                size={25}
              />
              <View
                style={{
                  flexDirection: 'row',
                  flex: 10
                }}>
                <ModalDropdown
                  style={{
                    borderColor: '#000',
                    borderWidth: 1,
                    flex: 1
                  }}
                  animated={false}
                  options={this.state.keywords}
                  defaultIndex={this.state.keywordFilterIdx}
                  onSelect={idx => {
                    const keywordFilterIdx = parseInt(idx);
                    this.setState({ keywordFilterIdx });
                  }}>
                  <Text style={appStyles.baseText}>
                    {this.state.keywords[this.state.keywordFilterIdx]}
                  </Text>
                </ModalDropdown>
                <View
                  style={{
                    flex: 4,
                    flexDirection: 'row'
                  }}>
                  <ModalDropdown
                    style={{
                      flex: 1,
                      borderColor: '#000',
                      borderWidth: 1
                    }}
                    animated={false}
                    options={allTags}
                    renderRow={(rowData, sectionID, rowID, highlightRow) => {
                      const rowStyle =
                        this.state.tagFilters.indexOf(rowData) > -1
                          ? { backgroundColor: '#ccc' }
                          : {};
                      return (
                        <View style={rowStyle}>
                          <Text>{rowData}</Text>
                        </View>
                      );
                    }}
                    onSelect={idx => {
                      this.toggleTagFilter(allTags[idx]);
                    }}>
                    <Text style={appStyles.baseText}>{'tags'}</Text>
                  </ModalDropdown>
                  <TouchableHighlight
                    style={appStyles.container}
                    onPress={() => {
                      if (this.state.tagFilterType === 'AND') {
                        this.setState({ tagFilterType: 'OR' });
                      } else {
                        this.setState({ tagFilterType: 'AND' });
                      }
                    }}>
                    <Text style={appStyles.baseText}>
                      {this.state.tagFilterType}
                    </Text>
                  </TouchableHighlight>
                  <View
                    style={{
                      borderColor: '#000',
                      borderWidth: 1,
                      flex: 2,
                      flexDirection: 'column'
                    }}>
                    {this.state.tagFilters.map(t => (
                      <TouchableHighlight
                        key={t}
                        style={{
                          flex: 0,
                          paddingBottom: 2,
                          paddingTop: 1,
                          paddingLeft: 5
                        }}
                        onPress={() => {
                          this.toggleTagFilter(t);
                        }}>
                        <Text style={appStyles.baseText}>{t}</Text>
                      </TouchableHighlight>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>

          <TouchableHighlight
            onPress={() => {
              this.setState({ isLocked: !this.state.isLocked });
            }}>
            <View
              className="OrgScheduling"
              style={{
                flexDirection: 'row',
                backgroundColor: '#cccccc'
              }}>
              <Ionicons
                name={this.state.isLocked ? 'md-lock' : 'md-unlock'}
                size={20}
                style={{ marginLeft: 5 }}
              />
            </View>
          </TouchableHighlight>

          <ScrollView style={{ flex: 1, margin: 10 }}>{display}</ScrollView>
        </View>
      );
    } else {
      return <Expo.AppLoading />;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log('HOME SCREEN', ownProps);
  // if (ownProps.screenProps.currRoute !== 'MainTab') return {};
  return {
    buffers: state.orgBuffers,
    allTags: getAllTags(state),
    settings: state.settings
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadOrgFiles: () => {
      dispatch(loadOrgFiles());
    },
    onReceiveDbxAccessToken: token => {
      dispatch(registerDbxAccessToken(token));
    },
    onAddOne: bufferID => {
      dispatch(addNewNode(bufferID));
    }
  };
};

// REFER SETTINGS SCREEN AND LEDGER SCREEN FOR VERY SIMILAR CODE !!!
function loadOrgFiles() {
  return async (dispatch, getState) => {
    const foo = await loadParseOrgFilesAsync(
      '/org/inbox.org', //getState().settings.inboxFile.path,
      getState().dbxAccessToken
    );
    dispatch({
      type: 'addOrgBuffer',
      path: getState().settings.inboxFile.path,
      data: foo
    });
    getState().settings.orgFiles.forEach(async path => {
      const bar = await loadParseOrgFilesAsync(path, getState().dbxAccessToken);
      dispatch({
        type: 'addOrgBuffer',
        path: path,
        data: bar
      });
    });
  };
}

async function loadParseOrgFilesAsync(filePath, token) {
  const ds = new DropboxDataSource({ accessToken: token });
  try {
    let foo = await ds.loadParseOrgFilesAsync(filePath);
    return foo;
  } catch (e) {
    console.warn(
      'There was an error retrieving files from drobbox on the home screen '
    );
    console.log(e);
    return null;
    throw e;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
