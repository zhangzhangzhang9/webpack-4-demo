const path = require('path')
const webpack = require('webpack')
const resolve = dir => path.resolve(__dirname, dir)
const assetsPath = dir => path.posix.join('static', dir)
const baseConfig = require('./webpack.base.js')
const { smart } = require('webpack-merge')
// html插件，可以自动引入打包后的js和css
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
// 清除文件插件,每次build都可以吧原先打包的文件删掉
const CleanWebpackPlugin = require('clean-webpack-plugin')
// 可以把css从js中抽离出来的插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 压缩css插件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
// 压缩js插件
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
// 压缩gzip文件插件
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 拷贝静态资源插件
const CopyWebpackPlugin = require('copy-webpack-plugin')
const AutoDllPlugin = require('autodll-webpack-plugin');
module.exports = smart(baseConfig, {
  mode: 'production',
  // devtool: "eval",
  // 去除webpack打包文件过大警告
  performance: {
    hints: false, // 枚举
    maxAssetSize: 300000, // 整数类型（以字节为单位）
    maxEntrypointSize: 500000, // 整数类型（以字节为单位）
    assetFilter: function(assetFilename) {
    // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  optimization: {
    minimizer: [
      new OptimizeCssAssetsWebpackPlugin(),
      new UglifyjsWebpackPlugin({
        test: /\.js$/,
        // include: [resolve('./../src')],
        // exclude: /node_modules/,
        cache: true,
        parallel: 3,
        sourceMap: false,
        uglifyOptions: {
          parse: {},
          compress: {
            drop_console: true, // 打包后去除console.log
            collapse_vars: true, // 内嵌定义了但是只用到一次的变量
            reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
            pure_funcs: ['console.log']
          },
          mangle: true, // Note `mangle.properties` is `false` by default.
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_fnames: false,
        }
      })
    ]
  },
  plugins: [
    new CleanWebpackPlugin([resolve('./../dist/static')]),
    new HtmlWebpackPlugin({
        inject: true, // will inject the main bundle to index.html
        template: resolve('./../index.html'),
        filename: 'index.html',
        minify: {
            removeAttributeQuotes: true,
            collapseWhitespace: true
        }
    }),
    new AutoDllPlugin({
      inject: true,
      filename: '[name].[hash].js',
      plugins: [
        new UglifyjsWebpackPlugin({
          test: /\.js$/,
          cache: true,
          parallel: 3,
          sourceMap: false,
          uglifyOptions: {
            parse: {},
            compress: {
              drop_console: true, // 打包后去除console.log
              collapse_vars: true, // 内嵌定义了但是只用到一次的变量
              reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
              pure_funcs: ['console.log']
            },
            mangle: true, // Note `mangle.properties` is `false` by default.
            output: null,
            toplevel: false,
            nameCache: null,
            ie8: false,
            keep_fnames: false,
          }
        })
      ],
      entry: {
        vendor: [
          "axios",
          "fetch-jsonp",
          "jquery",
          "jsonp",
          "react",
          "react-dom",
          "react-router",
          "react-router-dom",
          "fastclick",
          "nprogress",
          "react-router-transition",
          "redux"
        ]
      }
    }),
    new MiniCssExtractPlugin({
      filename: assetsPath("css/[name].[hash:8].css")
    }),
    // new webpack.ProgressPlugin(),
    //作用域提升,提升代码在浏览器执行速度
    // new webpack.optimize.ModuleConcatenationPlugin(),

    //根据模块相对路径生成四位数hash值作为模块id
    // new webpack.HashedModuleIdsPlugin(),
    new CopyWebpackPlugin([
      {
        from: resolve('./../static'),
        to: './'
      }
    ]),
    // new ProgressBarPlugin(),
    // new webpack.optimize.SplitChunksPlugin(),
    // new webpack.BannerPlugin('make in 郭炯韦'),
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css)$/,
      threshold: 10240, //只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8 //只有压缩率小于这个值的资源才会被处理,默认值是 0.8
    })
  ]
})