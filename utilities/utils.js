import shortid from 'shortid';

export const padMaybe = n => (n.toString().length === 1 ? '0' + n : n);

export const uuid = () => shortid.generate();
