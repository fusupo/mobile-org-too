class OrgTimestamp {
  constructor(srcStr){
    this.srcStr = srcStr;
  }
}

class OrgLogbook {
  constructor(name) {
    this.log = [];
  }

  // static parse(srcStr){
  //   if(srcStr.length > 0){
  //     let keyval = {};
  //     let idx = 0;
  //     let colonCount = 0;
  //     do{
  //       let token = srcStr[idx];
  //       colonCount = token === ':' ? colonCount + 1:colonCount;
  //       idx++;
  //     }while(idx < srcStr.length && colonCount < 2);
  //     let key = srcStr.slice(1, idx - 1);
  //     let val = srcStr.slice(idx).trim();
  //     // maybe parse val into OrgTimestamp/Number/etc..
  //     keyval[key] = val;
  //     return keyval;
  //   }else{
  //     throw(new Error('empty drawer property string'));
  //   }
  // }

  insert(logItem) {
    this.log.push(logItem);
  }
}

class OrgDrawer {
  constructor(name) {
    this.name = name;
    this.properties = [];
  }

  static parse(srcStr){
    if(srcStr.length > 0){
      let keyval = {};
      let idx = 0;
      let colonCount = 0;
      do{
        let token = srcStr[idx];
        colonCount = token === ':' ? colonCount + 1:colonCount;
        idx++;
      }while(idx < srcStr.length && colonCount < 2);
      let key = srcStr.slice(1, idx - 1);
      let val = srcStr.slice(idx).trim();
      // maybe parse val into OrgTimestamp/Number/etc..
      keyval[key] = val;
      return keyval;
    }else{
      throw(new Error('empty drawer property string'));
    }
  }

  insert(keyval) {
    this.properties.push(keyval);
  }
}

class OrgHeadLine {
  constructor(srcStr) {
    let idx = 0;
    let token = '';
    do {
      token = srcStr[idx];
      idx++;
    } while (token === '*' && idx < srcStr.length);
    this.level = idx - 1;
    this.content = srcStr.slice(idx);
  }
}

class OrgNode {
  constructor(srcStr) {
    let srcLines = srcStr.split('\n');
    this.headline = new OrgHeadLine(srcLines[0]);
    this.scheduled = null;
    this.propDrawer = new OrgDrawer('PROPERTIES');
    this.logbook = new OrgLogbook();
    this.opened = undefined;
    this.body = '';
    let idx = 1;
    while (idx < srcLines.length) {
      const srcLine = srcLines[idx].trim();
      if(srcLine.startsWith('SCHEDULED:')){
        this.scheduled = new OrgTimestamp(srcLine.slice(10).trim()); 
      }else if(srcLine.startsWith(':PROPERTIES:')){
        let endIdx = idx + 1;
        let keyvalStr = srcLines[endIdx].trim();
        while (endIdx < srcLines.length && keyvalStr !== ':END:') {
          let keyval = OrgDrawer.parse(keyvalStr);
          this.propDrawer.insert(keyval);
          endIdx++;
          keyvalStr = srcLines[endIdx].trim();
        }
        idx = endIdx;
      }else if(srcLine.startsWith(':LOGBOOK:')){
        let endIdx = idx + 1;
        let logItem = srcLines[endIdx].trim();
        while (endIdx < srcLines.length && logItem !== ':END:') {
          this.logbook.insert(logItem);
          endIdx++;
          logItem = srcLines[endIdx].trim();
        }
        idx = endIdx;
      }else if(srcLine.startsWith('OPENED:')){
        this.opened = new OrgTimestamp(srcLine.slice(7).trim()); 
      }else{
        let endIdxX = idx;
        let line = srcLines[endIdxX].trim();
        while (endIdxX < srcLines.length) {
          line = srcLines[endIdxX].trim();
          this.body += line + ' ';
          endIdxX++;
        }
        idx = endIdxX;
      }
      idx++;
    }
  }

  get level(){
    return this.headline.level;
  }

  get activeTimeStamp(){
    return this.scheduled === null ? null : this.scheduled.srcStr;
  }

}

class OrgTree {
  constructor(node){
    this.node = node;
    this.children = [];
  } 
}

const createNodeMaybe = srcStr => {
  if (srcStr[0] === '*') {
    let node = new OrgNode(srcStr);
    return node;
  } else {
    return false;
  }
};

const parseTree = (pt, nodes) => {
  let idx = 0;
  const innerFunc = (parentTree)=>{
    let currNode = nodes[idx];
    let currTree = new OrgTree(currNode);
    idx++;
    parentTree.children.push(currTree);
    while(idx < nodes.length && nodes[idx].level === currNode.level + 1){
      innerFunc(currTree);
    }
    if(idx < nodes.length && currNode.level === nodes[idx].level){// && currNode.level === 1){
      innerFunc(parentTree);
    }
  };
  innerFunc(pt);
};

const parseOrg = srcStr => new Promise((resolve, reject)=>{
  let nodesSrc = srcStr.split(/\n(?=\*)/gm);
  let nodes = [];
  let tree = new OrgTree(null);
  for (let idx in nodesSrc) {
    let node = createNodeMaybe(nodesSrc[idx]);
    if (node) {
      nodes.push(node);
    }
  }
  parseTree(tree, nodes);
  resolve( {nodes, tree} );
});

export {parseOrg};
