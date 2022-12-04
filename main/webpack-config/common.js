const path = require("path")

const fs = require('fs')

// store version foe export
let version;
fs.readFile(path.resolve(__dirname, '../../version.txt'),"utf8",(err,data) => {version = data})


module.exports = {
    entry : "./src/main.js",
    output : {
        filename : ()=> { return `main${version}.js` },
        path : path.resolve(__dirname, '../../dist'),
        library : 'main',
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