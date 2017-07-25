const parseOrg = require('org-parse').parseOrg;
const serializeTree = require('org-parse').serializeTree;
const Dropbox = require('dropbox');

import { gitHubAccessToken } from '../secrets';

export default class DropboxDataSource {
  constructor() {
    this.dbx = new Dropbox({
      accessToken: gitHubAccessToken
    });
  }

  loadParseOrgFilesAsync() {
    let obj = {};
    return new Promise((resolve, reject) => {
      this.dbx
        .filesGetTemporaryLink({
          path: '/org/inboxDummyIn.org'
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

  serialize() {
    return new Promise((resolve, reject) => {
      this.dbx
        .filesUpload({
          contents: serializeTree(this.state.tree),
          path: '/org/inboxDummyOut.org',
          mode: { '.tag': 'overwrite' }
        })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }
}
