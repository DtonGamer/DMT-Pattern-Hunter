/**
 * Bitcoin Block Data Field Mapping (0-37)
 * Maps field numbers to their corresponding Bitcoin block data fields
 */

const FIELD_MAP = {
  // Block-level fields
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

  // Transaction fields
  15: "hex",
  16: "txid",
  17: "tx_hash",
  18: "tx_size",
  19: "vsize",
  20: "tx_weight",
  21: "tx_version",
  22: "locktime",
  23: "blocktime",

  // Input fields
  24: "input_asm",
  25: "input_hex",
  26: "sequence",
  27: "txinwitness",
  28: "value",
  29: "n",

  // Output fields
  30: "output_asm",
  31: "output_hex",
  32: "reqSigs",
  33: "type",
  34: "witness",
  35: "btc_fee",
  36: "is_coinbase",
  37: "coinbase"
};

const FIELD_NAMES = Object.values(FIELD_MAP);

const FIELD_GROUPS = {
  BLOCK_LEVEL: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  TRANSACTION: [15, 16, 17, 18, 19, 20, 21, 22, 23],
  INPUT: [24, 25, 26, 27, 28, 29],
  OUTPUT: [30, 31, 32, 33, 34, 35, 36, 37]
};

function getFieldDescription(fieldNum) {
  const descriptions = {
    0: "Block hash (hex string)",
    1: "Block size in bytes",
    2: "Block size without witness data",
    3: "Block weight",
    4: "Block height",
    5: "Block version",
    6: "Block version as hex",
    7: "Merkle root hash",
    8: "Block timestamp (Unix time)",
    9: "Median time of last 11 blocks",
    10: "Nonce value used in mining",
    11: "Difficulty target (bits)",
    12: "Mining difficulty",
    13: "Total work in chain",
    14: "Number of transactions",
    15: "Transaction hex data",
    16: "Transaction ID (hash) - POPULAR FOR PATTERNS",
    17: "Transaction hash",
    18: "Transaction size",
    19: "Virtual transaction size",
    20: "Transaction weight",
    21: "Transaction version",
    22: "Transaction locktime",
    23: "Time transaction was mined",
    24: "Input script assembly",
    25: "Input script hex",
    26: "Input sequence number",
    27: "Segregated witness data",
    28: "Input value (satoshis)",
    29: "Input index",
    30: "Output script assembly",
    31: "Output script hex",
    32: "Required signatures",
    33: "Output type",
    34: "Witness flag (boolean)",
    35: "Transaction fee (satoshis)",
    36: "Coinbase transaction flag",
    37: "Coinbase data"
  };

  return descriptions[fieldNum] || "Unknown field";
}

function isValidField(fieldNum) {
  return fieldNum >= 0 && fieldNum <= 37;
}

function getFieldType(fieldNum) {
  if ([0, 6, 7, 13, 15, 16, 17, 25, 27, 31, 37].includes(fieldNum)) {
    return 'hex';
  }
  if ([1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 14, 18, 19, 20, 21, 22, 23, 26, 28, 29, 32, 35].includes(fieldNum)) {
    return 'numeric';
  }
  if ([34, 36].includes(fieldNum)) {
    return 'boolean';
  }
  return 'string';
}

module.exports = {
  FIELD_MAP,
  FIELD_NAMES,
  FIELD_GROUPS,
  getFieldDescription,
  isValidField,
  getFieldType
};
