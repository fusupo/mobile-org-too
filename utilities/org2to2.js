import { uuid, isObject } from './utils';

const parseHeadline = (headline, nodes) => {
  let id = uuid();
  headline.id = id;
  nodes[id] = headline;
  if (headline.children)
    headline.children.forEach(h => parseHeadline(h, nodes));
};

const convert = docObj => {
  // const settings = orgSection.serialize(docObj.section);
  const nodes = {};
  if (docObj.headlines) docObj.headlines.forEach(h => parseHeadline(h, nodes));
  return {
    // settings,
    tree: docObj,
    nodes
  };
};

module.exports.convert = convert;
