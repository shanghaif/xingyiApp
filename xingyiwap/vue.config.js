const path = require('path')
const webpack = require("webpack")
module.exports = {
  publicPath: './',
  outputDir: '../www',  // 生成静态文件路径
  assetsDir: 'static',  // static文件夹路径
  lintOnSave: false,
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '兴义市掌上数据app'
      return args
    })
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
          path.resolve(__dirname, './src/assets/common/global.less')
      ]
    }
  },
  configureWebpack: {
    //支持jquery
    plugins: [
      new webpack.ProvidePlugin({
        $:"jquery",
        jQuery:"jquery",
        "windows.jQuery":"jquery"
      })
    ]
  },
}