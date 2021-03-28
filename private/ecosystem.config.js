module.exports = {
  apps : [
    {
      name      : 'pulse',
      script    : 'main.js',
      watch     : 'true',
      env_production : {
        NODE_ENV: 'production',
        COMMON_VARIABLE: 'true',
        ROOT_URL: "http://45.79.14.53",
        PORT: "3000",
        MONGO_URL: "mongodb://0.0.0.0:27017/pulse"
      }
    }
  ]
};