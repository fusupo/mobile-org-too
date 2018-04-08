import { uuid, isObject } from './utils';

const orgSection = require('org-parse').OrgSection;

const findInSect = (section, targ) => {
  return section.children.find(sectChild => sectChild.type === targ);
};

const newPropdrawer = properties => {
  return {
    name: 'PROPERTIES',
    properties
  };
};

const xtractPropDrawer = section => {
  const propDrawerObj = findInSect(section, 'org.propDrawer');
  if (propDrawerObj) {
    const properties = Object.entries(propDrawerObj.props).map(([k, v]) => {
      if (isObject(v) && v.type && v.type.startsWith('org.timestamp')) {
        return [k, v.value];
      } else {
        return [k, v];
      }
    });
    return newPropdrawer(properties);
  } else {
    return null;
  }
};

const xtractLogbook = section => {
  const logbookObj = findInSect(section, 'org.logbook');
  if (logbookObj) {
    const entries = logbookObj.items.map(i => {
      const o = Object.assign({}, i);
      if (o.timestamp) o.timestamp = o.timestamp.value;
      if (o.start) o.start = o.start.value;
      if (o.end) o.end = o.end.value;
      return o;
    });
    return {
      entries
    };
  } else {
    return null;
  }
};

const xtractTimestamp = ts => {
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
  return {
    type: ts.type.substr(ts.type.lastIndexOf('.') + 1),
    date: ts.date.dd, //8,
    day: ts.date.dayName, //'Sun',
    hour: ts.time.hh, //0,
    minute: ts.time.mm, //0,
    month: ts.date.mm, //4,
    repInt, //'.+',
    repMax,
    repMin,
    year: ts.date.yyyy
  };
};

const xtractPlanning = section => {
  const planningObj = findInSect(section, 'org.planning');
  if (planningObj) {
    return {
      scheduled: planningObj.scheduled
        ? xtractTimestamp(planningObj.scheduled)
        : null,
      deadline: planningObj.deadline
        ? xtractTimestamp(planningObj.deadline)
        : null,
      closed: planningObj.closed ? xtractTimestamp(planningObj.closed) : null
    };
  } else {
    return null;
  }
};

const parseHeadlines = (headlines, nodes) => {
  return headlines.map(h => {
    let id = uuid();
    let propDrawer = null;
    let logbook = null;
    let planning = '??';
    let scheduled = null;
    let deadline = null;
    let closed = null;

    if (h.section) {
      propDrawer = xtractPropDrawer(h.section);
      logbook = xtractLogbook(h.section);
      planning = xtractPlanning(h.section);

      if (propDrawer) {
        propDrawer.properties.push(['MOTID', id]);
      }

      if (planning) {
        scheduled = planning.scheduled;
        deadline = planning.deadline;
        closed = planning.closed;
      }
    }

    if (!propDrawer) {
      propDrawer = newPropdrawer([['MOTID', id]]);
    }

    const node = {
      id,
      headline: {
        level: h.stars,
        todoKeyword: h.keyword,
        content: h.title,
        tags: h.tags
      },
      opened: null,
      scheduled,
      deadline,
      closed,
      propDrawer,
      logbook,
      body: null
    };
    nodes[node.id] = node;
    return {
      nodeID: node.id,
      children: h.children ? parseHeadlines(h.children, nodes) : []
    };
  });
};

const convert = docObj => {
  const settings = orgSection.serialize(docObj.section);
  const nodes = {};
  const tree = {
    nodeID: 'root',
    children: parseHeadlines(docObj.headlines, nodes)
  };
  return { settings, tree, nodes };
};

module.exports.convert = convert;
