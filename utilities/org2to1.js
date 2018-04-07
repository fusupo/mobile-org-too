import { uuid } from './utils';
const orgSection = require('org-parse').OrgSection;

const findInSect = (section, targ) => {
  return section.children.find(sectChild => sectChild.type === targ);
};

const xtractPropdrawer = section => {
  const propdrawerObj = findInSect(section, 'org.propDrawer');
  if (propdrawerObj) {
    return { name: 'PROPERTIES' };
  } else {
    return null;
  }
};

const xtractLogbook = section => {
  const logbookObj = findInSect(section, 'org.logbook');
  if (logbookObj) {
    return { entries: [] };
  } else {
    return null;
  }
};

const xtractTimestamp = ts => {
  console.log(ts);
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
  console.log(rep, repInt, repMinMax, repMin, repMax);
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

const fuckingShit = (headlines, nodes) => {
  return headlines.map(h => {
    let propdrawer = null;
    let logbook = null;
    let planning = '??';
    let scheduled = null;
    let deadline = null;
    let closed = null;

    if (h.section) {
      propdrawer = xtractPropdrawer(h.section);
      logbook = xtractLogbook(h.section);
      planning = xtractPlanning(h.section);

      if (planning) {
        scheduled = planning.scheduled;
        deadline = planning.deadline;
        closed = planning.closed;
      }
    }

    const node = {
      id: uuid(),
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
      propdrawer,
      logbook,
      body: null
    };
    nodes[node.id] = node;
    return {
      nodeId: node.id,
      children: h.children ? fuckingShit(h.children, nodes) : null
    };
  });
};

const convert = docObj => {
  const settings = orgSection.serialize(docObj.section);
  const nodes = {};
  const tree = {
    nodeID: 'root',
    children: fuckingShit(docObj.headlines, nodes)
  };
  return { settings, tree, nodes };
};

module.exports.convert = convert;
