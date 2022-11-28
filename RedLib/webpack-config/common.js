const path = require("path")

let version;
require('fs').readFile(path.resolve(__dirname, '../../version.txt'),"utf8",(err,data) => {version = data})

module.exports = {
    entry : "./src/core.js",
    output : {
        filename : ()=> { return `redlib${version}.js` },
        path : path.resolve(__dirname, '../../dist'),
        library : 'redlib',
        libraryTarget : "umd"
    },
    module : {
        rules : [
            {
                test : /\.js/,
                exclude : /node_modules/,
                use : {
                    loader : 'babel-loader',
                    options : {
                        presets : ["@babel/env"]
                    }
                }
            }
        ]
    }
}