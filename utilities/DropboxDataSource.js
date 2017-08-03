const parseOrg = require('org-parse').parseOrg;
const serialize = require('org-parse').serialize;
const Dropbox = require('dropbox');

import { gitHubAccessToken } from '../secrets';

export default class DropboxDataSource {
  constructor(config = {}) {
    this.dbx = new Dropbox(config);
    // {
    //   accessToken: gitHubAccessToken
    // }
  }

  loadParseOrgFilesAsync(filePath) {
    let obj = {};
    return new Promise((resolve, reject) => {
      this.dbx
        .filesGetTemporaryLink({
          path: filePath
        })
        .then(res => fetch(res.link))
        .then(res => res.text())
        .then(resText => {
          obj['orgText'] = resText;
          return parseOrg(resText);
        })
        .then(nodesAndTree => {
          obj['orgTree'] = nodesAndTree.tree;
          obj['orgNodes'] = nodesAndTree.nodes;
          resolve(obj);
        })
        .catch(err => reject(err));
    });
  }

  filesListFolderAsync(path) {
    return new Promise((resolve, reject) => {
      this.dbx
        .filesListFolder({
          path: path
        })
        .then(res => {
          if (res.has_more) {
            console.warn('Dropbox filesListFolderAsync has more!!!');
          }
          resolve(res);
        })
        .catch(err => reject(err));
    });
  }

  filesGetMetadataAsync(path) {
    return new Promise((resolve, reject) => {
      this.dbx
        .filesGetMetadata({
          path: path
        })
        .then(res => {
          resolve(res);
        })
        .catch(err => reject(err));
    });
  }

  serialize(nodes, tree) {
    return new Promise((resolve, reject) => {
      this.dbx
        .filesUpload({
          contents: serialize(nodes, tree),
          path: '/org/inboxDummyOut.org',
          mode: { '.tag': 'overwrite' }
        })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }
}
