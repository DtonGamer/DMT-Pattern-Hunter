/**
 * Discovery Sharing Feature
 * Share pattern discoveries via Trac p2p network
 */

const Utils = require('../../src/utils');

class DiscoverySharingFeature {
  constructor(contract) {
    this.contract = contract;
    this.debug = process.env.DEBUG === 'true';
  }

  log(message) {
    if (this.debug) {
      console.log(`[DiscoverySharing] ${message}`);
    }
  }

  async shareDiscovery(pattern, field, userAddress, stats, startBlock, endBlock) {
    try {
      const discoveryKey = `${pattern}_${field}`;

      const discoveredPatterns = await this.contract.state.get('discoveredPatterns') || {};

      if (discoveredPatterns[discoveryKey]) {
        const existing = discoveredPatterns[discoveryKey];
        this.log(`Pattern already discovered: ${discoveryKey} by ${existing.discoverer}`);

        return {
          success: false,
          message: 'Pattern already discovered',
          discoverer: existing.discoverer,
          existing
        };
      }

      const discovery = {
        discoverer: userAddress,
        pattern,
        field,
        startBlock,
        endBlock,
        timestamp: Date.now(),
        verified: false,
        inscriptionId: null,
        stats
      };

      discoveredPatterns[discoveryKey] = discovery;

      await this.contract.state.put('discoveredPatterns', discoveredPatterns);

      this.log(`Shared new discovery: ${discoveryKey} by ${userAddress}`);

      if (this.contract.emit) {
        await this.contract.emit('newDiscovery', discovery);
      }

      return {
        success: true,
        discovery,
        discoveryKey
      };

    } catch (error) {
      this.log(`Error sharing discovery: ${error.message}`);
      throw error;
    }
  }

  async getDiscovery(pattern, field) {
    try {
      const discoveredPatterns = await this.contract.state.get('discoveredPatterns') || {};
      const discoveryKey = `${pattern}_${field}`;

      return discoveredPatterns[discoveryKey] || null;

    } catch (error) {
      this.log(`Error getting discovery: ${error.message}`);
      return null;
    }
  }

  async getAllDiscoveries() {
    try {
      return await this.contract.state.get('discoveredPatterns') || {};
    } catch (error) {
      this.log(`Error getting all discoveries: ${error.message}`);
      return {};
    }
  }

  async getDiscoveriesByDiscoverer(address) {
    try {
      const allDiscoveries = await this.getAllDiscoveries();
      const userDiscoveries = {};

      Object.keys(allDiscoveries).forEach(key => {
        if (allDiscoveries[key].discoverer === address) {
          userDiscoveries[key] = allDiscoveries[key];
        }
      });

      return userDiscoveries;

    } catch (error) {
      this.log(`Error getting discoveries by discoverer: ${error.message}`);
      return {};
    }
  }

  async getDiscoveriesByField(field) {
    try {
      const allDiscoveries = await this.getAllDiscoveries();
      const fieldDiscoveries = {};

      Object.keys(allDiscoveries).forEach(key => {
        const [pattern, fieldNum] = key.split('_');
        if (parseInt(fieldNum) === field) {
          fieldDiscoveries[key] = allDiscoveries[key];
        }
      });

      return fieldDiscoveries;

    } catch (error) {
      this.log(`Error getting discoveries by field: ${error.message}`);
      return {};
    }
  }

  async searchDiscoveries(pattern) {
    try {
      const allDiscoveries = await this.getAllDiscoveries();
      const results = [];

      Object.keys(allDiscoveries).forEach(key => {
        if (key.toLowerCase().includes(pattern.toLowerCase())) {
          results.push({
            key,
            ...allDiscoveries[key]
          });
        }
      });

      return results;

    } catch (error) {
      this.log(`Error searching discoveries: ${error.message}`);
      return [];
    }
  }

  async verifyDiscovery(pattern, field, inscriptionId) {
    try {
      const discoveryKey = `${pattern}_${field}`;

      const discoveredPatterns = await this.contract.state.get('discoveredPatterns') || {};
      const discovery = discoveredPatterns[discoveryKey];

      if (!discovery) {
        throw new Error('Discovery not found');
      }

      discoveredPatterns[discoveryKey] = {
        ...discovery,
        verified: true,
        inscriptionId,
        verifiedAt: Date.now()
      };

      await this.contract.state.put('discoveredPatterns', discoveredPatterns);

      this.log(`Verified discovery: ${discoveryKey} with inscription ${inscriptionId}`);

      return {
        success: true,
        discovery: discoveredPatterns[discoveryKey]
      };

    } catch (error) {
      this.log(`Error verifying discovery: ${error.message}`);
      throw error;
    }
  }

  async getVerifiedDiscoveries() {
    try {
      const allDiscoveries = await this.getAllDiscoveries();
      const verified = {};

      Object.keys(allDiscoveries).forEach(key => {
        if (allDiscoveries[key].verified) {
          verified[key] = allDiscoveries[key];
        }
      });

      return verified;

    } catch (error) {
      this.log(`Error getting verified discoveries: ${error.message}`);
      return {};
    }
  }

  async getDiscoveryCount() {
    try {
      const allDiscoveries = await this.getAllDiscoveries();
      return Object.keys(allDiscoveries).length;
    } catch (error) {
      this.log(`Error getting discovery count: ${error.message}`);
      return 0;
    }
  }

  async getRecentDiscoveries(limit = 10) {
    try {
      const allDiscoveries = await this.getAllDiscoveries();
      const discoveries = Object.entries(allDiscoveries)
        .map(([key, discovery]) => ({ key, ...discovery }))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);

      return discoveries;

    } catch (error) {
      this.log(`Error getting recent discoveries: ${error.message}`);
      return [];
    }
  }

  async syncDiscoveries() {
    try {
      this.log('Syncing discoveries from peers...');

      const localDiscoveries = await this.getAllDiscoveries();

      if (this.contract.peers && this.contract.peers.length > 0) {
        for (const peer of this.contract.peers) {
          try {
            const peerDiscoveries = await this.contract.request(peer, 'getDiscoveries');

            if (peerDiscoveries && typeof peerDiscoveries === 'object') {
              const merged = { ...localDiscoveries, ...peerDiscoveries };
              await this.contract.state.put('discoveredPatterns', merged);
              this.log(`Merged discoveries from peer ${peer}`);
            }
          } catch (error) {
            this.log(`Failed to sync with peer ${peer}: ${error.message}`);
          }
        }
      }

      return await this.getAllDiscoveries();

    } catch (error) {
      this.log(`Error syncing discoveries: ${error.message}`);
      return await this.getAllDiscoveries();
    }
  }
}

module.exports = DiscoverySharingFeature;
