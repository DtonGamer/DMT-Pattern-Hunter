/**
 * Trac Protocol - Simplified for Phase 1 MVP
 * In a full implementation, this would import from Trac Manager
 */

class Protocol {
  constructor(config, storage, state) {
    this.config = config;
    this.storage = storage;
    this.state = state;
    this.listeners = {};
    this.peers = [];
  }

  async init() {
    console.log('Protocol initialized');
  }

  async emit(event, data) {
    if (this.listeners[event]) {
      for (const callback of this.listeners[event]) {
        try {
          await callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      }
    }
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  addPeer(peer) {
    if (!this.peers.includes(peer)) {
      this.peers.push(peer);
    }
  }

  removePeer(peer) {
    this.peers = this.peers.filter(p => p !== peer);
  }

  async request(peer, method, args = []) {
    console.log(`Requesting ${method} from peer ${peer}`);
    return null;
  }

  broadcast(event, data) {
    console.log(`Broadcasting ${event} to ${this.peers.length} peers`);
    this.emit(event, data);
  }

  getStats() {
    return {
      peers: this.peers.length,
      listeners: Object.keys(this.listeners).length,
      uptime: process.uptime()
    };
  }
}

module.exports = Protocol;
