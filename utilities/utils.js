import shortid from 'shortid';
import moment from 'moment';

export const padMaybe = n => (n.toString().length === 1 ? '0' + n : n);

export const uuid = () => shortid.generate();

export const isObject = val => {
  if (val === null) {
    return false;
  }
  return typeof val === 'function' || typeof val === 'object';
};
// function isObject(obj) {
//   return obj === Object(obj);
// }

export const findBranch = (tree, nodeID) => {
  let ret = tree.nodeID === nodeID ? tree : undefined;
  let i = 0;
  while (i < tree.children.length && ret === undefined) {
    ret = findBranch(tree.children[i], nodeID);
    i++;
  }
  return ret;
};

export const timestampStringNow = () => {
  return `[${moment().format('YYYY-MM-DD ddd HH:mm')}]`;
};
