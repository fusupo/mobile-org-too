import {
  parseOrg
} from '../utilities/org';

const Dropbox = require('dropbox');

export default function loadParseOrgFilesAsync() {
  let obj = {};
  const dbx = new Dropbox({
    accessToken: '6GWVlsFxXhcAAAAAAAAGZuGZiFMrvMmtuoD7nxlK_ShjfsL1_w7Yp0QQfMpbTq7M'
  });

  return new Promise((resolve, reject) => {
    dbx.filesGetTemporaryLink({
        path: '/org/inbox.org'
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

  })
}
