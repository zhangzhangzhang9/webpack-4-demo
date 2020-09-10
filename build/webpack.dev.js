const path = require('path')
const webpack = require('webpack')
const baseConfig = require('./webpack.base.js')
const { smart } = require('webpack-merge')
const resolve = dir => path.resolve(__dirname, dir)
const assetsPath = dir => path.posix.join('static', dir)
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = smart(baseConfig, {
  mode: 'development',
  devtool: "#source-map",
  devServer: {
    port: 8080,
    contentBase: resolve('./../dist'),
    progress: true,
    quiet: true,
    inline: true, //自动刷新
    open: false, //自动打开浏览器
    historyApiFallback: true,
    compress: true
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: resolve('./../index.html'),
        filename: 'index.html',
        minify: {
            removeAttributeQuotes: true,
            collapseWhitespace: true
        }
    }),
    new MiniCssExtractPlugin({
      filename: assetsPath("css/[name].[hash:8].css")
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      {
        from: resolve('./../static'),
        to: './'
      }
    ])
  ]
})