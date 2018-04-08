import shortid from 'shortid';

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
