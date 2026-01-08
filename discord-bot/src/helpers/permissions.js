/**
 * Permission Helper
 * Handles reputation-based access control using blockchain data
 */

class PermissionHelper {
  static async getUserTier(userId, btcAddress = null, contract = null) {
    try {
      // If user hasn't linked a BTC address, they're anonymous
      if (!btcAddress) {
        return 'anonymous';
      }

      // If contract is not available, default to anonymous
      if (!contract) {
        return 'anonymous';
      }

      // Query the contract for user reputation (which includes discovery counts)
      const reputation = await contract.getUserReputation(btcAddress);

      if (!reputation || typeof reputation.totalDiscoveries === 'undefined') {
        return 'anonymous';
      }

      const { totalDiscoveries, verifiedDiscoveries = 0 } = reputation;

      // Check Trusted tier (50 total, 20 verified)
      if (totalDiscoveries >= 50 && verifiedDiscoveries >= 20) {
        return 'trusted';
      }

      // Check Verified tier (10 total discoveries)
      if (totalDiscoveries >= 10) {
        return 'verified';
      }

      // User has linked address but doesn't meet verified threshold yet
      // They remain anonymous until they reach 10 discoveries
      return 'anonymous';

    } catch (error) {
      console.error('[PermissionHelper] Error getting user tier:', error);
      return 'anonymous'; // Fail safely
    }
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
    const tiers = config?.tiers || {};
    const tierConfig = tiers[tier] || tiers.anonymous;

    return tierConfig?.scansPerDay || 5;
  }
}

export default PermissionHelper;
