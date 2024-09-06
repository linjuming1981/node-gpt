module.exports = {
  apps : [{
    name: "node-gpt",
    script: "./server_start.js",
    watch: true,
    ignore_watch: ["temp", "logs"],  // 忽略监控 'temp' 和 'logs' 文件夹
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
