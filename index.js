/**
 * DMT Pattern Scanner - Terminal Interface
 * Phase 1 MVP Entry Point
 */

require('dotenv').config();
const readline = require('readline');
const Contract = require('./contract/contract');
const Statistics = require('./src/statistics');
const Utils = require('./src/utils');
const { getFieldDescription } = require('./src/field-map');

class TerminalInterface {
  constructor(contract) {
    this.contract = contract;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async question(prompt) {
    return new Promise(resolve => {
      this.rl.question(prompt, answer => {
        resolve(answer.trim());
      });
    });
  }

  async start() {
    console.log('\n' + '='.repeat(70));
    console.log('🔍 DMT PATTERN HUNTER - Trac Network');
    console.log('='.repeat(70));
    console.log('Phase 1 MVP - Bitcoin Pattern Discovery & NAT Analysis');
    console.log('='.repeat(70) + '\n');

    await this.checkHealth();

    while (true) {
      await this.showMenu();
      const choice = await this.question('\nSelect option (1-10): ');

      try {
        await this.handleChoice(choice);
      } catch (error) {
        console.log(`\n❌ Error: ${error.message}\n`);
      }
    }
  }

  async checkHealth() {
    console.log('Checking system health...\n');

    const health = await this.contract.getHealth();

    // ✅ FIX: Properly extract health status from nested structure
    const indexerHealth = health.indexer || health;
    
    // Find blockchain.info health check
    const blockDataHealthy = indexerHealth.healthChecks?.some(hc => 
      (hc.source === 'blockchain.info' || hc.source === 'Bitcoin Core RPC') && hc.healthy
    ) || false;
    
    const blockDataSource = indexerHealth.healthChecks?.find(hc => 
      (hc.source === 'blockchain.info' || hc.source === 'Bitcoin Core RPC') && hc.healthy
    )?.source || 'none';

    console.log(`Block Data Source: ${blockDataSource}`);
    console.log(`Status: ${indexerHealth.message || 'Unknown'}`);
    
    if (indexerHealth.latency > 0) {
      console.log(`Latency: ${indexerHealth.latency}ms`);
    }
    
    const tapApiHealthy = indexerHealth.tapApiStatus === 'healthy';
    console.log(`TAP API: ${tapApiHealthy ? '✅ Online' : '❌ Offline'}`);
    console.log(`Channel: ${this.contract.config.channel}`);
    console.log('');

    const stats = await this.contract.getStats();
    console.log(`Total Discoveries: ${stats.totalDiscoveries}`);
    console.log(`Total Users: ${stats.totalUsers}`);
    console.log(`Network Peers: ${stats.networkPeers}`);
    console.log('');

    if (!blockDataHealthy) {
      console.log('⚠️  WARNING: Block data source is not responding properly');
      console.log('   Some features may not work correctly.\n');
    }

    if (indexerHealth.healthChecks && indexerHealth.healthChecks.length > 0) {
      console.log('Detailed Health Checks:');
      indexerHealth.healthChecks.forEach(hc => {
        const emoji = hc.healthy ? '✅' : '❌';
        console.log(`  ${emoji} ${hc.source}: ${hc.message}`);
      });
      console.log('');
    }
  }

  async showMenu() {
    console.log('\n' + '─'.repeat(70));
    console.log('MAIN MENU');
    console.log('─'.repeat(70));
    console.log('1. 🔎 Scan for pattern');
    console.log('2. 📋 Check element availability');
    console.log('3. 📝 Generate inscription JSON');
    console.log('4. 🎫 Reserve element');
    console.log('5. 📊 View discoveries');
    console.log('6. 👤 Check reputation');
    console.log('7. 🏆 View leaderboard');
    console.log('8. 📜 View my scans');
    console.log('9. 💡 Available element names');
    console.log('0. 🚪 Exit');
    console.log('─'.repeat(70));
  }

  async handleChoice(choice) {
    switch (choice) {
      case '1':
        await this.handleScan();
        break;
      case '2':
        await this.handleCheckAvailability();
        break;
      case '3':
        await this.handleGenerateInscription();
        break;
      case '4':
        await this.handleReserveElement();
        break;
      case '5':
        await this.handleViewDiscoveries();
        break;
      case '6':
        await this.handleCheckReputation();
        break;
      case '7':
        await this.handleViewLeaderboard();
        break;
      case '8':
        await this.handleViewMyScans();
        break;
      case '9':
        await this.handleAvailableNames();
        break;
      case '0':
        console.log('\n👋 Goodbye!\n');
        this.rl.close();
        process.exit(0);
      default:
        console.log('\n❌ Invalid option. Please try again.\n');
    }
  }

  async handleScan() {
    console.log('\n' + '─'.repeat(70));
    console.log('🔎 PATTERN SCAN');
    console.log('─'.repeat(70));

    const pattern = await this.question('Pattern to search (e.g., "69", "420", "777"): ');
    const fieldStr = await this.question('Field number (0-37, default: 16): ');
    const startBlockStr = await this.question('Start block (default: 800000): ');
    const endBlockStr = await this.question('End block (default: 800050): ');
    const address = await this.question('Your Bitcoin address (or "anonymous"): ');

    const field = fieldStr ? parseInt(fieldStr) : 16;
    const startBlock = startBlockStr ? parseInt(startBlockStr) : 800000;
    const endBlock = endBlockStr ? parseInt(endBlockStr) : 800050;

    console.log(`\n🔍 Scanning for "${pattern}" in field ${field} (${getFieldDescription(field)})`);
    console.log(`📦 Blocks ${startBlock} to ${endBlock}`);
    console.log(`👤 User: ${address || 'anonymous'}`);
    console.log('');

    try {
      const result = await this.contract.scanPattern(pattern, field, startBlock, endBlock, address);

      console.log('\n' + '─'.repeat(70));
      console.log('✅ SCAN COMPLETE');
      console.log('─'.repeat(70));

      const stats = new Statistics();
      const report = stats.generateReport(
        result.pattern,
        result.field,
        result.statistics,
        getFieldDescription(result.field),
        result.results
      );

      console.log(report);

      if (result.statistics.rarity.includes('RARE') && result.statistics.totalOccurrences > 0) {
        console.log('\n✨ This is a rare pattern!');
        console.log('   Consider registering it as an element.\n');
      }

      if (address && address !== 'anonymous') {
        console.log(`📌 Scan ID: ${result.scanId}`);
      }

    } catch (error) {
      if (error.message.includes('limit')) {
        console.log(`\n⚠️  ${error.message}`);
      } else {
        throw error;
      }
    }
  }

  async handleCheckAvailability() {
    console.log('\n' + '─'.repeat(70));
    console.log('📋 ELEMENT AVAILABILITY CHECK');
    console.log('─'.repeat(70));

    const name = await this.question('Element name: ');
    const pattern = await this.question('Pattern: ');
    const fieldStr = await this.question('Field number: ');

    const check = await this.contract.checkElementAvailability(name, pattern, parseInt(fieldStr));

    console.log('');
    if (check.available) {
      console.log(`✅ ${check.elementId} is AVAILABLE for registration!`);
      console.log(`   Source: ${check.source}`);
    } else {
      console.log(`❌ ${check.elementId} is NOT available`);
      console.log(`   Status: ${check.registered ? 'Registered' : 'Reserved'}`);
      console.log(`   Owner: ${check.owner || check.reservedBy || check.discoverer || 'Unknown'}`);
      if (check.inscriptionId) {
        console.log(`   Inscription: ${check.inscriptionId.substring(0, 20)}...`);
      }
    }
    console.log('');
  }

  async handleGenerateInscription() {
    console.log('\n' + '─'.repeat(70));
    console.log('📝 GENERATE INSCRIPTION JSON');
    console.log('─'.repeat(70));
    console.log('1. Element Registration');
    console.log('2. NAT Deployment');
    console.log('3. NAT Mint');

    const choice = await this.question('\nSelect type (1-3): ');

    if (choice === '1') {
      const name = await this.question('Element name: ');
      const pattern = await this.question('Pattern: ');
      const field = await this.question('Field: ');

      const result = await this.contract.generateElementRegistration(name, pattern, parseInt(field));

      console.log('\n' + this.formatOutput(result.inscription));

    } else if (choice === '2') {
      const ticker = await this.question('Ticker (1-32 chars): ');
      const elem = await this.question('Element (format: name.pattern.field.element): ');
      const supply = await this.question('Max supply (optional, press Enter to skip): ');
      const dta = await this.question('Custom data (optional, press Enter to skip): ');

      const result = await this.contract.generateDeployment(
        ticker,
        elem,
        supply || null,
        dta || null
      );

      console.log('\n' + this.formatOutput(result.inscription));

    } else if (choice === '3') {
      const dep = await this.question('Deployment inscription ID: ');
      const tick = await this.question('Ticker: ');
      const blockStr = await this.question('Block number (INTEGER): ');

      const result = await this.contract.generateMint(dep, tick, parseInt(blockStr));

      console.log('\n' + this.formatOutput(result.inscription));

    } else {
      console.log('\n❌ Invalid choice\n');
    }
  }

  async handleReserveElement() {
    console.log('\n' + '─'.repeat(70));
    console.log('🎫 RESERVE ELEMENT');
    console.log('─'.repeat(70));

    const name = await this.question('Element name: ');
    const pattern = await this.question('Pattern: ');
    const field = await this.question('Field: ');
    const address = await this.question('Your address: ');

    console.log('');
    try {
      const result = await this.contract.reserveElement(name, pattern, parseInt(field), address);

      console.log(`✅ ${result.elementId} reserved for 24 hours`);
      console.log(`   Reserved at: ${Utils.formatDateTime(result.reservedAt)}`);
      console.log(`   Expires at: ${Utils.formatDateTime(result.expiresAt)}`);
      console.log('');
      console.log('💡 Use option 3 to generate registration JSON');

    } catch (error) {
      console.log(`❌ ${error.message}`);
    }
    console.log('');
  }

  async handleViewDiscoveries() {
    console.log('\n' + '─'.repeat(70));
    console.log('📊 DISCOVERIES');
    console.log('─'.repeat(70));

    const discoveries = await this.contract.getRecentDiscoveries(20);

    if (discoveries.length === 0) {
      console.log('\nNo discoveries yet. Start scanning to discover patterns!\n');
      return;
    }

    console.log(`\nRecent ${discoveries.length} discoveries:\n`);

    discoveries.forEach((discovery, i) => {
      const emoji = Utils.getRarityEmoji(discovery.stats?.rarity);
      console.log(`${i + 1}. ${emoji} ${discovery.pattern} in field ${discovery.field}`);
      console.log(`   Discovered by: ${Utils.formatAddress(discovery.discoverer)}`);
      console.log(`   Rarity: ${discovery.stats?.rarity || 'Unknown'}`);
      console.log(`   Frequency: ${(discovery.stats?.frequency * 100).toFixed(1)}%`);
      console.log(`   At: ${Utils.formatDateTime(discovery.timestamp)}`);
      if (discovery.verified) {
        console.log(`   ✅ Verified (inscription: ${discovery.inscriptionId?.substring(0, 15)}...)`);
      }
      console.log('');
    });
  }

  async handleCheckReputation() {
    console.log('\n' + '─'.repeat(70));
    console.log('👤 USER REPUTATION');
    console.log('─'.repeat(70));

    const address = await this.question('Your address: ');

    const user = await this.contract.getUserReputation(address);

    if (!user) {
      console.log('\nUser not found. Scan some patterns to build reputation!\n');
      return;
    }

    const tierEmoji = Utils.getTierEmoji(user.tier);

    console.log('');
    console.log(`${tierEmoji} Address: ${address}`);
    console.log(`   Tier: ${user.tier}`);
    console.log(`   Reputation: ${user.reputation}`);
    console.log(`   Discoveries: ${user.discoveries}`);
    console.log(`   Verified Discoveries: ${user.verifiedDiscoveries}`);
    console.log(`   Scans Today: ${user.scansToday}`);
    console.log(`   Violations: ${user.violations}`);
    console.log(`   Joined: ${Utils.formatDate(user.joinedAt)}`);

    const rank = await this.contract.features.reputation.getUserRank(address);
    if (rank.rank) {
      console.log(`   Leaderboard Rank: #${rank.rank}/${rank.total}`);
    }

    console.log('');

    const config = this.contract.config.tiers[user.tier];
    const limit = config?.scansPerDay || 10;
    console.log(`   Daily Scan Limit: ${limit === -1 ? 'Unlimited' : limit}`);

    if (user.tier === 'anonymous') {
      console.log('');
      console.log('💡 Upgrade to VERIFIED:');
      console.log('   - Make 10 discoveries');
      console.log('   - Increases limit to 100 scans/day');
      console.log('   - Can submit discoveries to network');
    } else if (user.tier === 'verified') {
      console.log('');
      console.log('💡 Upgrade to TRUSTED:');
      console.log('   - Make 50 total discoveries');
      console.log('   - Have 20 verified discoveries');
      console.log('   - Increases limit to 1000 scans/day');
      console.log('   - Can create guilds (Phase 2)');
    }

    console.log('');
  }

  async handleViewLeaderboard() {
    console.log('\n' + '─'.repeat(70));
    console.log('🏆 LEADERBOARD');
    console.log('─'.repeat(70));

    const leaders = await this.contract.getLeaderboard('discoverers');

    if (leaders.length === 0) {
      console.log('\nLeaderboard is empty. Be the first to discover patterns!\n');
      return;
    }

    console.log('\nTop 10 Discoverers:\n');

    const top10 = leaders.slice(0, 10);
    top10.forEach((user, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      const emoji = Utils.getTierEmoji(user.tier);
      console.log(`${medal} ${emoji} ${Utils.formatAddress(user.address)}`);
      console.log(`      Discoveries: ${user.discoveries} | Reputation: ${user.reputation} | Tier: ${user.tier}`);
    });

    console.log('');
    console.log(`Total ${leaders.length} discoverers on leaderboard\n`);
  }

  async handleViewMyScans() {
    console.log('\n' + '─'.repeat(70));
    console.log('📜 MY RECENT SCANS');
    console.log('─'.repeat(70));

    const address = await this.question('Your address: ');

    const scans = await this.contract.getRecentScans(address, 10);

    if (scans.length === 0) {
      console.log('\nNo recent scans found. Start scanning!\n');
      return;
    }

    console.log(`\nRecent ${scans.length} scans:\n`);

    scans.forEach((scan, i) => {
      const emoji = scan.stats?.rarity === 'EXTREMELY RARE' ? '💎' :
                     scan.stats?.rarity === 'RARE' ? '⭐' :
                     scan.stats?.rarity === 'MODERATE' ? '📊' :
                     scan.stats?.rarity === 'UNDISCOVERED' ? '🔍' : '📋';
      console.log(`${i + 1}. ${emoji} "${scan.pattern}" in field ${scan.field}`);
      console.log(`   Blocks: ${scan.startBlock}-${scan.endBlock}`);
      console.log(`   Occurrences: ${scan.stats?.totalOccurrences || 0}`);
      console.log(`   At: ${Utils.formatDateTime(scan.timestamp)}`);
      console.log('');
    });
  }

  async handleAvailableNames() {
    console.log('\n' + '─'.repeat(70));
    console.log('💡 AVAILABLE ELEMENT NAMES');
    console.log('─'.repeat(70));

    const pattern = await this.question('Pattern to check: ');
    const fieldStr = await this.question('Field number: ');

    const suggestions = await this.contract.features.elementRegistry.suggestAvailableNames(
      pattern,
      parseInt(fieldStr)
    );

    if (suggestions.length === 0) {
      console.log('\nNo available names found for common prefixes.\n');
      return;
    }

    console.log(`\nAvailable names for pattern "${pattern}" in field ${fieldStr}:\n`);

    suggestions.forEach((suggestion, i) => {
      console.log(`${i + 1}. ${suggestion.name}.${pattern}.${fieldStr}.element`);
    });

    console.log('');
  }

  formatOutput(inscription) {
    return '--- Inscription JSON ---\n' +
           JSON.stringify(inscription, null, 2) +
           '\n-----------------------\n';
  }
}

async function main() {
  try {
    const contract = new Contract();
    await contract.init();

    const terminal = new TerminalInterface(contract);
    await terminal.start();

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = TerminalInterface;