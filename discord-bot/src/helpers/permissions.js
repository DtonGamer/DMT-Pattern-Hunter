/**
 * Permission Helper
 * Handles role-based access control
 */

class PermissionHelper {
  static getUserTier(member, config) {
    const roles = member.roles.cache;

    if (roles.has(config.allowedRoles.Trusted)) {
      return 'trusted';
    }

    if (roles.has(config.allowedRoles.Verified)) {
      return 'verified';
    }

    return 'anonymous';
  }

  static hasPermission(tier, action, config) {
    const permissions = {
      'anonymous': ['scan', 'element', 'discovery', 'reputation', 'leaderboard', 'myscans', 'names', 'link', 'notifications'],
      'verified': ['scan', 'element', 'generate', 'reserve', 'discovery', 'reputation', 'leaderboard', 'myscans', 'names', 'link', 'notifications'],
      'trusted': ['scan', 'element', 'generate', 'reserve', 'discovery', 'reputation', 'leaderboard', 'myscans', 'names', 'link', 'notifications']
    };

    const allowedActions = permissions[tier] || permissions['anonymous'];
    return allowedActions.includes(action);
  }

  static getScanLimit(tier, config) {
    const tiers = config.tiers || {};
    const tierConfig = tiers[tier] || tiers.anonymous;

    return tierConfig.scansPerDay || 5;
  }
}

export default PermissionHelper;
