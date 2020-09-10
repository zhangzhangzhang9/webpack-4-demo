// 引入node path 模块
const path = require('path')
// 封装获取文件绝对路径方法
const resolve = dir => path.resolve(__dirname, dir)
// 封装拼接静态资源文件路径的方法
const assetsPath = dir => path.posix.join('static', dir)
// 从页面中抽离css的插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const AutoDllPlugin = require('autodll-webpack-plugin');
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: 3 });

module.exports = {
  // 入口文件
  entry: resolve('./../src/index.jsx'),
  // 打包文件出口
  output: {
    // js文件的名称
    filename: assetsPath('js/[name].[hash:8].js'),
    // 打包后的放置好路径和文件名称
    path: resolve('./../dist'),
    chunkFilename: assetsPath('js/[name].[hash:8].js'),
    // 打包后文件的公共前缀路径 可设置http或https
    publicPath: './'
  },
  module: {
    noParse: /jquery/,
    // 使用loader解析文件规则
    rules: [
      {
        test: /\.html$/, // 针对html
        use: 'html-withimg-loader' // 解析html文件中引入的图片路径和转base64位
      },
      {
        test: /\.(js|jsx)$/,
        include: [resolve('./../src')],
        exclude: /node_modules/,
        use: [ 'happypack/loader?id=js']
      },
      {
        test: /\.(css|scss)$/,
        include: [resolve('./../src'), /node_modules/],
        // exclude: /node_modules/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader', {
            loader: 'postcss-loader',
            options: {
            plugins: [
                require('autoprefixer')({
                  overrideBrowserslist : ['last 100 versions']
                })
              ]
            }
        }, 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        include: [resolve('./../src')],
        exclude: /node_modules/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        include: [resolve('./../src')],
        exclude: /node_modules/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        include: [resolve('./../src')],
        exclude: /node_modules/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  externals: {
    jquery: 'jQuery'
  },
  resolve: {
    modules: [resolve('./../node_modules')],
     //自动解析文件扩展名(补全文件后缀)(从左->右)
    // import hello from './hello'  （!hello.js? -> !hello.vue? -> !hello.json）
    extensions: [".js", ".jsx", ".json"],

    //配置别名映射
    alias: {
      'src': resolve('./../src'),
      'com': resolve('./../src/com')
    }
  },
  plugins: [
    new HappyPack({
      /*
        * 必须配置
        */
      // id 标识符，要和 rules 中指定的 id 对应起来
      id: 'js',
      // 需要使用的 loader，用法和 rules 中 Loader 配置一样
      // 可以直接是字符串，也可以是对象形式
      loaders: [
        { loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', "@babel/preset-react"],
            plugins: [
              ["@babel/plugin-proposal-decorators", { "legacy": true }],
              ["@babel/plugin-proposal-class-properties", { "loose" : true }
              ],
              "@babel/plugin-transform-runtime",
              // '@babel/plugin-syntax-dynamic-import'
            ],
            cacheDirectory: true
          }
        }
      ],
      threadPool: happyThreadPool
    }),
    new HappyPack({
      id: 'css',
      loaders: [
        { loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', "@babel/preset-react"],
            plugins: [
              ["@babel/plugin-proposal-decorators", { "legacy": true }],
              ["@babel/plugin-proposal-class-properties", { "loose" : true }
              ],
              "@babel/plugin-transform-runtime",
              '@babel/plugin-syntax-dynamic-import'
            ],
            cacheDirectory: true
          }
        }
      ],
      threadPool: happyThreadPool
    })
  ]
}