module.exports = {
  apps : [{
    name: 'wow-classic-pop',
    script: 'index.js',
    cwd: '/home/wowclassicpop/public_html/',
    node_args: '-r dotenv/config',
    watch: false,
    time: true
  }]
};
