const path = require("path")
const fs = require('fs')

// Plugins
const CopyWebpackPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const DotEnvWebpackPlugin = require('dotenv-webpack')



// store version foe export
let version;
fs.readFile(path.resolve(__dirname, '../../version.txt'),"utf8",(err,data) => {version = data})

// create new html file base on template
fs.readFile(path.resolve(__dirname, '../src/index.html'),"utf8",(err,data) => {fs.writeFile(path.resolve(__dirname,'../../dist/index.html'),data.replace(/Version/g, version),()=>{})})

module.exports = {
    entry : "./src/index.js",
    output : {
        filename : ()=> { return `bundle${version}.js` },
        path : path.resolve(__dirname, '../../dist')
    },
    plugins:[
        new CopyWebpackPlugin({patterns : [
            {
                from:path.resolve(__dirname,'../../assets'),
                to:path.resolve(__dirname,'../../dist/assets'),
            }
        ]}),
        new HtmlWebpackPlugin({ template : './src/index.html' }),
        new MiniCssExtractPlugin(),
        new DotEnvWebpackPlugin({ path : path.resolve(__dirname,`../../.env.${process.env.NODE_ENV}`) })
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
                            "@babel/env",
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