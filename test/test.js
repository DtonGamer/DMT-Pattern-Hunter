/**
 * Simple test to verify DMT Pattern Hunter implementation
 */

require('dotenv').config();
const Contract = require('../contract/contract');

async function testBasicFunctionality() {
  console.log('Testing DMT Pattern Hunter Basic Functionality...\n');

  try {
    const contract = new Contract();
    await contract.init();

    console.log('✅ Contract initialized\n');

    const health = await contract.getHealth();
    console.log('Health Check:');
    console.log(`  - ord-tap: ${health.indexer.healthy ? 'Online' : 'Offline'}`);
    console.log(`  - Latency: ${health.indexer.latency}ms`);
    console.log('');

    const stats = await contract.getStats();
    console.log('Stats:');
    console.log(`  - Discoveries: ${stats.totalDiscoveries}`);
    console.log(`  - Users: ${stats.totalUsers}`);
    console.log('');

    console.log('Testing reputation system...');
    const testAddress = 'bc1ptestaddress1234567890abcdef';
    const reputation = await contract.getUserReputation(testAddress);
    console.log(`  - Created user: ${reputation.tier}`);
    console.log('');

    console.log('Testing rate limiting...');
    const limitCheck = await contract.features.reputation.checkScanLimit(testAddress);
    console.log(`  - Allowed: ${limitCheck.allowed}`);
    console.log(`  - Remaining: ${limitCheck.remaining}`);
    console.log('');

    console.log('Testing element availability...');
    const availability = await contract.checkElementAvailability('test', '69', 16);
    console.log(`  - Available: ${availability.available}`);
    console.log('');

    console.log('Testing inscription generation...');
    const elementReg = await contract.generateElementRegistration('test', '69', 16);
    console.log(`  - Generated: ${elementReg.elementId}`);
    console.log('');

    console.log('✅ All basic tests passed!\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

async function testScan() {
  console.log('Testing Pattern Scan...\n');

  try {
    const contract = new Contract();
    await contract.init();

    const result = await contract.scanPattern(
      '69',
      16,
      800000,
      800010,
      'bc1ptestaddress1234567890abcdef'
    );

    console.log('Scan Result:');
    console.log(`  - Pattern: ${result.pattern}`);
    console.log(`  - Field: ${result.field}`);
    console.log(`  - Blocks: ${result.startBlock}-${result.endBlock}`);
    console.log(`  - Total occurrences: ${result.statistics.totalOccurrences}`);
    console.log(`  - Rarity: ${result.statistics.rarity}`);
    console.log(`  - Volatility: ${result.statistics.volatility}`);
    console.log('');
    console.log('✅ Scan test passed!\n');

  } catch (error) {
    console.error('❌ Scan test failed:', error.message);
    if (!error.message.includes('limit')) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function runTests() {
  const args = process.argv.slice(2);
  const testType = args[0] || 'basic';

  if (testType === 'basic') {
    await testBasicFunctionality();
  } else if (testType === 'scan') {
    await testScan();
  } else {
    console.log('Usage: node test/test.js [basic|scan]');
    process.exit(1);
  }
}

if (require.main === module) {
  runTests();
}

module.exports = { testBasicFunctionality, testScan };
