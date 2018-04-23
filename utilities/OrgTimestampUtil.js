const orgTimestamp = require('org-parse').OrgTimestamp;
import moment from 'moment';
import { convert as convert2to1, xtractTimestamp } from './org2to1';
import { convert as convert1to2 } from './org1to2';

// var moment = require('moment');
// moment().format();

// const org_ts_re = /<([0-9]{4}-[0-9]{2}-[0-9]{2} ?[^\r\n>]*?)>/;
// const org_ts_inactive_re = /\[([0-9]{4}-[0-9]{2}-[0-9]{2} ?[^\r\n>]*?)\]/;
// const org_ts_re0 = /(([0-9]{4})-([0-9]{2})-([0-9]{2}) +([^\> ]+)? +(([0-9]{1,2}):([0-9]{2}))?)/;
// const org_tr_re = new RegExp(org_ts_re.source + '--?-?' + org_ts_re.source);
// const org_repeat_re = /<[0-9]{4}-[0-9][0-9]-[0-9][0-9] [^>\n]*?([.+]?\+)([0-9]+[hdwmy])(?:\/([0-9]+[hdwmy]))?/;

//<2017-01-08 Sun 12:30>

class OrgTimestampUtil {
  // static parse(src) {
  //   if (src instanceof Date) {
  //     return OrgTimestamp.parseDate(src);
  //   } else if (typeof src === 'string') {
  //     return OrgTimestamp.parseStr(src);
  //   }
  // }
  // static parseStr(srcStr) {
  //   // todo: parse timestamps without hour:minute parts without error
  //   const matchRes = srcStr.match(org_ts_re);
  //   let type;
  //   if (matchRes !== null) {
  //     matchRes[0];
  //     type = 'active';
  //   } else {
  //     srcStr.match(org_ts_inactive_re)[0];
  //     type = 'inactive';
  //   }
  //   const date = srcStr.match(org_ts_re0);
  //   const repeat = srcStr.match(org_repeat_re);
  //   return {
  //     // srcStr,
  //     type,
  //     year: +date[2],
  //     month: +date[3],
  //     date: +date[4],
  //     day: date[5],
  //     hour: +date[7],
  //     minute: +date[8],
  //     repInt: repeat && repeat[1] ? repeat[1] : null,
  //     repMin: repeat && repeat[2] ? repeat[2] : null,
  //     repMax: repeat && repeat[3] ? repeat[3] : null
  //   };
  // }

  // static parseDate(srcDate) {
  //   const mom = srcDate === undefined ? moment() : moment(srcDate);
  //   return {
  //     // srcStr: '',
  //     type: 'inactive',
  //     year: mom.year(),
  //     month: mom.month() + 1,
  //     date: mom.date(),
  //     day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][mom.day()],
  //     hour: mom.hour(),
  //     minute: mom.minute(),
  //     repInt: null,
  //     repMin: null,
  //     repMax: null
  //   };
  // }

  static now() {
    return OrgTimestampUtil.momentToObj(moment());
  }

  static momentFromObj(obj) {
    return moment({
      year: obj.date.yyyy,
      month: obj.date.mm - 1,
      date: obj.date.dd,
      hour: obj.time.hh,
      minute: obj.time.mm
    });
  }

  static momentFromString(str) {
    return moment(str, 'YYYY-MM-DD ddd HH:mm');
  }

  static momentToString(mom) {
    return `${mom.format('YYYY-MM-DD ddd HH:mm')}`;
  }

  static toString(ts) {
    const { date, time } = ts;

    return `${date.yyyy}-${(date.mm + '').padStart(2, '0')}-${(date.dd + ''
    ).padStart(2, '0')} ${date.dayName} ${('' + time.hh).padStart(
      2,
      '0'
    )}:${('' + time.mm).padStart(2, '0')}${ts.repeat ? ' ' + ts.repeat : ''}`;
  }

  static updateValue(ts) {
    const ret = OrgTimestampUtil.clone(ts);
    let valStr = OrgTimestampUtil.toString(ts);
    if (ret.type === 'org.timestamp.inactive') {
      valStr = `[${valStr}]`;
    } else if (ret.type === 'org.timestamp.active') {
      valStr = `<${valStr}>`;
    }
    ret.value = valStr;
    return ret;
  }

  static momentToObj(mom, type = 'inactive') {
    return OrgTimestampUtil.updateValue({
      date: {
        type: 'org.date',
        yyyy: mom.year(),
        mm: mom.month() + 1,
        dd: mom.date(),
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][mom.day()]
      },
      dateEnd: null,
      dateStart: null,
      delay: null,
      delayEnd: null,
      delayStart: null,
      // repeat: '.+1d',
      // repeatEnd: null,
      // repeatStart: null,
      time: {
        type: 'org.time',
        hh: mom.hour(),
        mm: mom.minute()
      },
      timeEnd: null,
      timeStart: null,
      type: `org.timestamp.${type}` //active?
    });

    // return {
    //   // srcStr: '',
    //   type: 'inactive',
    //   year: mom.year(),
    //   month: mom.month() + 1,
    //   date: mom.date(),
    //   day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][mom.day()],
    //   hour: mom.hour(),
    //   minute: mom.minute(),
    //   repInt: null,
    //   repMin: null,
    //   repMax: null
    // };
  }

  static clone(obj) {
    let date = obj.date ? Object.assign({}, obj.date) : null;
    let dateStart = obj.dateStart ? Object.assign({}, obj.dateStart) : null;
    let dateEnd = obj.dateEnd ? Object.assign({}, obj.dateEnd) : null;
    let delay = obj.delay || null;
    let delayStart = obj.delayStart || null;
    let delayEnd = obj.delayEnd || null;
    let repeat = obj.repeat || null;
    let repeatStart = obj.repeatStart || null;
    let repeatEnd = obj.repeatEnd || null;
    let time = obj.time ? Object.assign({}, obj.time) : null;
    let timeStart = obj.timeStart ? Object.assign({}, obj.timeStart) : null;
    let timeEnd = obj.timeEnd ? Object.assign({}, obj.timeEnd) : null;
    let type = obj.type;
    let value = obj.value || null;

    return {
      date,
      dateStart,
      dateEnd,
      delay,
      delayStart,
      delayEnd,
      repeat,
      repeatStart,
      repeatEnd,
      time,
      timeStart,
      timeEnd,
      type,
      value
    };
  }

  static add(a, b) {
    const mom = OrgTimestampUtil.momentFromObj(a);
    const res = mom.add(b);
    let ret = OrgTimestampUtil.momentToObj(res);
    ret.type = a.type;
    ret.repeat = a.repeat;
    ret.repeatStart = a.repeatStart;
    ret.repeatEnd = a.repeatEnd;
    ret.value = a.value;
    return ret;
  }
  static sub(a, b) {
    const mom = OrgTimestampUtil.momentFromObj(a);
    const res = mom.subtract(b);
    let ret = OrgTimestampUtil.momentToObj(res);
    ret.type = a.type;
    ret.repeat = a.repeat;
    ret.repeatStart = a.repeatStart;
    ret.repeatEnd = a.repeatEnd;
    ret.value = a.value;
    return ret;
  }
  static diff(a, b, u = 'milliseconds') {
    const momA = OrgTimestampUtil.momentFromObj(a);
    const momB = OrgTimestampUtil.momentFromObj(b);
    return momA.diff(momB, u);
  }
  static compare(a, b) {
    if (!a && b) {
      return 1;
    } else if (a && !b) {
      return -1;
    } else if (!a && !b) {
      return 0;
    }

    const moma =
      typeof a === 'string'
        ? OrgTimestampUtil.momentFromString(a)
        : OrgTimestampUtil.momentFromObj(a);
    const momb =
      typeof b === 'string'
        ? OrgTimestampUtil.momentFromString(b)
        : OrgTimestampUtil.momentFromObj(b);

    if (moma.isBefore(momb)) {
      return -1;
    } else if (moma.isSame(momb)) {
      return 0;
    } else if (moma.isAfter(momb)) {
      return 1;
    }
  }

  static calcNextRepeat(base, x) {
    base = typeof base === 'string' ? orgTimestamp.parse(base) : base;
    console.log(x);
    x = typeof x === 'string' ? orgTimestamp.parse(x) : x;

    const match = /([.+][+]?){1}(?:([1-9]+)([dwmy])){1}(?:\/(?:([1-9]+)([dwmy]))){0,1}/.exec(
      base.repeat
    );

    const repInt = match[1];
    const repVal = match[2];
    const repUnit = {
      y: 'years',
      m: 'months',
      w: 'weeks',
      d: 'days',
      h: 'hours'
    }[match[3]];

    let newTs = {};
    let updateObj = {};
    updateObj[repUnit] = repVal;

    switch (repInt) {
      case '+':
        newTs = OrgTimestampUtil.add(base, updateObj);
        break;
      case '++':
        newTs = base;
        do {
          newTs = OrgTimestampUtil.add(newTs, updateObj);
        } while (OrgTimestampUtil.compare(newTs, x) < 0);
        break;
      case '.+':
        newTs = OrgTimestampUtil.clone(x);
        console.log(newTs);
        newTs.time = Object.assign({}, base.time);
        console.log('updObj', updateObj);
        newTs = OrgTimestampUtil.add(newTs, updateObj);
        console.log(newTs);
        newTs.type = base.type;
        newTs.repeat = base.repeat;
        break;
      default:
        console.log('REPEAT INTERVAL CALCULATION ERROR');
        break;
    }
    newTs = OrgTimestampUtil.updateValue(newTs);
    return newTs;
  }

  static serialize(timestamp) {
    return timestamp.value;
  }

  ////////////////////////////////////////////////////////////////////////////////

  static getRepMin(ts) {
    const rep = ts.repeat;
    const repInt = rep ? rep.substr(0, rep.lastIndexOf('+') + 1) : null;
    let repMinMax = rep ? rep.substr(rep.lastIndexOf('+') + 1) : null;
    let repMin = repMinMax
      ? repMinMax.indexOf('/') !== -1
        ? repMinMax.substr(0, repMinMax.indexOf('/'))
        : repMinMax
      : null;
    let repMax = repMinMax
      ? repMinMax.indexOf('/') !== -1
        ? repMinMax.substr(repMinMax.indexOf('/') + 1)
        : null
      : null;
    return repMin;
  }

  static getRepMax(ts) {
    const rep = ts.repeat;
    const repInt = rep ? rep.substr(0, rep.lastIndexOf('+') + 1) : null;
    let repMinMax = rep ? rep.substr(rep.lastIndexOf('+') + 1) : null;
    let repMin = repMinMax
      ? repMinMax.indexOf('/') !== -1
        ? repMinMax.substr(0, repMinMax.indexOf('/'))
        : repMinMax
      : null;
    let repMax = repMinMax
      ? repMinMax.indexOf('/') !== -1
        ? repMinMax.substr(repMinMax.indexOf('/') + 1)
        : null
      : null;
    return repMax;
  }

  // static getRepMaxUnit(ts){

  // }
  static parse(tsStr) {
    return orgTimestamp.parse(tsStr);
  }
}

module.exports = OrgTimestampUtil;
