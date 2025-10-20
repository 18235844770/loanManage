const path = require('path')
const webpack = require('webpack')
const packageJson = require('./package.json')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const GitRevision = new GitRevisionPlugin()
const buildDate = JSON.stringify(new Date().toLocaleString())
const createThemeColorReplacerPlugin = require('./config/plugin.config')

function resolve (dir) {
  return path.join(__dirname, dir)
}

function getGitHash () {
  try {
    return GitRevision.version()
  } catch (e) {}
  return 'unknown'
}

const vueConfig = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        APP_VERSION: `"${packageJson.version}"`,
        GIT_HASH: JSON.stringify(getGitHash()),
        BUILD_DATE: buildDate
      })
    ]
  },

  chainWebpack: config => {
    config.resolve.alias.set('@$', resolve('src'))
    config.resolve.alias.set('moment/locale', false)

    const svgRule = config.module.rule('svg')
    config.module.rules.delete('svg')

    config.module
      .rule('svg')
      .oneOf('svg_as_component')
      .resourceQuery(/inline/)
      .test(/\.(svg)(\?.*)?$/)
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .options({
        svgo: {
          plugins: [
            { prefixIds: true },
            { cleanupIDs: true },
            { convertShapeToPath: false },
            { convertStyleToAttrs: true }
          ]
        }
      })
      .end()
      .end()
      .oneOf('svg_as_regular')
      .merge(svgRule.toConfig())
      .end()
  },

  publicPath: '/',
  outputDir: 'ydManage',

  css: {
    loaderOptions: {
      less: {
        modifyVars: { 'border-radius-base': '2px' },
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    port: 8000,
    proxy: {
      '/baidu-map': {
        target: 'https://api.map.baidu.com',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/baidu-map': '' }
      },
      '/API': {
        target: 'http://8.133.23.44/loans',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/API': '' },
        // ✅ 添加伪造请求头配置
        onProxyReq (proxyReq, req, res) {
          proxyReq.setHeader('Origin', 'http://8.133.23.44')
          proxyReq.setHeader('Referer', 'http://8.133.23.44/')
        },
        onError (err, req, res) {
          console.error('[Proxy Error]', err)
          res.writeHead(500, { 'Content-Type': 'text/plain' })
          res.end('Proxy request failed.')
        }
      }
    }
  },

  productionSourceMap: false,
  transpileDependencies: []
}

// 主题色替换插件
if (process.env.VUE_APP_PREVIEW === 'true') {
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
