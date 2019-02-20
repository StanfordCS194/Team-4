module.exports = {
  apps: [{
    name: 'epiphany',
    script: './index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-54-188-126-24.us-west-2.compute.amazonaws.com',
      key: '~/.ssh/EpiphanyKeyPair.pem',
      ref: 'origin/mb_backend',
      repo: 'git@github.com:StanfordCS194/epiphany.git',
      path: '/home/ubuntu/epiphany',
      'post-deploy': 'npm install && pm2 startOrRestart app/ecosystem.config.js'
    }
  }
}
