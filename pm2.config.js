module.exports = {
  apps: [
    {
      name: 'my-node-app',
      script: './bin/www',
      watch: true,
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      },
      env_dev: {
        PORT: 3000,
        NODE_ENV: 'development'
      }
    }
  ]
}
