// PM2 Process Supervisor Configuration for 24/7 Enterprise Uptime
module.exports = {
  apps: [
    {
      name: 'zakaria-api',
      cwd: './apps/api',
      script: 'dist/server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      kill_timeout: 15000,
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    },
    {
      name: 'zakaria-web',
      cwd: './apps/web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '768M',
      kill_timeout: 15000,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
