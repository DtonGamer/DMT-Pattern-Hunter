/**
 * Inscription Generator Feature
 * Generate proper JSON for .element registration and NAT deployment/minting
 */

const Utils = require('../../src/utils');
const { getFieldDescription } = require('../../src/field-map');

class InscriptionGeneratorFeature {
  constructor(contract, elementRegistry) {
    this.contract = contract;
    this.elementRegistry = elementRegistry;
    this.debug = process.env.DEBUG === 'true';
  }

  log(message) {
    if (this.debug) {
      console.log(`[InscriptionGenerator] ${message}`);
    }
  }

  async generateElementRegistration(name, pattern, field) {
    try {
      const nameValidation = Utils.validateElementName(name);
      if (!nameValidation.valid) {
        throw new Error(nameValidation.error);
      }

      const check = await this.elementRegistry.checkAvailability(name, pattern, field);

      if (!check.available) {
        throw new Error(`Element ${check.elementId} is not available`);
      }

      const elementId = `${name}.${pattern}.${field}.element`;

      const inscription = {
        p: 'tap',
        op: 'dmt-element',
        name: name,
        pattern: pattern,
        field: field,
        timestamp: Date.now()
      };

      this.log(`Generated element registration for ${elementId}`);

      return {
        elementId,
        inscription,
        json: JSON.stringify(inscription, null, 2),
        instructions: '1. Copy the JSON below\n2. Inscribe using your preferred tool (e.g., unisat.io, ord.io)\n3. Once inscribed, come back to mark as registered',
        ready: true
      };

    } catch (error) {
      this.log(`Error generating element registration: ${error.message}`);
      throw error;
    }
  }

  async generateDeployment(ticker, elem, supply = null, dta = null) {
    try {
      const elementValidation = Utils.validateElementFormat(elem);
      if (!elementValidation.valid) {
        throw new Error(elementValidation.error);
      }

      const { name, pattern, field } = elementValidation.parsed;

      const check = await this.elementRegistry.checkAvailability(name, pattern, field);

      if (check.available && !check.reserved) {
        throw new Error(`Element ${elem} is not registered or reserved`);
      }

      if (!ticker || typeof ticker !== 'string' || ticker.length < 1 || ticker.length > 32) {
        throw new Error('Ticker must be 1-32 characters');
      }

      const deployment = {
        p: 'tap',
        op: 'dmt-deploy',
        tick: ticker,
        elem: elem
      };

      if (supply !== null && supply !== undefined && supply !== '') {
        const supplyNum = parseInt(supply);
        if (isNaN(supplyNum) || supplyNum <= 0) {
          throw new Error('Supply must be a positive number');
        }
        deployment.supply = String(supplyNum);
      }

      if (dta !== null && dta !== undefined && dta !== '') {
        if (typeof dta !== 'string') {
          throw new Error('Data must be a string');
        }

        const dtaStr = String(dta);

        if (new Blob([dtaStr]).size > 512) {
          throw new Error('Data exceeds 512 bytes limit');
        }

        deployment.dta = dtaStr;
      }

      this.log(`Generated deployment for ticker ${ticker} with element ${elem}`);

      return {
        ticker,
        elem,
        inscription: deployment,
        json: JSON.stringify(deployment, null, 2),
        instructions: '1. Copy the JSON below\n2. Inscribe using your preferred tool\n3. Wait for confirmations',
        ready: true
      };

    } catch (error) {
      this.log(`Error generating deployment: ${error.message}`);
      throw error;
    }
  }

  async generateMint(dep, tick, block, dta = null) {
    try {
      if (!dep || typeof dep !== 'string') {
        throw new Error('Deployment inscription ID is required');
      }

      if (!tick || typeof tick !== 'string') {
        throw new Error('Ticker is required');
      }

      if (typeof block !== 'number') {
        throw new Error('Block must be a number (integer, no quotes)');
      }

      if (block < 0) {
        throw new Error('Block must be positive');
      }

      const mint = {
        p: 'tap',
        op: 'dmt-mint',
        dep: dep,
        tick: tick,
        blk: block  // INTEGER - no quotes!
      };

      if (dta !== null && dta !== undefined && dta !== '') {
        if (typeof dta !== 'string') {
          throw new Error('Data must be a string');
        }

        const dtaStr = String(dta);

        if (new Blob([dtaStr]).size > 512) {
          throw new Error('Data exceeds 512 bytes limit');
        }

        mint.dta = dtaStr;
      }

      this.log(`Generated mint for ticker ${tick} block ${block}`);

      return {
        dep,
        tick,
        block,
        inscription: mint,
        json: JSON.stringify(mint, null, 2),
        instructions: '1. Copy the JSON below\n2. Inscribe using your preferred tool\n3. Wait for confirmations',
        ready: true
      };

    } catch (error) {
      this.log(`Error generating mint: ${error.message}`);
      throw error;
    }
  }

  validateInscription(json) {
    const required = ['p', 'op'];

    for (const field of required) {
      if (!json[field]) {
        return { valid: false, error: `Missing required field: ${field}` };
      }
    }

    if (json.p !== 'tap') {
      return { valid: false, error: 'Protocol must be "tap"' };
    }

    if (json.op === 'dmt-deploy') {
      if (!json.tick || !json.elem) {
        return { valid: false, error: 'dmt-deploy requires tick and elem' };
      }
    }

    if (json.op === 'dmt-mint') {
      if (!json.dep || !json.tick || typeof json.blk !== 'number') {
        return { valid: false, error: 'dmt-mint requires dep, tick, and blk (number)' };
      }
    }

    if (json.op === 'dmt-element') {
      if (!json.name || typeof json.field !== 'number') {
        return { valid: false, error: 'dmt-element requires name and field' };
      }
    }

    return { valid: true };
  }

  formatOutput(inscription, showInstructions = true) {
    const lines = [];
    lines.push('--- Inscription JSON ---');
    lines.push(JSON.stringify(inscription, null, 2));
    lines.push('-----------------------');

    if (showInstructions) {
      lines.push('');
      lines.push('Instructions:');
      lines.push('1. Copy the JSON above');
      lines.push('2. Inscribe using your preferred Bitcoin Ordinals tool:');
      lines.push('   - unisat.io (recommended)');
      lines.push('   - ord.io');
      lines.push('   - gamma.io');
      lines.push('3. After inscription, copy the inscription ID');
      lines.push('4. Come back to mark the element as registered');
    }

    return lines.join('\n');
  }

  async generateBatchMints(deploymentId, ticker, blocks) {
    try {
      const mints = [];

      for (const block of blocks) {
        const mint = await this.generateMint(deploymentId, ticker, block);
        mints.push(mint);
      }

      this.log(`Generated ${mints.length} batch mints for ${ticker}`);

      return mints;

    } catch (error) {
      this.log(`Error generating batch mints: ${error.message}`);
      throw error;
    }
  }

  async generateFullSet(ticker, elem, supply) {
    try {
      const deployment = await this.generateDeployment(ticker, elem, supply);

      this.log(`Generated full deployment set for ${ticker}`);

      return {
        deployment,
        instructions: '1. First inscribe the deployment\n2. Get the deployment inscription ID\n3. Then use generateBatchMints() or generateMint() for minting'
      };

    } catch (error) {
      this.log(`Error generating full set: ${error.message}`);
      throw error;
    }
  }
}

module.exports = InscriptionGeneratorFeature;
