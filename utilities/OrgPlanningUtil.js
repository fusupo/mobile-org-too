class OrgPlanningUtil {
  static getPlanningPart(planning, part) {
    if (planning) {
      return planning[part] || null;
    } else {
      return null;
    }
  }
  static getScheduled(planning) {
    return OrgPlanningUtil.getPlanningPart(planning, 'scheduled');
  }
  static getDeadline(planning) {
    return OrgPlanningUtil.getPlanningPart(planning, 'deadline');
  }
}

module.exports = OrgPlanningUtil;
