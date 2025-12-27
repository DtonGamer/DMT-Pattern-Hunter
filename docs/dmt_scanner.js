/**
 * DMT Pattern Scanner & Economic Analyzer
 * Searches Bitcoin blockchain data for patterns and provides economic intelligence
 * for NAT (Non-Arbitrary Token) deployment decisions.
 */

const readline = require('readline');

// Bitcoin block data field mapping (0-37)
const FIELD_MAP = {
    0: "block_hash",
    1: "size",
    2: "strippedsize",
    3: "weight",
    4: "height",
    5: "version",
    6: "versionHex",
    7: "merkleroot",
    8: "time",
    9: "mediantime",
    10: "nonce",
    11: "bits",
    12: "difficulty",
    13: "chainwork",
    14: "nTx",
    15: "hex",
    16: "txid",
    17: "tx_hash",
    18: "tx_size",
    19: "vsize",
    20: "weight",
    21: "tx_version",
    22: "locktime",
    23: "blocktime",
    24: "input_asm",
    25: "input_hex",
    26: "sequence",
    27: "txinwitness",
    28: "value",
    29: "n",
    30: "output_asm",
    31: "output_hex",
    32: "reqSigs",
    33: "type",
    34: "witness",
    35: "btc_fee",
    36: "is_coinbase",
    37: "coinbase"
};

class DMTPatternScanner {
    constructor(apiKey = null) {
        this.apiKey = apiKey;
        this.baseUrl = "https://blockchain.info";
    }

    /**
     * Fetch a Bitcoin block by height
     */
    async fetchBlock(blockHeight) {
        try {
            const url = `${this.baseUrl}/block-height/${blockHeight}?format=json`;
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                // blockchain.info returns blocks array
                if (data.blocks && data.blocks.length > 0) {
                    return data.blocks[0];
                }
            }
            
            console.log(`Warning: Could not fetch block ${blockHeight} (Status: ${response.status})`);
            return null;
            
        } catch (error) {
            console.log(`Error fetching block ${blockHeight}: ${error.message}`);
            return null;
        }
    }

    /**
     * Extract data from a specific field in the block
     */
    extractFieldData(block, fieldNum) {
        const data = [];
        
        try {
            if (fieldNum === 0) {  // block_hash
                data.push(String(block.hash || ''));
            } else if (fieldNum === 1) {  // size
                data.push(String(block.size || ''));
            } else if (fieldNum === 3) {  // weight
                data.push(String(block.weight || ''));
            } else if (fieldNum === 4) {  // height
                data.push(String(block.height || ''));
            } else if (fieldNum === 5) {  // version
                data.push(String(block.ver || ''));
            } else if (fieldNum === 7) {  // merkleroot
                data.push(String(block.mrkl_root || ''));
            } else if (fieldNum === 8) {  // time
                data.push(String(block.time || ''));
            } else if (fieldNum === 10) {  // nonce
                data.push(String(block.nonce || ''));
            } else if (fieldNum === 11) {  // bits
                data.push(String(block.bits || ''));
            } else if (fieldNum === 14) {  // nTx
                data.push(String(block.n_tx || ''));
            } else if (fieldNum === 16 || fieldNum === 17) {  // txid, tx_hash
                const txs = block.tx || [];
                for (const tx of txs) {
                    data.push(String(tx.hash || ''));
                }
            } else if (fieldNum === 18) {  // tx_size
                const txs = block.tx || [];
                for (const tx of txs) {
                    data.push(String(tx.size || ''));
                }
            } else if (fieldNum === 22) {  // locktime
                const txs = block.tx || [];
                for (const tx of txs) {
                    data.push(String(tx.lock_time || ''));
                }
            }
            
        } catch (error) {
            console.log(`Error extracting field ${fieldNum}: ${error.message}`);
        }
        
        return data;
    }

    /**
     * Count occurrences of a pattern in text
     */
    countPattern(text, pattern) {
        const lowerText = text.toLowerCase();
        const lowerPattern = pattern.toLowerCase();
        let count = 0;
        let pos = 0;
        
        while ((pos = lowerText.indexOf(lowerPattern, pos)) !== -1) {
            count++;
            pos += lowerPattern.length;
        }
        
        return count;
    }

    /**
     * Sleep for specified milliseconds
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Analyze a pattern across a range of blocks
     */
    async analyzePattern(pattern, fieldNum, startBlock, endBlock) {
        console.log(`\n${'='.repeat(70)}`);
        console.log(`DMT PATTERN ANALYSIS`);
        console.log(`${'='.repeat(70)}`);
        console.log(`Pattern: '${pattern}'`);
        console.log(`Field: ${fieldNum} (${FIELD_MAP[fieldNum] || 'Unknown'})`);
        console.log(`Block Range: ${startBlock} to ${endBlock}`);
        console.log(`${'='.repeat(70)}\n`);
        
        const results = [];
        let totalOccurrences = 0;
        let blocksWithPattern = 0;
        
        for (let blockHeight = startBlock; blockHeight <= endBlock; blockHeight++) {
            process.stdout.write(`Scanning block ${blockHeight}... `);
            
            const block = await this.fetchBlock(blockHeight);
            if (!block) {
                console.log("FAILED");
                continue;
            }
            
            const fieldData = this.extractFieldData(block, fieldNum);
            const count = fieldData.reduce((sum, text) => sum + this.countPattern(text, pattern), 0);
            
            results.push({
                block: blockHeight,
                count: count
            });
            
            totalOccurrences += count;
            if (count > 0) {
                blocksWithPattern++;
            }
            
            console.log(`Found ${count} occurrences`);
            
            // Rate limiting
            await this.sleep(500);
        }
        
        // Calculate statistics
        const counts = results.map(r => r.count);
        const numBlocks = results.length;
        const avgCount = numBlocks > 0 ? totalOccurrences / numBlocks : 0;
        const maxCount = counts.length > 0 ? Math.max(...counts) : 0;
        const minCount = counts.length > 0 ? Math.min(...counts) : 0;
        
        // Calculate standard deviation
        const variance = numBlocks > 0 
            ? counts.reduce((sum, x) => sum + Math.pow(x - avgCount, 2), 0) / numBlocks 
            : 0;
        const stdDev = Math.sqrt(variance);
        
        // Distribution analysis
        const zeroBlocks = counts.filter(c => c === 0).length;
        
        return {
            pattern: pattern,
            field: fieldNum,
            fieldName: FIELD_MAP[fieldNum] || 'Unknown',
            blockRange: [startBlock, endBlock],
            results: results,
            statistics: {
                totalBlocksAnalyzed: numBlocks,
                totalOccurrences: totalOccurrences,
                blocksWithPattern: blocksWithPattern,
                blocksWithoutPattern: zeroBlocks,
                averagePerBlock: Math.round(avgCount * 100) / 100,
                maxOccurrences: maxCount,
                minOccurrences: minCount,
                standardDeviation: Math.round(stdDev * 100) / 100
            }
        };
    }

    /**
     * Generate a comprehensive report from analysis results
     */
    generateReport(analysis) {
        const stats = analysis.statistics;
        const pattern = analysis.pattern;
        const fieldNum = analysis.field;
        const fieldName = analysis.fieldName;
        
        const report = [];
        report.push("\n" + "=".repeat(70));
        report.push("PATTERN ANALYSIS REPORT");
        report.push("=".repeat(70));
        
        // Summary Statistics
        report.push("\n📊 SUMMARY STATISTICS:");
        report.push(`  Total Blocks Analyzed: ${stats.totalBlocksAnalyzed}`);
        report.push(`  Total Pattern Occurrences: ${stats.totalOccurrences}`);
        report.push(`  Blocks Containing Pattern: ${stats.blocksWithPattern} (${(stats.blocksWithPattern/stats.totalBlocksAnalyzed*100).toFixed(1)}%)`);
        report.push(`  Blocks Without Pattern: ${stats.blocksWithoutPattern} (${(stats.blocksWithoutPattern/stats.totalBlocksAnalyzed*100).toFixed(1)}%)`);
        report.push(`  Average Occurrences/Block: ${stats.averagePerBlock}`);
        report.push(`  Standard Deviation: ${stats.standardDeviation}`);
        report.push(`  Range: ${stats.minOccurrences} - ${stats.maxOccurrences} occurrences`);
        
        // Economic Analysis
        report.push("\n💰 TOKEN ECONOMICS ANALYSIS:");
        
        // Rarity assessment
        const patternFrequency = stats.blocksWithPattern / stats.totalBlocksAnalyzed;
        let rarity, tokenType;
        
        if (patternFrequency < 0.1) {
            rarity = "EXTREMELY RARE";
            tokenType = "Highly deflationary - Scarce supply";
        } else if (patternFrequency < 0.3) {
            rarity = "RARE";
            tokenType = "Deflationary - Limited supply";
        } else if (patternFrequency < 0.7) {
            rarity = "MODERATE";
            tokenType = "Balanced supply dynamics";
        } else {
            rarity = "COMMON";
            tokenType = "Inflationary - Abundant supply";
        }
        
        report.push(`  Pattern Rarity: ${rarity}`);
        report.push(`  Token Supply Type: ${tokenType}`);
        
        // Volatility assessment
        const cv = stats.averagePerBlock > 0 ? stats.standardDeviation / stats.averagePerBlock : 0;
        let volatility;
        
        if (cv > 1.0) {
            volatility = "HIGH - Highly variable minting rewards";
        } else if (cv > 0.5) {
            volatility = "MODERATE - Some variation in rewards";
        } else {
            volatility = "LOW - Consistent minting rewards";
        }
        
        report.push(`  Supply Volatility: ${volatility}`);
        
        // Top minting opportunities
        report.push("\n🎯 TOP MINTING OPPORTUNITIES:");
        const sortedResults = [...analysis.results].sort((a, b) => b.count - a.count).slice(0, 5);
        sortedResults.forEach((result, i) => {
            if (result.count > 0) {
                report.push(`  ${i + 1}. Block ${result.block}: ${result.count} tokens`);
            }
        });
        
        // .element Registration Suggestion
        report.push("\n📝 ELEMENT REGISTRATION FORMAT:");
        report.push(`  Suggested inscription: <yourname>.${pattern}.${fieldNum}.element`);
        report.push(`  Example: satoshi.${pattern}.${fieldNum}.element`);
        report.push(`  Field: ${fieldNum} (${fieldName})`);
        
        // NAT Deployment Suggestion
        report.push("\n🚀 NAT DEPLOYMENT SUGGESTION:");
        report.push("  If this pattern is registered, deploy with:");
        report.push('  {');
        report.push('    "p": "tap",');
        report.push('    "op": "dmt-deploy",');
        report.push(`    "tick": "<your_ticker>",`);
        report.push(`    "elem": "<name>.${pattern}.${fieldNum}.element"`);
        report.push('  }');
        
        // Strategic Recommendations
        report.push("\n💡 STRATEGIC RECOMMENDATIONS:");
        if (patternFrequency < 0.2 && cv > 0.7) {
            report.push("  ✓ Excellent pattern for collectible-focused NATs");
            report.push("  ✓ High variance creates valuable rare blocks");
            report.push("  ✓ Consider premium pricing for high-count blocks");
        } else if (patternFrequency > 0.8 && cv < 0.3) {
            report.push("  ⚠ Pattern may be too common for valuable NATs");
            report.push("  ⚠ Consider finding a rarer pattern");
            report.push("  ✓ Could work for high-volume utility tokens");
        } else {
            report.push("  ✓ Balanced pattern suitable for standard NAT deployment");
            report.push("  ✓ Predictable supply with some variation");
            report.push("  ✓ Good for long-term token economics");
        }
        
        report.push("\n" + "=".repeat(70) + "\n");
        
        return report.join("\n");
    }

    /**
     * Save analysis results to JSON file
     */
    async saveReport(analysis, filename = "pattern_analysis.json") {
        const fs = require('fs').promises;
        await fs.writeFile(filename, JSON.stringify(analysis, null, 2));
        console.log(`✓ Analysis saved to ${filename}`);
    }
}

/**
 * Helper function to get user input
 */
function question(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(query, answer => {
            rl.close();
            resolve(answer);
        });
    });
}

/**
 * Main function to run the pattern scanner
 */
async function main() {
    console.log("\n" + "=".repeat(70));
    console.log("DMT PATTERN SCANNER & ECONOMIC ANALYZER");
    console.log("Bitinformatics Tool for NAT Discovery");
    console.log("=".repeat(70) + "\n");
    
    // User inputs
    const pattern = (await question("Enter pattern to search for (e.g., '69', '420', '777'): ")).trim();
    
    console.log("\nAvailable fields:");
    console.log("  0: block_hash    7: merkleroot    16: txid");
    console.log("  1: size         10: nonce        17: tx_hash");
    console.log("  4: height       11: bits         22: locktime");
    const fieldNum = parseInt((await question("\nEnter field number to search (0-37): ")).trim());
    
    const startBlock = parseInt((await question("Enter starting block height: ")).trim());
    const endBlock = parseInt((await question("Enter ending block height: ")).trim());
    
    // Validate inputs
    if (endBlock < startBlock) {
        console.log("Error: End block must be greater than start block");
        return;
    }
    
    if (endBlock - startBlock > 100) {
        console.log("\n⚠ Warning: Analyzing more than 100 blocks may take a long time.");
        const confirm = (await question("Continue? (yes/no): ")).trim().toLowerCase();
        if (confirm !== 'yes') {
            return;
        }
    }
    
    // Initialize scanner and run analysis
    const scanner = new DMTPatternScanner();
    const analysis = await scanner.analyzePattern(pattern, fieldNum, startBlock, endBlock);
    
    // Generate and display report
    const report = scanner.generateReport(analysis);
    console.log(report);
    
    // Save results
    const save = (await question("Save analysis to file? (yes/no): ")).trim().toLowerCase();
    if (save === 'yes') {
        let filename = (await question("Enter filename (default: pattern_analysis.json): ")).trim();
        if (!filename) {
            filename = "pattern_analysis.json";
        }
        await scanner.saveReport(analysis, filename);
    }
    
    console.log("\n✓ Analysis complete!");
}

// Run main function
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { DMTPatternScanner, FIELD_MAP };