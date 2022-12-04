const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let version;
require('fs').readFile(path.resolve(__dirname, '../../version.txt'),"utf8",(err,data) => {version = data})

module.exports = {
    entry : "./src/index.js",
    output : {
        filename : ()=> { return `reactUI${version}.js` },
        path : path.resolve(__dirname, '../../dist'),
        library : 'reactUI',
        libraryTarget : "umd"
    },
    plugins:[
        new MiniCssExtractPlugin({
            filename : 'reactUI.css'
        }),
    ],
    module : {
        rules : [
            {
                test : /\.js/,
                exclude : /node_modules/,
                use : {
                    loader : 'babel-loader',
                    options : {
                        presets : [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ]
                    }
                }
            },
            {
                test : /\.sass$/,
                use : [MiniCssExtractPlugin.loader,"css-loader","sass-loader"]
            }
        ]
    }
}