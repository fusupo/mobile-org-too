class OrgDrawerUtil {
  // static parseKeyVal(srcStr) {
  //   if (srcStr.length > 0) {
  //     let idx = 0;
  //     let colonCount = 0;
  //     do {
  //       let token = srcStr[idx];
  //       colonCount = token === ':' ? colonCount + 1 : colonCount;
  //       idx++;
  //     } while (idx < srcStr.length && colonCount < 2);
  //     let key = srcStr.slice(1, idx - 1);
  //     let val = srcStr.slice(idx).trim();
  //     // maybe parse val into OrgTimestamp/Number/etc..
  //     return [key, val];
  //   } else {
  //     throw new Error('empty drawer property string');
  //   }
  // }

  // static insert(drawer, keyval) {
  //   let clone = drawer.properties.slice(0);
  //   clone.push(keyval);
  //   return Object.assign({}, drawer, { properties: clone });
  // }

  // static remove(drawer, keyval) {
  //   const idx = OrgDrawer.indexOfKey(drawer, keyval[0]);
  //   let clone = drawer.properties.slice(0);
  //   clone.splice(idx, 1);
  //   return Object.assign({}, drawer, { properties: clone });
  // }

  // static update(drawer, keyval) {
  //   const idx = OrgDrawer.indexOfKey(drawer, keyval[0]);
  //   let clone = drawer.properties.slice(0);
  //   clone[idx] = keyval;
  //   return Object.assign({}, drawer, { properties: clone });
  // }

  // static insertOrUpdate(drawer, keyval) {
  //   if (OrgDrawer.indexOfKey(drawer, keyval[0]) === -1) {
  //     return OrgDrawer.insert(drawer, keyval);
  //   } else {
  //     return OrgDrawer.update(drawer, keyval);
  //   }
  // }

  // // static insert(drawer, keyval) {
  // //   drawer.properties.push(keyval);
  // //   return drawer;
  // // }

  // static clone(drawer) {
  //   let ret = OrgDrawer.new(drawer.name);
  //   for (let i in drawer.properties) {
  //     var srcKeyval = drawer.properties[i];
  //     var targKeyval = [srcKeyval[0], srcKeyval[1]];
  //     ret.properties.push(targKeyval);
  //   }
  //   return ret;
  // }

  static indexOfKey(drawer, key) {
    let i = 0;
    let found = false;
    while (i < drawer.properties.length && found === false) {
      if (drawer.properties[i][0] === key) {
        found = true;
      } else {
        i++;
      }
    }
    if (found === false) return -1;
    return i;
  }

  // static serialize(drawer, level = 1) {
  //   let r = '';
  //   const props = drawer.properties.filter(p => p[0] !== 'MOTID');
  //   if (props.length > 0) {
  //     r += padStart(':PROPERTIES:', level + 1) + '\n';
  //     for (let i in props) {
  //       let prop = props[i];
  //       let mPad = prop[0].length < 8 ? 9 - prop[0].length : 1;
  //       r += padStart(`:${prop[0]}:`, level + 1, ' ');
  //       r += padStart(`${prop[1]}`, mPad, ' ') + '\n';
  //     }
  //     r += padStart(':END:', level + 1, ' ') + '\n';
  //   }
  //   return r;
  // }
}

module.exports = OrgDrawerUtil;
