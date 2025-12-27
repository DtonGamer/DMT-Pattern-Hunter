/**
 * Utility Functions for DMT Pattern Scanner
 */

class Utils {
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static countPattern(text, pattern) {
    if (!text || !pattern) return 0;

    const lowerText = String(text).toLowerCase();
    const lowerPattern = String(pattern).toLowerCase();

    let count = 0;
    let pos = 0;

    while ((pos = lowerText.indexOf(lowerPattern, pos)) !== -1) {
      count++;
      pos += lowerPattern.length;
    }

    return count;
  }

  static isValidPattern(pattern) {
    if (!pattern || typeof pattern !== 'string') {
      return false;
    }

    if (pattern.length > 100) {
      return false;
    }

    return true;
  }

  static formatAddress(address) {
    if (!address) return 'Unknown';

    if (address.length > 10) {
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    return address;
  }

  static formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
  }

  static formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  static generateScanId() {
    return `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static getTodayString() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  static isSameDay(timestamp1, timestamp2) {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);

    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  static validateElementName(name) {
    if (!name || typeof name !== 'string') {
      return { valid: false, error: 'Name is required' };
    }

    if (name.includes(' ')) {
      return { valid: false, error: 'Name cannot contain spaces' };
    }

    if (/[\/\[\]{}:;"']/.test(name)) {
      return { valid: false, error: 'Name contains invalid characters' };
    }

    if (name.length > 50) {
      return { valid: false, error: 'Name is too long (max 50 characters)' };
    }

    return { valid: true };
  }

  static validateElementFormat(elementId) {
    const pattern = /^([^.]+)\.([^.]+)\.(\d+)\.element$/;

    if (!pattern.test(elementId)) {
      return {
        valid: false,
        error: 'Invalid element format. Expected: name.pattern.field.element'
      };
    }

    const match = elementId.match(pattern);
    const name = match[1];
    const patternStr = match[2];
    const field = parseInt(match[3]);

    if (field < 0 || field > 37) {
      return {
        valid: false,
        error: 'Field must be between 0 and 37'
      };
    }

    const nameValidation = this.validateElementName(name);
    if (!nameValidation.valid) {
      return nameValidation;
    }

    return {
      valid: true,
      parsed: { name, pattern: patternStr, field }
    };
  }

  static validateBlockRange(startBlock, endBlock) {
    if (typeof startBlock !== 'number' || typeof endBlock !== 'number') {
      return { valid: false, error: 'Blocks must be numbers' };
    }

    if (startBlock < 0 || endBlock < 0) {
      return { valid: false, error: 'Blocks must be positive' };
    }

    if (endBlock < startBlock) {
      return { valid: false, error: 'End block must be greater than start block' };
    }

    const range = endBlock - startBlock;
    if (range > 10000) {
      return { valid: false, error: 'Block range too large (max 10000)' };
    }

    return { valid: true, range };
  }

  static parseField(fieldStr) {
    const field = parseInt(fieldStr);

    if (isNaN(field)) {
      return { valid: false, error: 'Field must be a number' };
    }

    if (field < 0 || field > 37) {
      return { valid: false, error: 'Field must be between 0 and 37' };
    }

    return { valid: true, field };
  }

  static async retry(fn, maxRetries = 3, delay = 1000) {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (i < maxRetries - 1) {
          await this.sleep(delay * (i + 1));
        }
      }
    }

    throw lastError;
  }

  static calculatePercentage(part, total) {
    if (total === 0) return 0;
    return Math.round((part / total) * 100 * 100) / 100;
  }

  static truncate(str, maxLength) {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
  }

  static sanitizeOutput(data) {
    const sanitized = JSON.parse(JSON.stringify(data));

    if (sanitized.inscriptionId && sanitized.inscriptionId.length > 20) {
      sanitized.inscriptionId = this.truncate(sanitized.inscriptionId, 20);
    }

    if (sanitized.address) {
      sanitized.address = this.formatAddress(sanitized.address);
    }

    return sanitized;
  }

  static getTierColor(tier) {
    const colors = {
      'anonymous': 'gray',
      'verified': 'blue',
      'trusted': 'gold'
    };
    return colors[tier] || 'gray';
  }

  static getTierEmoji(tier) {
    const emojis = {
      'anonymous': '👤',
      'verified': '✅',
      'trusted': '👑'
    };
    return emojis[tier] || '❓';
  }

  static getRarityColor(rarity) {
    const colors = {
      'UNDISCOVERED': 'gray',
      'EXTREMELY RARE': 'gold',
      'RARE': 'purple',
      'MODERATE': 'blue',
      'COMMON': 'gray'
    };
    return colors[rarity] || 'gray';
  }

  static getRarityEmoji(rarity) {
    const emojis = {
      'UNDISCOVERED': '🔍',
      'EXTREMELY RARE': '💎',
      'RARE': '⭐',
      'MODERATE': '📊',
      'COMMON': '📋'
    };
    return emojis[rarity] || '❓';
  }
}

module.exports = Utils;
