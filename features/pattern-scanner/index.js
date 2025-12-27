/**
 * Pattern Scanner Feature
 * Core pattern matching logic
 */

const { FIELD_MAP } = require('../../src/field-map');
const Statistics = require('../../src/statistics');
const Utils = require('../../src/utils');

class PatternScannerFeature {
  constructor(contract, indexer) {
    this.contract = contract;
    this.indexer = indexer;
    this.debug = process.env.DEBUG === 'true';
  }

  log(message) {
    if (this.debug) {
      console.log(`[PatternScanner] ${message}`);
    }
  }

  async scanPattern(pattern, fieldNum, startBlock, endBlock, userAddress) {
    const startTime = Date.now();

    this.log(`Starting scan: pattern="${pattern}" field=${fieldNum} blocks=${startBlock}-${endBlock}`);

    const fieldValidation = Utils.parseField(fieldNum);
    if (!fieldValidation.valid) {
      throw new Error(fieldValidation.error);
    }

    const rangeValidation = Utils.validateBlockRange(startBlock, endBlock);
    if (!rangeValidation.valid) {
      throw new Error(rangeValidation.error);
    }

    if (!Utils.isValidPattern(pattern)) {
      throw new Error('Invalid pattern');
    }

    const results = [];
    let blockCount = 0;
    let successCount = 0;

    for (let blockHeight = startBlock; blockHeight <= endBlock; blockHeight++) {
      blockCount++;

      const block = await this.indexer.getBlock(blockHeight);

      if (!block) {
        this.log(`Failed to fetch block ${blockHeight}, continuing...`);
        results.push({
          block: blockHeight,
          count: 0,
          error: 'Failed to fetch block'
        });
        continue;
      }

      successCount++;

      try {
        const fieldData = this.extractFieldData(block, fieldNum);
        const count = fieldData.reduce((sum, text) => sum + Utils.countPattern(text, pattern), 0);

        results.push({
          block: blockHeight,
          count: count
        });

        if (blockCount % 10 === 0) {
          const progress = Math.round((blockCount / (endBlock - startBlock + 1)) * 100);
          process.stdout.write(`\rScanning... ${progress}% (${blockCount}/${endBlock - startBlock + 1} blocks, ${successCount} successful)`);
        }

      } catch (error) {
        this.log(`Error processing block ${blockHeight}: ${error.message}`);
        results.push({
          block: blockHeight,
          count: 0,
          error: error.message
        });
      }
    }

    process.stdout.write('\r');

    const stats = new Statistics();
    const statistics = stats.calculate(results, startBlock, endBlock);

    const elapsed = Date.now() - startTime;
    this.log(`Scan completed in ${elapsed}ms. ${successCount}/${blockCount} blocks successful.`);

    const isNewDiscovery = await this.checkIfNewDiscovery(pattern, fieldNum);

    await this.cacheResult(pattern, fieldNum, results, statistics, userAddress, startBlock, endBlock, isNewDiscovery);

    return {
      scanId: Utils.generateScanId(),
      pattern,
      field: fieldNum,
      startBlock,
      endBlock,
      results,
      statistics,
      timestamp: Date.now(),
      scannedBy: userAddress,
      blocksAnalyzed: blockCount,
      successfulBlocks: successCount,
      isNewDiscovery: isNewDiscovery
    };
  }

  async checkIfNewDiscovery(pattern, fieldNum) {
    try {
      const exists = await this.indexer.checkPatternExists(pattern, fieldNum);
      this.log(`Pattern existence check: ${pattern} field ${fieldNum} exists=${exists.exists}`);

      if (exists.exists) {
        return false;
      }

      return true;
    } catch (error) {
      this.log(`Error checking pattern existence: ${error.message}`);
      return true;
    }
  }

  extractFieldData(block, fieldNum) {
    const data = [];

    try {
      const blockRaw = block.raw || block;
      const fields = block.fields || {};

      this.log(`Extracting field ${fieldNum} from block ${blockRaw.height || 'unknown'}`);

      switch (fieldNum) {
        case 0: data.push(String(fields[0] || blockRaw.height || '')); break;
        case 1: data.push(String(fields[1] || blockRaw.hash || '')); break;
        case 2: data.push(String(fields[2] || blockRaw.merkleroot || blockRaw.mrkl_root || '')); break;
        case 3: data.push(String(fields[3] || blockRaw.time || '')); break;
        case 4: data.push(String(fields[4] || blockRaw.bits || '')); break;
        case 5: data.push(String(fields[5] || blockRaw.nonce || '')); break;
        case 6: data.push(String(fields[6] || blockRaw.version || blockRaw.ver || '')); break;
        case 7: data.push(String(fields[7] || blockRaw.difficulty || '')); break;
        case 8: data.push(String(fields[8] || blockRaw.chainwork || '')); break;
        case 9: data.push(String(fields[9] || blockRaw.nTx || blockRaw.n_tx || '')); break;
        case 10: data.push(String(fields[10] || blockRaw.size || '')); break;
        case 11: data.push(String(fields[11] || blockRaw.strippedsize || blockRaw.stripped_size || '')); break;
        case 12: data.push(String(fields[12] || blockRaw.weight || '')); break;
        case 13: data.push(String(fields[13] || blockRaw.mediantime || '')); break;
        case 14:
          // Field 14: Number of transactions (nTx)
          const txs14 = blockRaw.tx || [];
          for (const tx of txs14) {
            data.push(String(tx.txid || tx.hash || ''));
          }
          break;
        case 15:
          data.push(String(fields[15] || blockRaw.previousblockhash || blockRaw.prev_block || ''));
          break;
        case 16:
          // ✅ FIXED: Field 16 is TRANSACTION IDs - most popular for pattern matching!
          const txs16 = blockRaw.tx || [];
          this.log(`Field 16: Found ${txs16.length} transactions in block`);
          for (const tx of txs16) {
            const txid = String(tx.txid || tx.hash || '');
            if (txid) {
              data.push(txid);
              if (this.debug) {
                this.log(`  TX: ${txid.substring(0, 20)}...`);
              }
            }
          }
          this.log(`Field 16: Extracted ${data.length} transaction IDs`);
          break;
        case 17: data.push(String(fields[17] || (blockRaw.bits || '').toString(16))); break;
        case 18: data.push(String(fields[18] || (blockRaw.time || '').toString())); break;
        case 19: data.push(String(fields[19] || (blockRaw.merkleroot || blockRaw.mrkl_root || ''))); break;
        case 20: data.push(String(fields[20] || blockRaw.hash?.substring(0, 8) || '')); break;
        case 21: data.push(String(fields[21] || blockRaw.hash?.substring(8, 16) || '')); break;
        case 22: data.push(String(fields[22] || blockRaw.hash?.substring(16, 24) || '')); break;
        case 23: data.push(String(fields[23] || blockRaw.hash?.substring(24, 32) || '')); break;
        case 24: data.push(String(fields[24] || blockRaw.hash?.substring(32, 40) || '')); break;
        case 25: data.push(String(fields[25] || blockRaw.hash?.substring(40, 48) || '')); break;
        case 26: data.push(String(fields[26] || blockRaw.hash?.substring(48, 56) || '')); break;
        case 27: data.push(String(fields[27] || blockRaw.hash?.substring(56, 64) || '')); break;
        case 28: 
          const prevHash28 = blockRaw.previousblockhash || blockRaw.prev_block || '';
          data.push(String(fields[28] || prevHash28.substring(0, 8) || '')); 
          break;
        case 29: 
          const prevHash29 = blockRaw.previousblockhash || blockRaw.prev_block || '';
          data.push(String(fields[29] || prevHash29.substring(8, 16) || '')); 
          break;
        case 30: 
          const prevHash30 = blockRaw.previousblockhash || blockRaw.prev_block || '';
          data.push(String(fields[30] || prevHash30.substring(16, 24) || '')); 
          break;
        case 31: 
          const prevHash31 = blockRaw.previousblockhash || blockRaw.prev_block || '';
          data.push(String(fields[31] || prevHash31.substring(24, 32) || '')); 
          break;
        case 32: data.push(String(fields[32] || blockRaw.nextblockhash || '')); break;
        case 33: data.push(String(fields[33] || (blockRaw.weight || '').toString(16))); break;
        case 34: data.push(String(fields[34] || (blockRaw.size || '').toString(16))); break;
        case 35: data.push(String(fields[35] || (blockRaw.nonce || '').toString(2))); break;
        case 36: data.push(String(fields[36] || (blockRaw.bits || '').toString(2))); break;
        case 37: data.push(String(fields[37] || (blockRaw.version || blockRaw.ver || '').toString(2))); break;
        default:
          this.log(`Unknown field number: ${fieldNum}`);
          data.push('');
      }

    } catch (error) {
      this.log(`Error extracting field ${fieldNum}: ${error.message}`);
    }

    this.log(`Extracted ${data.length} data items for field ${fieldNum}`);
    return data;
  }

  async cacheResult(pattern, field, results, stats, userAddress, startBlock, endBlock) {
    try {
      const cacheKey = `scan:${userAddress}:${Date.now()}`;

      await this.contract.storage.put(cacheKey, {
        scanId: Utils.generateScanId(),
        pattern,
        field,
        results,
        stats,
        startBlock,
        endBlock,
        timestamp: Date.now(),
        cachedBy: userAddress
      });

      const recentKey = `user:${userAddress}:recent`;
      const recentScans = await this.contract.storage.get(recentKey) || [];
      recentScans.unshift(cacheKey);

      const maxCache = this.contract.config.storage?.localCacheMax || 50;
      if (recentScans.length > maxCache) {
        const toRemove = recentScans.splice(maxCache);
        for (const key of toRemove) {
          await this.contract.storage.del(key);
        }
      }

      await this.contract.storage.put(recentKey, recentScans);

      this.log(`Cached scan result to ${cacheKey}`);

    } catch (error) {
      this.log(`Error caching result: ${error.message}`);
    }
  }

  async getRecentScans(userAddress, limit = 10) {
    try {
      const recentKey = `user:${userAddress}:recent`;
      const recentScans = await this.contract.storage.get(recentKey) || [];

      const limited = recentScans.slice(0, limit);
      const results = [];

      for (const key of limited) {
        const scan = await this.contract.storage.get(key);
        if (scan) {
          results.push(scan);
        }
      }

      return results;

    } catch (error) {
      this.log(`Error getting recent scans: ${error.message}`);
      return [];
    }
  }

  async getScan(scanId) {
    try {
      const scan = await this.contract.storage.get(scanId);
      return scan || null;

    } catch (error) {
      this.log(`Error getting scan ${scanId}: ${error.message}`);
      return null;
    }
  }
}

module.exports = PatternScannerFeature;