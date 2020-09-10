const express = require('express')
const app = express()
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const devConfig = require('./build/webpack.dev.js')
const compiler = webpack(devConfig)
app.use(middleware(compiler))
app.get('/user', function(req, res){
  res.json({
    code: 200,
    msg: '请求成功'
  })
})
app.listen(3000, function() {
  console.log('服务启动成功')
})