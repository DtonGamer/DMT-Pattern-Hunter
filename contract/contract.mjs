// ESM wrapper for CommonJS contract module
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import the CommonJS contract module
const Contract = require('./contract.js');

// Export as default for ESM import
export default Contract;
