/**
 * api mocker 反向代理配置
 * mocker 平台基于 rap2, 内网地址：http://mock.nixin8.com/
 * dev proxy 配置参考: https://cli.vuejs.org/zh/config/#devserver-proxy
 */
// let isUseDevServerProxy = true
// let apiProxyTarget = 'http://mock.nixin8.com/app/mock/19'
// let apiProxyMatches = ['/user', '/api']
// let devProxyOptions = undefined
// if (isUseDevServerProxy) {
//   devProxyOptions = {}
//   apiProxyMatches.forEach(api => {
//     devProxyOptions[api] = {
//       target: apiProxyTarget,
//       changeOrigin: true,
//       pathRewrite: (path, req) => '/' + req.method + '/' + path,
//       bypass: function (req, res, proxyOpt) {
//         res.set('RAD-PROXY', 'on');
//         res.set('RAD-PROXY-BY', apiProxyTarget);
//       }
//     }
//   })
// }



/**
 * 基础编译配置。
 * 更多配置项，请参考：https://cli.vuejs.org/config/
 */
module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.json', '.vue'],
      // alias: {
      //   vue: 'vue/dist/vue.js',
      // }
    },
  },
  baseUrl: './',
  assetsDir: 'static',
  devServer: {
    port: 8998,
    proxy: { // devProxyOptions
      '/': {
        ws: false, // proxy websockets
        target: 'http://mock.nixin8.com/app/mock',
        changeOrigin: true,
        pathRewrite: (path, req) => {
          let c = path.split('projectid=')
          if (c.length == 2) {
            return '/' + c[1] + '/' + req.method + '/' + c[0]
          } else {
            return '/' + req.method + '/' + c[0]
          }
        },
        bypass: function (req, res, proxyOpt) {
          res.set('RAD-PROXY', 'on');
          res.set('RAD-PROXY-BY', 'http://mock.nixin8.com/app/mock');
        }
      }
    }
  }
}