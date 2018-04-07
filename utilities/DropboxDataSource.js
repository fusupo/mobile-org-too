import { parseLedger, serialize as ledgerSerialize } from './ledger-parse';
import { uuid } from './utils';

const parse = require('org-parse').parse;
const orgSerialize = require('org-parse').serialize;
const Dropbox = require('dropbox');

import { convert as convert2to1 } from './org2to1';

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
          console.log('FOOO');
          console.log(parsedObj);

          const converted = convert2to1(parsedObj);
          console.log(converted);

          obj.orgTree = converted.tree;
          obj.orgNodes = converted.nodes;
          obj.orgSettings = converted.settings;

          // obj['orgTree'] = nodesAndTree.tree;
          // obj['orgNodes'] = nodesAndTree.nodes;
          // obj['orgSettings'] = nodesAndTree.settings;

          // const hls = {};
          // const foo = hl => {
          //   hls[uuid()] = hl;
          //   if (hl.children) hl.children.forEach(foo);
          // };

          // nodesAndTree.headlines.forEach(foo);

          // obj['orgTree'] = nodesAndTree;
          // obj['orgNodes'] = hls;
          // obj['orgSettings'] = nodesAndTree.section;

          // console.log(nodesAndTree.headlines);
          // console.log(hls);

          //          console.log(obj);

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
    const contents = orgSerialize(nodes, tree, settings);
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
