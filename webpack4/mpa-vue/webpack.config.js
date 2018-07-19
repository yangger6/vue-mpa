const isDev = process.env.NODE_ENV === 'development'
const devWebpackConfig = require('./build/webpack.dev.conf')
const prodWebpackConfig = require('./build/webpack.prod.conf')
console.log(devWebpackConfig)
module.exports = isDev ? devWebpackConfig: prodWebpackConfig
