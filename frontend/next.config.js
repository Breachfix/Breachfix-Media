// next.config.js
const devConfig = require('./next.config.dev');
const prodConfig = require('./next.config.prod');

const isProd = process.env.NODE_ENV === 'production';

module.exports = isProd ? prodConfig : devConfig;