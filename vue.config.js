'use strict'
const path = require('path')
const pkg = require('./package.json')

function resolve(dir) {
  return path.join(__dirname, dir)
}

function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
const name = pkg.name || 'vue-element-admin' // page title
const port = 9901 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development' ? 'error' : false,
  productionSourceMap: false,
  devServer: {
    host: 'localhost',
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    devServer: {
      before(app) {
        // MOCK接口填写的地方，每次修改这个配置文件，都要重启项目
        // 模板
        // app.get('请求地址',(req,res)=>{
        //   res.json({
        //
        //   })
        // })
        const constantRoutes = [
          {
            path: '/redirect',
            component: 'layout/Layout',
            hidden: true,
            children: [
              {
                path: '/redirect/:path*',
                component: 'views/redirect/index'
              }
            ]
          },
          {
            path: '/login',
            component: 'views/login/index',
            hidden: true
          },
          {
            path: '/auth-redirect',
            component: 'views/login/authredirect',
            hidden: true
          },
          {
            path: '/404',
            component: 'views/errorPage/404',
            hidden: true
          },
          {
            path: '/401',
            component: 'views/errorPage/401',
            hidden: true
          },
          {
            path: '',
            component: 'layout/Layout',
            redirect: 'dashboard',
            children: [
              {
                path: 'dashboard',
                component: 'views/dashboard/index',
                name: 'Dashboard',
                meta: { title: 'dashboard', icon: 'dashboard', noCache: true, affix: true }
              }
            ]
          }
        ]
        const asyncRoutes = [
        ]
        const routes = deepClone([...constantRoutes, ...asyncRoutes])

        const roles = [
          {
            key: 'admin',
            name: 'admin',
            description: 'Super Administrator. Have access to view all pages.',
            routes: routes
          },
          {
            key: 'editor',
            name: 'editor',
            description: 'Normal Editor. Can see all pages except permission page',
            routes: routes.filter(i => i.path !== '/permission')// just a mock
          },
          {
            key: 'visitor',
            name: 'visitor',
            description: 'Just a visitor. Can only see the home page and the document page',
            routes: [{
              path: '',
              redirect: 'dashboard',
              children: [
                {
                  path: 'dashboard',
                  name: 'Dashboard',
                  meta: { title: 'dashboard', icon: 'dashboard' }
                }
              ]
            }]
          }
        ]

        const tokens = {
          admin: {
            token: 'admin-token'
          },
          editor: {
            token: 'editor-token'
          }
        }

        const users = {
          'admin-token': {
            roles: ['admin'],
            introduction: 'I am a super administrator',
            avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
            name: 'Super Admin'
          },
          'editor-token': {
            roles: ['editor'],
            introduction: 'I am an editor',
            avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
            name: 'Normal Editor'
          }
        }

        app.post('/api/user/login', (req, res) => {
          const token = tokens['admin']
          if (!token) {
            res.json({
              code: 60204,
              message: 'Account and password are incorrect.'
            })
          } else {
            res.json({
              code: 20000,
              data: token
            })
          }
        })

        app.get('/api/user/info', (req, res) => {
          const { token } = req.query
          const info = users[token]
          if (!info) {
            res.json({
              code: 50008,
              message: 'Login failed, unable to get user details.'
            })
          } else {
            res.json({
              code: 20000,
              data: info
            })
          }
        })

        app.post('/api/user/logout', (req, res) => {
          res.json({
            code: 20000,
            data: 'success'
          })
        })
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]element-ui[\\/]/
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
