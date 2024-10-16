const LRU = require('lru-cache');

// 配置缓存大小和过期时间
const cache = new LRU({
  max: 100,             // 最大缓存条目数
  ttl: 60 * 60 * 1000   // 1小时的过期时间（以毫秒为单位）
});

const Cache = {
  set(key, val) {
    cache.set(key, val);
  },

  get(key) {
    return cache.get(key);
  },

  delete(key) {
    cache.delete(key); // 删除缓存项，LRU v7+ 使用 delete
  }
};

module.exports = Cache;
