const { merge } = require('webpack-merge')
const common = require('./common')

module.exports = merge(
    common,
    {
        mode : "development",
        devServer : {
            port : '8080',
            devMiddleware: {
                writeToDisk: true,
            }
        },
    }
)