const Redis = require('ioredis');
const redis = new Redis();

class Leaderboard {
  constructor(key) {
    this.key = key;
  }

  async addMember(member, score) {
    // Add a member with a score to the leaderboard
    return await redis.zadd(this.key, score, member);
  }

  async getTopN(n) {
    // Retrieve the top N members in the leaderboard
    return await redis.zrevrange(this.key, 0, n - 1, 'WITHSCORES');
  }

  async getRank(member) {
    // Get the rank of a member in the leaderboard (0-based)
    return await redis.zrevrank(this.key, member);
  }

  async getScore(member) {
    // Get the score of a member in the leaderboard
    return await redis.zscore(this.key, member);
  }
}

module.exports = Leaderboard;
