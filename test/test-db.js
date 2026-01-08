/**
 * Test file to debug SQLite database initialization
 * Save as test-db.js and run: node test-db.js
 */

import DatabaseManager from './src/db/sqlite.js';

console.log('Starting database test...');

try {
  console.log('Creating DatabaseManager instance...');
  const db = new DatabaseManager('./data/test-bot.db');
  
  console.log('✅ Database initialized successfully!');
  
  // Test basic operations
  console.log('\nTesting getOrCreateUser...');
  const user = db.getOrCreateUser('test-user-123');
  console.log('User created:', user);
  
  console.log('\nTesting linkAddress...');
  const linked = db.linkAddress('test-user-123', 'bc1qtest123');
  console.log('Address linked:', linked);
  
  console.log('\nTesting getUser...');
  const fetchedUser = db.getUser('test-user-123');
  console.log('Fetched user:', fetchedUser);
  
  console.log('\n✅ All database tests passed!');
  
  db.close();
  console.log('Database closed.');
  
} catch (error) {
  console.error('❌ Database test failed:');
  console.error('Error name:', error.name);
  console.error('Error message:', error.message);
  console.error('Error stack:', error.stack);
  process.exit(1);
}