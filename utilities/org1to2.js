const orgTimestamp = require('org-parse').OrgTimestamp;
import { padMaybe } from './utils';

const convertTimestamp = tsObj => {
  // console.log('TIMESTAPM OBNJ: ', tsObj);
  const {
    date,
    day,
    hour,
    minute,
    month,
    repInt,
    repMax,
    repMin,
    type,
    year
  } = tsObj;
  // var foo = {
  //   date: 9,
  //   day: 'Mon',
  //   hour: 13,
  //   minute: 40,
  //   month: 4,
  //   repInt: null,
  //   repMax: null,
  //   repMin: null,
  //   type: 'inactive',
  //   year: 2018
  // };
  let repeat = null;
  if (repInt && repMin) {
    repeat = repInt + repMin;
    if (repMax) repeat += '/' + repMax;
  }
  let value = `${year}-${padMaybe(month)}-${padMaybe(date)} ${day} ${padMaybe(
    hour
  )}:${padMaybe(minute)}${repeat ? ' ' + repeat : ''}`;
  value = type === 'inactive' ? `[${value}]` : `<${value}>`;
  const ret = {
    type: 'org.timestamp.' + type,
    date: { type: 'org.date', yyyy: year, mm: month, dd: date, dayName: day },
    dateEnd: null,
    dateStart: null,
    delay: null,
    delayEnd: null,
    delayStart: null,
    refs: {},
    repeat,
    repeatEnd: null,
    repeatStart: null,
    time: {
      hh: hour,
      mm: minute,
      type: 'org.time'
    },
    timeEnd: null,
    timeStart: null,
    value
  };

  return ret;
};

const convertPlanning = planningObj => {
  const { scheduled, deadline, closed } = planningObj;
  const ret = {
    type: 'org.planning',
    scheduled: scheduled ? convertTimestamp(scheduled) : null,
    deadline: deadline ? convertTimestamp(deadline) : null,
    closed: closed ? convertTimestamp(closed) : null
  };
  return ret;
};

const convertPropDrawer = propDrawer => {
  const ret = {
    type: 'org.propDrawer',
    props: {}
  };
  propDrawer.properties.forEach(([key, val]) => {
    switch (key) {
      case 'MOTID':
        //do nothing
        break;
      case 'LAST_REPEAT':
        ret.props[key] = orgTimestamp.parse(val);
        break;
      default:
        ret.props[key] = val;
        break;
    }
    // if (key !== 'MOTID') ret.props[key] = val;
    // if (key === 'LAST_REPEAT') ret.props[key] = orgTimestamp.parse(val);
  });
  return ret;
};

const convertLogbook = logbook => {
  const ret = { type: 'org.logbook', items: [] };
  logbook.entries.forEach(e => {
    const r = Object.assign({}, e);
    switch (r.type) {
      case 'state':
        r.timestamp = orgTimestamp.parse(e.timestamp); //parsetimestamp
        break;
      case 'clock':
        r.start = orgTimestamp.parse(e.start);
        r.end = orgTimestamp.parse(e.end);
        break;
      case 'note':
        r.timestamp = orgTimestamp.parse(e.timestamp); //parsetimestamp
        break;
      default:
        break;
    }
    ret.items.push(r);
  });
  return ret;
};

const convertSection = (planningObj, propDrawer, logbook) => {
  if (
    planningObj.scheduled ||
    planningObj.deadline ||
    planningObj.closed ||
    propDrawer ||
    logbook
  ) {
    const ret = {
      type: 'org.section',
      children: []
    };
    if (planningObj.scheduled || planningObj.deadline || planningObj.closed)
      ret.children.push(convertPlanning(planningObj));
    if (propDrawer) {
      const pd = convertPropDrawer(propDrawer);
      if (Object.keys(pd.props).length > 0) ret.children.push(pd);
    }
    if (logbook) ret.children.push(convertLogbook(logbook));
    return ret.children.length > 0 ? ret : null;
  } else {
    return null;
  }
};

const convertHeadline = (child, nodes) => {
  const { nodeID, children } = child;
  const node = nodes[nodeID];
  const {
    headline,
    logbook,
    propDrawer,
    scheduled,
    deadline,
    closed,
    body
  } = node;

  body ? console.log('BODY!!!!! ==>', body) : null;

  const ret = {
    type: 'org.headline',
    stars: headline.level,
    comment: false,
    keyword: headline.todoKeyword,
    parent: null,
    priority: null,
    section: convertSection(
      { scheduled, deadline, closed },
      propDrawer,
      logbook
    ),
    tags: headline.tags,
    title: headline.content
  };

  if (children) {
    ret.children = children.map(c => convertHeadline(c, nodes));
    ret.children = ret.children.length > 0 ? ret.children : null;
  }

  return ret;
};

const convert = (nodes, tree, settings) => {
  const ret = {
    type: 'org.document',
    section: null,
    headlines: []
  };
  ret.headlines = tree.children.map(c => convertHeadline(c, nodes));
  if (settings) {
    const re = /#\+([A-Za-z]+): ([A-Za-z\.\:\/\*\% ]+)/;
    const res = re.exec(settings);
    ret.section = {
      type: 'org.section',
      children: [
        {
          type: 'org.keyword',
          key: res[1],
          value: res[2]
        }
      ]
    };
  }
  return ret;
};

module.exports.convert = convert;
