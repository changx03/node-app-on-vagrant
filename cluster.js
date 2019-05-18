const cluster = require('cluster')

if (cluster.isMaster) {
  const cpuCount = require('os').cpus().length

  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork()
  }

  cluster.on('exit', function() {
    cluster.fork()
  })
} else {
  require('./bin/www')
}
