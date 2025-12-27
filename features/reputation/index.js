/**
 * Reputation Feature
 * User reputation and tier-based rate limiting system
 */

const Utils = require('../../src/utils');

class ReputationFeature {
  constructor(contract) {
    this.contract = contract;
    this.debug = process.env.DEBUG === 'true';
  }

  log(message) {
    if (this.debug) {
      console.log(`[Reputation] ${message}`);
    }
  }

  async getUserReputation(address) {
    try {
      const userReputation = await this.contract.state.get('userReputation') || {};

      if (!userReputation[address]) {
        const newUser = {
          reputation: 0,
          tier: 'anonymous',
          scansToday: 0,
          discoveries: 0,
          verifiedDiscoveries: 0,
          violations: 0,
          joinedAt: Date.now(),
          lastScanAt: null,
          lastReset: Date.now()
        };

        userReputation[address] = newUser;
        await this.contract.state.put('userReputation', userReputation);

        this.log(`Created new user: ${address}`);
      }

      return userReputation[address];

    } catch (error) {
      this.log(`Error getting user reputation: ${error.message}`);
      return null;
    }
  }

  async incrementScans(address) {
    try {
      const userReputation = await this.contract.state.get('userReputation') || {};
      const user = userReputation[address];

      if (!user) {
        await this.getUserReputation(address);
        return await this.incrementScans(address);
      }

      const today = Utils.getTodayString();
      const lastReset = user.lastReset ? new Date(user.lastReset) : null;

      if (!lastReset || !Utils.isSameDay(user.lastReset, Date.now())) {
        user.scansToday = 0;
        user.lastReset = Date.now();
        this.log(`Reset daily scan counter for ${address}`);
      }

      user.scansToday += 1;
      user.lastScanAt = Date.now();
      user.reputation += 1;

      userReputation[address] = user;
      await this.contract.state.put('userReputation', userReputation);

      this.log(`Incremented scans for ${address}: ${user.scansToday} today`);

      return user;

    } catch (error) {
      this.log(`Error incrementing scans: ${error.message}`);
      throw error;
    }
  }

  async addDiscovery(address, pattern, field) {
    try {
      const userReputation = await this.contract.state.get('userReputation') || {};
      const user = userReputation[address];

      if (!user) {
        await this.getUserReputation(address);
        return await this.addDiscovery(address, pattern, field);
      }

      user.discoveries += 1;
      user.reputation += 50;

      await this.checkTierUpgrade(address, user);

      userReputation[address] = user;
      await this.contract.state.put('userReputation', userReputation);

      await this.updateLeaderboard(address, user);

      this.log(`Added discovery for ${address}: pattern=${pattern} field=${field}`);

      return user;

    } catch (error) {
      this.log(`Error adding discovery: ${error.message}`);
      throw error;
    }
  }

  async addVerifiedDiscovery(address) {
    try {
      const userReputation = await this.contract.state.get('userReputation') || {};
      const user = userReputation[address];

      if (!user) {
        await this.getUserReputation(address);
        return await this.addVerifiedDiscovery(address);
      }

      user.verifiedDiscoveries += 1;
      user.reputation += 100;

      await this.checkTierUpgrade(address, user);

      userReputation[address] = user;
      await this.contract.state.put('userReputation', userReputation);

      this.log(`Added verified discovery for ${address}`);

      return user;

    } catch (error) {
      this.log(`Error adding verified discovery: ${error.message}`);
      throw error;
    }
  }

  async checkTierUpgrade(address, user) {
    try {
      const config = this.contract.config?.tiers || {};

      if (user.tier === 'anonymous' && user.discoveries >= config.verified?.upgradeRequirement?.discoveries) {
        user.tier = 'verified';
        this.log(`User ${address} upgraded to VERIFIED tier`);
      }

      if (user.tier === 'verified' &&
          user.discoveries >= config.trusted?.upgradeRequirement?.discoveries &&
          user.verifiedDiscoveries >= config.trusted?.upgradeRequirement?.verifiedDiscoveries) {
        user.tier = 'trusted';
        this.log(`User ${address} upgraded to TRUSTED tier`);
      }

    } catch (error) {
      this.log(`Error checking tier upgrade: ${error.message}`);
    }
  }

  async checkScanLimit(address) {
    try {
      const user = await this.getUserReputation(address);

      if (!user) {
        throw new Error('User not found');
      }

      const config = this.contract.config?.tiers || {};
      const tierConfig = config[user.tier] || config.anonymous;

      if (tierConfig.scansPerDay === -1) {
        return { allowed: true, remaining: -1, tier: user.tier };
      }

      const today = Utils.getTodayString();
      const lastReset = user.lastReset ? new Date(user.lastReset) : null;

      if (!lastReset || !Utils.isSameDay(user.lastReset, Date.now())) {
        await this.resetDailyCounter(address);
        return {
          allowed: true,
          remaining: tierConfig.scansPerDay - 1,
          tier: user.tier
        };
      }

      if (user.scansToday >= tierConfig.scansPerDay) {
        return {
          allowed: false,
          remaining: 0,
          tier: user.tier,
          limit: tierConfig.scansPerDay,
          error: `Daily scan limit reached (${tierConfig.scansPerDay})`,
          upgradeMessage: user.tier === 'anonymous'
            ? 'Connect wallet and make 10 discoveries to upgrade to VERIFIED (100 scans/day)'
            : user.tier === 'verified'
              ? 'Make 50 discoveries with 20 verified to upgrade to TRUSTED (1000 scans/day)'
              : 'You are already at the highest tier'
        };
      }

      return {
        allowed: true,
        remaining: tierConfig.scansPerDay - user.scansToday,
        tier: user.tier
      };

    } catch (error) {
      this.log(`Error checking scan limit: ${error.message}`);
      throw error;
    }
  }

  async resetDailyCounter(address) {
    try {
      const userReputation = await this.contract.state.get('userReputation') || {};
      const user = userReputation[address];

      if (user) {
        user.scansToday = 0;
        user.lastReset = Date.now();

        userReputation[address] = user;
        await this.contract.state.put('userReputation', userReputation);

        this.log(`Reset daily scan counter for ${address}`);
      }

    } catch (error) {
      this.log(`Error resetting daily counter: ${error.message}`);
    }
  }

  async updateLeaderboard(address, user) {
    try {
      const leaderboard = await this.contract.state.get('leaderboard') || {
        topDiscoverers: [],
        topPatterns: []
      };

      const existing = leaderboard.topDiscoverers.find(e => e.address === address);

      if (existing) {
        existing.discoveries = user.discoveries;
        existing.reputation = user.reputation;
        existing.tier = user.tier;
      } else {
        leaderboard.topDiscoverers.push({
          address,
          discoveries: user.discoveries,
          reputation: user.reputation,
          tier: user.tier
        });
      }

      leaderboard.topDiscoverers.sort((a, b) => b.reputation - a.reputation);
      leaderboard.topDiscoverers = leaderboard.topDiscoverers.slice(0, 100);

      await this.contract.state.put('leaderboard', leaderboard);

      this.log(`Updated leaderboard for ${address}`);

    } catch (error) {
      this.log(`Error updating leaderboard: ${error.message}`);
    }
  }

  async getLeaderboard(type = 'discoverers') {
    try {
      const leaderboard = await this.contract.state.get('leaderboard') || {
        topDiscoverers: [],
        topPatterns: []
      };

      return leaderboard[type === 'discoverers' ? 'topDiscoverers' : 'topPatterns'] || [];

    } catch (error) {
      this.log(`Error getting leaderboard: ${error.message}`);
      return [];
    }
  }

  async recordViolation(address, reason) {
    try {
      const userReputation = await this.contract.state.get('userReputation') || {};
      const user = userReputation[address];

      if (user) {
        user.violations += 1;
        user.reputation = Math.max(0, user.reputation - 10);

        if (user.violations >= 10 && user.tier !== 'anonymous') {
          user.tier = 'anonymous';
          this.log(`Downgraded ${address} to anonymous tier due to violations`);
        }

        userReputation[address] = user;
        await this.contract.state.put('userReputation', userReputation);

        this.log(`Recorded violation for ${address}: ${reason}`);
      }

      return user;

    } catch (error) {
      this.log(`Error recording violation: ${error.message}`);
      throw error;
    }
  }

  async getTopUsers(limit = 10) {
    try {
      const leaderboard = await this.getLeaderboard('discoverers');
      return leaderboard.slice(0, limit);
    } catch (error) {
      this.log(`Error getting top users: ${error.message}`);
      return [];
    }
  }

  async getUserRank(address) {
    try {
      const leaderboard = await this.getLeaderboard('discoverers');
      const index = leaderboard.findIndex(e => e.address === address);

      if (index === -1) {
        return { rank: null, message: 'Not on leaderboard' };
      }

      return { rank: index + 1, total: leaderboard.length };

    } catch (error) {
      this.log(`Error getting user rank: ${error.message}`);
      return { rank: null, message: 'Error' };
    }
  }

  async verifyUser(address) {
    try {
      const userReputation = await this.contract.state.get('userReputation') || {};
      const user = userReputation[address];

      if (user) {
        user.tier = 'verified';
        userReputation[address] = user;
        await this.contract.state.put('userReputation', userReputation);

        this.log(`Manually verified user: ${address}`);

        return user;
      }

      throw new Error('User not found');

    } catch (error) {
      this.log(`Error verifying user: ${error.message}`);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const userReputation = await this.contract.state.get('userReputation') || {};
      return Object.entries(userReputation).map(([address, data]) => ({
        address,
        ...data
      }));
    } catch (error) {
      this.log(`Error getting all users: ${error.message}`);
      return [];
    }
  }
}

module.exports = ReputationFeature;
