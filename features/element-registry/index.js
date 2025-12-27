/**
 * Element Registry Feature
 * Track .element registrations and availability
 */

const Utils = require('../../src/utils');
const { getFieldDescription } = require('../../src/field-map');

class ElementRegistryFeature {
  constructor(contract, indexer) {
    this.contract = contract;
    this.indexer = indexer;
    this.debug = process.env.DEBUG === 'true';
  }

  log(message) {
    if (this.debug) {
      console.log(`[ElementRegistry] ${message}`);
    }
  }

  async checkAvailability(name, pattern, field) {
    try {
      const nameValidation = Utils.validateElementName(name);
      if (!nameValidation.valid) {
        throw new Error(nameValidation.error);
      }

      const fieldValidation = Utils.parseField(field);
      if (!fieldValidation.valid) {
        throw new Error(fieldValidation.error);
      }

      const elementId = `${name}.${pattern}.${field}.element`;

      this.log(`Checking availability: ${elementId}`);

      const discoveryKey = `${pattern}_${field}`;
      const discoveredPatterns = await this.contract.state.get('discoveredPatterns') || {};
      const localEntry = discoveredPatterns[discoveryKey];

      if (localEntry?.verified) {
        this.log(`Element verified in local state: ${elementId}`);
        return {
          available: false,
          elementId,
          registered: true,
          verified: true,
          discoverer: localEntry.discoverer,
          inscriptionId: localEntry.inscriptionId,
          timestamp: localEntry.timestamp,
          source: 'local'
        };
      }

      const element = await this.indexer.getElement(elementId);

      if (element) {
        this.log(`Element found on ord-tap: ${elementId}`);

        await this.updateDiscoveryAsVerified(discoveryKey, element);

        return {
          available: false,
          elementId,
          registered: true,
          verified: true,
          owner: element.owner,
          inscriptionId: element.inscription_id,
          timestamp: element.timestamp || Date.now(),
          source: 'ord-tap'
        };
      }

      const reserved = await this.contract.state.get(`reserved:${elementId}`);
      if (reserved) {
        if (reserved.expiresAt && Date.now() > reserved.expiresAt) {
          await this.contract.state.del(`reserved:${elementId}`);
          this.log(`Reservation expired: ${elementId}`);
        } else {
          this.log(`Element reserved: ${elementId}`);
          return {
            available: false,
            elementId,
            registered: false,
            reserved: true,
            reservedBy: reserved.by,
            reservedAt: reserved.at,
            expiresAt: reserved.expiresAt,
            source: 'local'
          };
        }
      }

      this.log(`Element available: ${elementId}`);

      return {
        available: true,
        elementId,
        registered: false,
        verified: false,
        reserved: false,
        source: 'combined'
      };

    } catch (error) {
      this.log(`Error checking availability: ${error.message}`);
      throw error;
    }
  }

  async reservePattern(name, pattern, field, userAddress, durationHours = 24) {
    try {
      const check = await this.checkAvailability(name, pattern, field);

      if (!check.available) {
        throw new Error(`Element ${check.elementId} is not available`);
      }

      const elementId = `${name}.${pattern}.${field}.element`;
      const expiresAt = Date.now() + (durationHours * 60 * 60 * 1000);

      await this.contract.state.put(`reserved:${elementId}`, {
        by: userAddress,
        at: Date.now(),
        expiresAt
      });

      this.log(`Reserved ${elementId} for ${userAddress} until ${new Date(expiresAt).toISOString()}`);

      return {
        success: true,
        elementId,
        reservedAt: Date.now(),
        expiresAt,
        durationHours
      };

    } catch (error) {
      this.log(`Error reserving pattern: ${error.message}`);
      throw error;
    }
  }

  async cancelReservation(elementId, userAddress) {
    try {
      const reserved = await this.contract.state.get(`reserved:${elementId}`);

      if (!reserved) {
        throw new Error('Reservation not found');
      }

      if (reserved.by !== userAddress) {
        throw new Error('You can only cancel your own reservations');
      }

      await this.contract.state.del(`reserved:${elementId}`);

      this.log(`Cancelled reservation: ${elementId}`);

      return { success: true };

    } catch (error) {
      this.log(`Error cancelling reservation: ${error.message}`);
      throw error;
    }
  }

  async getDiscoveredPatterns() {
    try {
      return await this.contract.state.get('discoveredPatterns') || {};
    } catch (error) {
      this.log(`Error getting discovered patterns: ${error.message}`);
      return {};
    }
  }

  async getPatternsByField(field) {
    try {
      const allPatterns = await this.getDiscoveredPatterns();
      const result = {};

      Object.keys(allPatterns).forEach(key => {
        const [pattern, fieldNum] = key.split('_');
        if (parseInt(fieldNum) === field) {
          result[key] = allPatterns[key];
        }
      });

      return result;

    } catch (error) {
      this.log(`Error getting patterns by field: ${error.message}`);
      return {};
    }
  }

  async suggestAvailableNames(pattern, field) {
    try {
      const suggestions = [];
      const prefixes = ['satoshi', 'lucky', 'crypto', 'bitcoin', 'tap', 'nft', 'digital', 'ordinal', 'rare', 'special'];

      for (const prefix of prefixes) {
        try {
          const check = await this.checkAvailability(prefix, pattern, field);
          if (check.available) {
            suggestions.push({
              name: prefix,
              elementId: check.elementId
            });
          }
        } catch (error) {
          this.log(`Error checking ${prefix}: ${error.message}`);
        }

        if (suggestions.length >= 5) break;
      }

      return suggestions;

    } catch (error) {
      this.log(`Error suggesting names: ${error.message}`);
      return [];
    }
  }

  async updateDiscoveryAsVerified(discoveryKey, element) {
    try {
      const discoveredPatterns = await this.contract.state.get('discoveredPatterns') || {};

      if (discoveredPatterns[discoveryKey]) {
        discoveredPatterns[discoveryKey] = {
          ...discoveredPatterns[discoveryKey],
          verified: true,
          inscriptionId: element.inscription_id,
          verifiedAt: Date.now()
        };

        await this.contract.state.put('discoveredPatterns', discoveredPatterns);

        this.log(`Updated discovery as verified: ${discoveryKey}`);
      }

    } catch (error) {
      this.log(`Error updating discovery: ${error.message}`);
    }
  }

  async getMyReservations(userAddress) {
    try {
      const reservations = [];

      for (const key of Object.keys(await this.contract.state.keys() || {})) {
        if (key.startsWith('reserved:')) {
          const reserved = await this.contract.state.get(key);

          if (reserved && reserved.by === userAddress) {
            reservations.push({
              elementId: key.replace('reserved:', ''),
              ...reserved
            });
          }
        }
      }

      return reservations;

    } catch (error) {
      this.log(`Error getting reservations: ${error.message}`);
      return [];
    }
  }

  async cleanupExpiredReservations() {
    try {
      const now = Date.now();
      let cleaned = 0;

      for (const key of Object.keys(await this.contract.state.keys() || {})) {
        if (key.startsWith('reserved:')) {
          const reserved = await this.contract.state.get(key);

          if (reserved && reserved.expiresAt && now > reserved.expiresAt) {
            await this.contract.state.del(key);
            cleaned++;
          }
        }
      }

      if (cleaned > 0) {
        this.log(`Cleaned up ${cleaned} expired reservations`);
      }

      return cleaned;

    } catch (error) {
      this.log(`Error cleaning up reservations: ${error.message}`);
      return 0;
    }
  }
}

module.exports = ElementRegistryFeature;
