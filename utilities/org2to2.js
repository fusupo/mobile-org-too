import { uuid, isObject } from './utils';

const parseHeadline = headline => {
  let id = uuid();
  headline.id = id;
  if (headline.children) headline.children.forEach(h => parseHeadline(h));
};

const convert = docObj => {
  // const settings = orgSection.serialize(docObj.section);
  if (docObj.headlines) docObj.headlines.forEach(h => parseHeadline(h));
  return {
    // settings,
    tree: docObj
  };
};

module.exports.convert = convert;
