export default class OrgDocUtil {
  static findHeadlineWithTitle(doc, title) {
    return doc.headlines.find(h => h.title === title);
  }
}
