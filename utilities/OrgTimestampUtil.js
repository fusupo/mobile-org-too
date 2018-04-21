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
    return `[${mom.format('YYYY-MM-DD ddd HH:mm')}]`;
  }

  static momentToObj(mom) {
    return {
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
      type: 'org.timestamp.inactive' //active?
      // value: '<2018-04-21 Sat 00:00 .+1d>';
    };

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
    return OrgTimestampUtil.momentToObj(OrgTimestampUtil.momentFromObj(obj));
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
    base =
      typeof base === 'string'
        ? xtractTimestamp(orgTimestamp.parse(base))
        : base;
    x = typeof x === 'string' ? xtractTimestamp(orgTimestamp.parse(x)) : x;

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
        newTs = OrgTimestampUtil.add(base, updateObj);
        break;
      case '++':
        newTs = base;
        do {
          newTs = OrgTimestampUtil.add(newTs, updateObj);
        } while (OrgTimestampUtil.compare(newTs, x) < 0);
        break;
      case '.+':
        x.hour = base.hour;
        x.minute = base.minute;
        newTs = OrgTimestampUtil.add(x, updateObj);
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
  }
  // static serialize(timestamp) {
  //   const padMaybe = n => (n.toString().length === 1 ? '0' + n : n);
  //   let r = '';
  //   let closetag, opentag;
  //   if (timestamp.type && timestamp.type === 'active') {
  //     opentag = '<';
  //     closetag = '>';
  //   } else {
  //     opentag = '[';
  //     closetag = ']';
  //   }
  //   r += opentag;
  //   r +=
  //     timestamp.year +
  //     '-' +
  //     padMaybe(timestamp.month) +
  //     '-' +
  //     padMaybe(timestamp.date) +
  //     ' ';
  //   r += timestamp.day + ' ';
  //   r += padMaybe(timestamp.hour) + ':' + padMaybe(timestamp.minute);
  //   // REPEAT
  //   if (timestamp.repInt) {
  //     r += ' ';
  //     r += timestamp.repInt + timestamp.repMin;
  //     r += timestamp.repMax ? '/' + timestamp.repMax : '';
  //   }
  //   //
  //   r += closetag;
  //   return r;
  // }

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

  // static getRepMinUnit(ts){

  // }

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
}

module.exports = OrgTimestampUtil;
