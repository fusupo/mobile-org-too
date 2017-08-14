import Expo from 'expo';
import React from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import {
  Button,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import ModalDropdown from 'react-native-modal-dropdown';

import { registerDbxAccessToken, addNewNode } from '../actions';

const orgHeadlineUtil = require('org-parse').OrgHeadline;

import OrgBuffer from '../components/OrgBuffer';
import OrgHeadline from '../components/OrgHeadline.js';
import DropboxDataSource from '../utilities/DropboxDataSource';
import R from 'ramda';
let count = 0;

class HomeScreen extends React.Component {
  state = {
    buffersLoaded: false,
    inboxFileIsOk: false,
    searchStr: null,
    tagFilters: [],
    tagFilterType: 'AND'
  };

  componentWillMount() {
    let keywords = orgHeadlineUtil.keywords().slice(0);
    keywords.push('none');
    this.setState({
      keywords,
      keywordFilterIdx: keywords.length - 1
    });

    this.props.loadInboxFile();
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
      const results = R.filter(
        //n => n.content.search(this.state.searchStr) > -1,
        n =>
          n.content.toLowerCase().search(this.state.searchStr.toLowerCase()) >
          -1,
        pool
      );
      return results;
    };

    if (Object.entries(buffers).length > 0) {
      const doKeywordFilter =
        this.state.keywordFilterIdx !== this.state.keywords.length - 1;
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
                      content: n[1].headline.content,
                      level: n[1].headline.level,
                      keyword: n[1].headline.todoKeyword,
                      tags: n[1].headline.tags || []
                    },
                    m2
                  ),
                [],
                Object.entries(b[1].orgNodes)
              ),
              m
            ),
          [],
          Object.entries(buffers)
        );

        if (doTagFilter) {
          pool = filterTags(pool);
        }

        if (doKeywordFilter) {
          pool = filterKeywords(pool);
        }

        if (doSearch) {
          pool = search(pool);
        }

        display = R.map(
          n => (
            <OrgHeadline
              key={n.nodeID}
              bufferID={n.bufferID}
              nodeID={n.nodeID}
              levelOffset={n.level}
            />
          ),
          pool
        );
      } else {
        const listAll = Object.entries(buffers).map(e => (
          <View key={e[0]}>
            <OrgBuffer bufferID={e[0]} />
            <Button
              title={'add One'}
              onPress={() => {
                onAddOne(e[0]);
              }}
            />
          </View>
        ));
        display = listAll;
      }

      return (
        <View>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', padding: 10 }}>
              <FontAwesome style={{ flex: 1 }} name={'search'} size={25} />
              <TextInput
                style={{
                  flex: 10,
                  borderColor: '#000',
                  borderWidth: 1,
                  borderRadius: 5
                }}
                value={this.state.searchStr}
                onChangeText={searchStr => this.setState({ searchStr })}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                padding: 10
              }}>
              <FontAwesome style={{ flex: 1 }} name={'filter'} size={25} />
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
                    //                  padding: 20
                  }}
                  animated={false}
                  options={this.state.keywords}
                  defaultIndex={this.state.keywordFilterIdx}
                  onSelect={idx => {
                    const keywordFilterIdx = parseInt(idx);
                    this.setState({ keywordFilterIdx });
                  }}>
                  <Text>
                    {this.state.keywords[this.state.keywordFilterIdx]}
                  </Text>
                </ModalDropdown>
                <View
                  style={{
                    flex: 4,
                    flexDirection: 'row'
                    //      padding: 20
                  }}>
                  <ModalDropdown
                    style={{
                      //padding: 20,
                      flex: 1,
                      borderColor: '#000',
                      borderWidth: 1
                    }}
                    animated={false}
                    options={allTags}
                    renderRow={(rowData, sectionID, rowID, highlightRow) => {
                      const rowStyle = this.state.tagFilters.indexOf(rowData) >
                        -1
                        ? { backgroundColor: '#ccc' }
                        : {};
                      return (
                        <View style={rowStyle}><Text>{rowData}</Text></View>
                      );
                    }}
                    onSelect={idx => {
                      this.toggleTagFilter(allTags[idx]);
                    }}>
                    <Text>
                      {'tags'}
                    </Text>
                  </ModalDropdown>
                  <TouchableHighlight
                    style={{ flex: 1 }}
                    onPress={() => {
                      if (this.state.tagFilterType === 'AND') {
                        this.setState({ tagFilterType: 'OR' });
                      } else {
                        this.setState({ tagFilterType: 'AND' });
                      }
                    }}>
                    <Text>{this.state.tagFilterType}</Text>
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
                        <Text>{t}</Text>
                      </TouchableHighlight>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </View>
          <ScrollView>
            {display}
          </ScrollView>
        </View>
      );
    } else {
      return <Expo.AppLoading />;
    }
  }
}

const mapStateToProps = state => {
  const buffers = state.orgBuffers;
  const allTags = R.uniq(
    Object.values(buffers).reduce((m, v) => {
      let tags = Object.values(v.orgNodes).reduce((m2, v2) => {
        return m2.concat(v2.headline.tags || []);
      }, []);
      return m.concat(tags);
    }, [])
  );
  console.log('foo');
  return {
    buffers,
    allTags,
    settings: state.settings
  };
};

const mapDispatchToProps = dispatch => {
  return {
    initApp: () => {
      dispatch(
        NavigationActions.navigate({
          routeName: 'SettingsTab'
        })
      );
    },
    loadInboxFile: () => {
      dispatch(loadInboxFile());
    },
    onReceiveDbxAccessToken: token => {
      dispatch(registerDbxAccessToken(token));
    },
    onAddOne: bufferID => {
      dispatch(addNewNode(bufferID));
    }
  };
};

function loadInboxFile() {
  return async (dispatch, getState) => {
    const foo = await loadParseOrgFilesAsync(
      getState().settings.inboxFile.path,
      getState().dbxAccessToken
    );
    dispatch({
      type: 'addOrgBuffer',
      path: getState().settings.inboxFile.path,
      data: foo
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
