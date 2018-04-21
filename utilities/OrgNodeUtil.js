const OrgPlanningUtil = require('./OrgPlanningUtil');

class OrgNodeUtil {
  static getSectionChild(node, type) {
    if (node.section) {
      return node.section.children.find(sc => sc.type === type) || null;
    } else {
      return null;
    }
  }

  static getPropDrawer(node) {
    return OrgNodeUtil.getSectionChild(node, 'org.propDrawer');
  }

  static getLogbook(node) {
    return OrgNodeUtil.getSectionChild(node, 'org.logbook');
  }

  static getPlanning(node) {
    return OrgNodeUtil.getSectionChild(node, 'org.planning');
  }

  static getScheduled(node) {
    const planning = OrgNodeUtil.getPlanning(node);
    return OrgPlanningUtil.getScheduled(planning);
  }

  static getDeadline(node) {
    const planning = OrgNodeUtil.getPlanning(node);
    return OrgPlanningUtil.getDeadline(planning);
  }
}

module.exports = OrgNodeUtil;
