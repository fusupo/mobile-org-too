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

export const parseDate = srcDate => {
  const mom = srcDate === undefined ? moment() : moment(srcDate);
  return {
    // srcStr: '',
    type: 'inactive',
    year: mom.year(),
    month: mom.month() + 1,
    date: mom.date(),
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][mom.day()],
    hour: mom.hour(),
    minute: mom.minute(),
    repInt: null,
    repMin: null,
    repMax: null
  };
};

export const timestampNow = () => {
  return parseDate();
};

export const momentFromTS = obj => {
  return moment({
    year: obj.year,
    month: obj.month - 1,
    date: obj.date,
    hour: obj.hour,
    minute: obj.minute
  });
};

export const momentToTS = mom => {
  return {
    // srcStr: '',
    type: 'inactive',
    year: mom.year(),
    month: mom.month() + 1,
    date: mom.date(),
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][mom.day()],
    hour: mom.hour(),
    minute: mom.minute(),
    repInt: null,
    repMin: null,
    repMax: null
  };
};

export const cloneTS = obj => {
  return momentToTS(momentFromTS(obj));
};

export const addTS = (a, b) => {
  const mom = momentFromTS(a);
  const res = mom.add(b);
  let ret = momentToTS(res);
  ret.type = a.type;
  ret.repInt = a.repInt;
  ret.repMin = a.repMin;
  ret.repMax = a.repMax;
  return ret;
};

export const subTS = (a, b) => {
  const mom = momentFromTS(a);
  const res = mom.subtract(b);
  let ret = momentToTS(res);
  ret.type = a.type;
  ret.repInt = a.repInt;
  ret.repMin = a.repMin;
  ret.repMax = a.repMax;
  return ret;
};

export const diffTS = (a, b, u = 'milliseconds') => {
  const momA = momentFromTS(a);
  const momB = momentFromTS(b);
  return momA.diff(momB, u);
};

export const compareTS = (a, b) => {
  // a = typeof a === 'string' ? OrgTimestamp.parse(a) : a;
  // b = typeof b === 'string' ? OrgTimestamp.parse(b) : b;

  const moma = momentFromTS(a);
  const momb = momentFromTS(b);

  if (moma.isBefore(momb)) {
    return -1;
  } else if (moma.isSame(momb)) {
    return 0;
  } else if (moma.isAfter(momb)) {
    return 1;
  }
};

export const calcNextRepeat = (base, x) => {
  // base = typeof base === 'string' ? OrgTimestamp.parse(base) : base;
  // x = typeof x === 'string' ? OrgTimestamp.parse(x) : x;

  const repVal = base.repMin.substr(0, base.repMin.length - 1);
  const repUnit = {
    y: 'years',
    m: 'months',
    w: 'weeks',
    d: 'days',
    h: 'hours'
  }[base.repMin[base.repMin.length - 1]];
  let newTs,
    updateObj = {};
  updateObj[repUnit] = repVal;
  switch (base.repInt) {
    case '+':
      newTs = addTS(base, updateObj);
      break;
    case '++':
      newTs = base;
      do {
        newTs = addTS(newTs, updateObj);
      } while (compareTS(newTs, x) < 0);
      break;
    case '.+':
      newTs = addTS(x, updateObj);
      newTs.type = base.type;
      newTs.repInt = base.repInt;
      newTs.repMin = base.repMin;
      newTs.repMax = base.repMax;
      break;
    default:
      console.log('REPEAT INTERVAL CALCULATION ERROR');
      break;
  }
  return newTs;
};

export const serializeTS = timestamp => {
  const padMaybe = n => (n.toString().length === 1 ? '0' + n : n);
  let r = '';
  let closetag, opentag;
  if (timestamp.type && timestamp.type === 'active') {
    opentag = '<';
    closetag = '>';
  } else {
    opentag = '[';
    closetag = ']';
  }
  r += opentag;
  r +=
    timestamp.year +
    '-' +
    padMaybe(timestamp.month) +
    '-' +
    padMaybe(timestamp.date) +
    ' ';
  r += timestamp.day + ' ';
  r += padMaybe(timestamp.hour) + ':' + padMaybe(timestamp.minute);
  // REPEAT
  if (timestamp.repInt) {
    r += ' ';
    r += timestamp.repInt + timestamp.repMin;
    r += timestamp.repMax ? '/' + timestamp.repMax : '';
  }
  //
  r += closetag;
  return r;
};
