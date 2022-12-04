const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")

const fs = require('fs')

// store version foe expor
let version;
fs.readFile(path.resolve(__dirname, '../../version.txt'),"utf8",(err,data) => {version = data})

// create new html file base on template
fs.readFile(path.resolve(__dirname, '../src/index.html'),"utf8",(err,data) => {fs.writeFile(path.resolve(__dirname,'../../dist/index.html'),data.replace(/Version/g, version),()=>{})})

module.exports = {
    entry : "./src/main.js",
    output : {
        filename : ()=> { return `manager${version}.js` },
        path : path.resolve(__dirname, '../../dist')
    },
    plugins:[
        new CopyWebpackPlugin({patterns : [
            {
                from:path.resolve(__dirname,'../../assets'),
                to:path.resolve(__dirname,'../../dist/assets'),
            }
        ]}),
    ],
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