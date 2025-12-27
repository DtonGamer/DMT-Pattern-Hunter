/**
 * Economic Analysis and Statistics for DMT Pattern Scanner
 */

class Statistics {
  constructor() {}

  calculate(results, startBlock, endBlock) {
    const counts = results.map(r => r.count);
    const total = counts.reduce((a, b) => a + b, 0);
    const numBlocks = results.length;

    if (numBlocks === 0) {
      return this.getEmptyStats();
    }

    const avgCount = total / numBlocks;
    const maxCount = Math.max(...counts);
    const minCount = Math.min(...counts);
    const blocksWithPattern = counts.filter(c => c > 0).length;

    const variance = counts.reduce((sum, x) => sum + Math.pow(x - avgCount, 2), 0) / numBlocks;
    const stdDev = Math.sqrt(variance);

    const frequency = blocksWithPattern / numBlocks;
    const rarity = this.calculateRarity(frequency, total);

    const cv = avgCount > 0 ? stdDev / avgCount : 0;
    const volatility = this.calculateVolatility(cv);

    return {
      totalBlocksAnalyzed: numBlocks,
      totalOccurrences: total,
      blocksWithPattern,
      blocksWithoutPattern: numBlocks - blocksWithPattern,
      averagePerBlock: Math.round(avgCount * 100) / 100,
      maxOccurrences: maxCount,
      minOccurrences: minCount,
      standardDeviation: Math.round(stdDev * 100) / 100,
      frequency: Math.round(frequency * 1000) / 1000,
      rarity,
      volatility,
      coefficientOfVariation: Math.round(cv * 1000) / 1000
    };
  }

  calculateRarity(frequency, totalOccurrences) {
    if (totalOccurrences === 0) {
      return 'UNDISCOVERED';
    }
    if (frequency < 0.1) {
      return 'EXTREMELY RARE';
    } else if (frequency < 0.3) {
      return 'RARE';
    } else if (frequency < 0.7) {
      return 'MODERATE';
    } else {
      return 'COMMON';
    }
  }

  calculateVolatility(cv) {
    if (cv > 1.0) {
      return 'HIGH';
    } else if (cv > 0.5) {
      return 'MODERATE';
    } else {
      return 'LOW';
    }
  }

  getTokenSupplyType(rarity) {
    const types = {
      'UNDISCOVERED': 'Unknown - Pattern not found',
      'EXTREMELY RARE': 'Highly deflationary - Scarce supply',
      'RARE': 'Deflationary - Limited supply',
      'MODERATE': 'Balanced supply dynamics',
      'COMMON': 'Inflationary - Abundant supply'
    };
    return types[rarity] || 'Unknown';
  }

  getSupplyVolatilityDescription(volatility) {
    const descriptions = {
      'HIGH': 'HIGH - Highly variable minting rewards',
      'MODERATE': 'MODERATE - Some variation in rewards',
      'LOW': 'LOW - Consistent minting rewards'
    };
    return descriptions[volatility] || 'Unknown';
  }

  getEmptyStats() {
    return {
      totalBlocksAnalyzed: 0,
      totalOccurrences: 0,
      blocksWithPattern: 0,
      blocksWithoutPattern: 0,
      averagePerBlock: 0,
      maxOccurrences: 0,
      minOccurrences: 0,
      standardDeviation: 0,
      frequency: 0,
      rarity: 'UNDISCOVERED',
      volatility: 'UNKNOWN',
      coefficientOfVariation: 0
    };
  }

  getStrategicRecommendations(frequency, cv) {
    const recommendations = [];

    if (frequency === 0) {
      recommendations.push("Pattern not found in scanned block range");
      recommendations.push("Try expanding the search range or checking a different field");
      recommendations.push("Consider this may be an undiscovered pattern worth exploring");
    } else if (frequency < 0.2 && cv > 0.7) {
      recommendations.push("Excellent pattern for collectible-focused NATs");
      recommendations.push("High variance creates valuable rare blocks");
      recommendations.push("Consider premium pricing for high-count blocks");
    } else if (frequency > 0.8 && cv < 0.3) {
      recommendations.push("Pattern may be too common for valuable NATs");
      recommendations.push("Consider finding a rarer pattern");
      recommendations.push("Could work for high-volume utility tokens");
    } else {
      recommendations.push("Balanced pattern suitable for standard NAT deployment");
      recommendations.push("Predictable supply with some variation");
      recommendations.push("Good for long-term token economics");
    }

    return recommendations;
  }

  generateReport(pattern, field, stats, fieldName, results) {
    const lines = [];

    lines.push("=".repeat(70));
    lines.push("DMT PATTERN ANALYSIS REPORT");
    lines.push("=".repeat(70));
    lines.push("");
    lines.push(`Pattern: "${pattern}"`);
    lines.push(`Field: ${field} (${fieldName || 'Unknown'})`);
    lines.push(``);

    lines.push("📊 SUMMARY STATISTICS:");
    lines.push(`  Total Blocks Analyzed: ${stats.totalBlocksAnalyzed}`);
    lines.push(`  Total Pattern Occurrences: ${stats.totalOccurrences}`);
    lines.push(`  Blocks Containing Pattern: ${stats.blocksWithPattern} (${(stats.frequency * 100).toFixed(1)}%)`);
    lines.push(`  Blocks Without Pattern: ${stats.blocksWithoutPattern} (${((1 - stats.frequency) * 100).toFixed(1)}%)`);
    lines.push(`  Average Occurrences/Block: ${stats.averagePerBlock}`);
    lines.push(`  Standard Deviation: ${stats.standardDeviation}`);
    lines.push(`  Range: ${stats.minOccurrences} - ${stats.maxOccurrences} occurrences`);
    lines.push("");

    lines.push("💰 TOKEN ECONOMICS ANALYSIS:");
    lines.push(`  Pattern Rarity: ${stats.rarity}`);
    lines.push(`  Token Supply Type: ${this.getTokenSupplyType(stats.rarity)}`);
    lines.push(`  Supply Volatility: ${this.getSupplyVolatilityDescription(stats.volatility)}`);
    lines.push("");

    lines.push("🎯 TOP MINTING OPPORTUNITIES:");
    const sortedResults = [...results]
      .sort((a, b) => b.count - a.count)
      .filter(r => r.count > 0)
      .slice(0, 5);

    if (sortedResults.length === 0) {
      lines.push("  No blocks found with this pattern in scanned range");
    } else {
      sortedResults.forEach((result, i) => {
        lines.push(`  ${i + 1}. Block ${result.block}: ${result.count} occurrences`);
      });
    }
    lines.push("");

    lines.push("📝 ELEMENT REGISTRATION FORMAT:");
    lines.push(`  Suggested inscription: <yourname>.${pattern}.${field}.element`);
    lines.push(`  Example: satoshi.${pattern}.${field}.element`);
    lines.push(`  Field: ${field} (${fieldName || 'Unknown'})`);
    lines.push("");

    lines.push("🚀 NAT DEPLOYMENT SUGGESTION:");
    lines.push("  If this pattern is registered, deploy with:");
    lines.push('  {');
    lines.push('    "p": "tap",');
    lines.push('    "op": "dmt-deploy",');
    lines.push('    "tick": "<your_ticker>",');
    lines.push(`    "elem": "<name>.${pattern}.${field}.element"`);
    lines.push('  }');
    lines.push("");

    lines.push("💡 STRATEGIC RECOMMENDATIONS:");
    const recommendations = this.getStrategicRecommendations(stats.frequency, stats.coefficientOfVariation);
    recommendations.forEach(rec => {
      lines.push(`  ✓ ${rec}`);
    });

    lines.push("");
    lines.push("=".repeat(70));

    return lines.join("\n");
  }
}

module.exports = Statistics;
