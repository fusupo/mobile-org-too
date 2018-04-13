import { parseLedger, serialize as ledgerSerialize } from './ledger-parse';
import { uuid } from './utils';

const parse = require('org-parse').parse;
const orgSerialize = require('org-parse').serialize;
const Dropbox = require('dropbox');

import { convert as convert2to1 } from './org2to1';
import { convert as convert1to2 } from './org1to2';

export default class DropboxDataSource {
  constructor(config = {}) {
    this.dbx = new Dropbox(config);
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
          return parse(resText);
        })
        .then(parsedObj => {
          const converted = convert2to1(parsedObj);

          obj.orgTree = converted.tree;
          obj.orgNodes = converted.nodes;
          obj.orgSettings = converted.settings;

          resolve(obj);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  loadParseLedgerFileAsync(filePath) {
    let obj = {};
    return new Promise((resolve, reject) => {
      this.dbx
        .filesGetTemporaryLink({
          path: filePath
        })
        .then(res => fetch(res.link))
        .then(res => res.text())
        .then(resText => {
          obj['ledgerText'] = resText;
          return parseLedger(resText);
        })
        .then(items => {
          obj['ledgerNodes'] = items;
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

  serializeAndUpload(nodes, tree, settings, path) {
    const contentsObj = convert1to2(nodes, tree, settings);
    console.log('CONTENTS', contentsObj);
    const contents = orgSerialize(contentsObj);

    // return new Promise((res, rej) => {
    //   //res(null);
    // });
    return new Promise((resolve, reject) => {
      this.dbx
        .filesUpload({
          contents,
          path: path + '.dummy.org',
          mode: { '.tag': 'overwrite' }
        })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  serializeAndUploadLedger(ledgerNodes, path) {
    const contents = ledgerSerialize(ledgerNodes);
    return new Promise((resolve, reject) => {
      this.dbx
        .filesUpload({
          contents,
          path: path,
          mode: { '.tag': 'overwrite' }
        })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }
}
